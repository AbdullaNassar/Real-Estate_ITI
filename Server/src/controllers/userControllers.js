import userModel from "../models/userModel.js";
import listModel from "../models/listModel.js";
import { sendOTPEmail } from "../utilities/sendEmail.utilies.js";
import bcrypt from "bcryptjs";
import Crypto from "crypto-js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import AppError from "../utilities/appError.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find(
    {},
    { password: 0, phoneNumber: 0, __v: 0 }
  );

  res.status(200).json({
    status: "Success",
    user_length: users.length,
    data: users,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const id = req.user._id;

  let { userName, email, phoneNumber, profilePic, gender, dateOfBirth } =
    req.body;

  if (
    !userName &&
    !email &&
    !phoneNumber &&
    !profilePic &&
    !gender &&
    !dateOfBirth
  ) {
    throw new AppError(
      { 
        en: "At least one field must be provided to update", 
        ar: "يجب تقديم حقل واحد على الأقل للتحديث" 
      }, 
      400
    );
  }

  if (phoneNumber) {
    phoneNumber = Crypto.AES.encrypt(
      phoneNumber,
      process.env.USER_PHONE_KEY
    ).toString();
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    id,
    {
      userName,
      email,
      phoneNumber,
      profilePic,
      gender,
      dateOfBirth,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    throw new AppError(
      { 
        en: "User not found", 
        ar: "لم يتم العثور على المستخدم" 
      }, 
      404
    );
  }

  res.status(200).json({
    status: "Success",
    message: { 
      en: "User updated successfully", 
      ar: "تم تحديث المستخدم بنجاح" 
    },
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const id = req.user._id;

  const deletedUser = await userModel.findByIdAndDelete(id);

  if (!deletedUser) {
    throw new AppError(
      { 
        en: "User not found", 
        ar: "لم يتم العثور على المستخدم" 
      }, 
      404
    );
  }

  res.status(200).json({
    status: "Success",
    message: { 
      en: "Profile Deleted successfully", 
      ar: "تم حذف الحساب بنجاح" 
    },
  });
});

export const deleteAllUsers = asyncHandler(async (req, res) => {
  const result = await userModel.deleteMany({ role: { $ne: "admin" } });

  if (result.deletedCount === 0) {
    throw new AppError(
      { 
        en: "No non-admin users found to delete", 
        ar: "لم يتم العثور على أي مستخدمين غير مسؤولين للحذف" 
      }, 
      404
    );
  }

  res.status(200).json({
    status: "Success",
    message: { 
      en: `${result.deletedCount} users deleted successfully`, 
      ar: `تم حذف ${result.deletedCount} مستخدم بنجاح` 
    },
  });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError(
      { 
        en: "Provide all fields", 
        ar: "يرجى تقديم جميع الحقول" 
      }, 
      400
    );
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new AppError(
      { 
        en: "User not found", 
        ar: "لم يتم العثور على المستخدم" 
      }, 
      404
    );
  }

  if (user.isVerified) {
    throw new AppError(
      { 
        en: "User already verified", 
        ar: "المستخدم تم التحقق منه مسبقًا" 
      }, 
      400
    );
  }

  const decryptUserOtp = Crypto.AES.decrypt(
    user.otp,
    process.env.USER_OTP_KEY
  ).toString(Crypto.enc.Utf8);

  const isOTPValid = decryptUserOtp === otp && user.otpExpiresAt > new Date();

  if (!isOTPValid) {
    throw new AppError(
      { 
        en: "Invalid or expired OTP", 
        ar: "رمز التحقق غير صالح أو منتهي الصلاحية" 
      }, 
      400
    );
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  res.status(200).json({
    status: "Success",
    message: { 
      en: "Email verified successfully", 
      ar: "تم التحقق من البريد الإلكتروني بنجاح" 
    },
  });
});

export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError(
      { 
        en: "Email is required", 
        ar: "البريد الإلكتروني مطلوب" 
      }, 
      400
    );
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new AppError(
      { 
        en: "User not found", 
        ar: "لم يتم العثور على المستخدم" 
      }, 
      404
    );
  }

  if (user.isVerified) {
    throw new AppError(
      { 
        en: "User is already verified", 
        ar: "المستخدم تم التحقق منه مسبقًا" 
      }, 
      400
    );
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Encrypt OTP before saving
  const encryptedOTP = Crypto.AES.encrypt(
    otp,
    process.env.USER_OTP_KEY
  ).toString();

  user.otp = encryptedOTP;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  await sendOTPEmail(user.email, otp);

  res.status(200).json({
    status: "Success",
    message: { 
      en: "New OTP sent to email", 
      ar: "تم إرسال رمز التحقق الجديد إلى البريد الإلكتروني" 
    },
  });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError(
      { 
        en: "Email is required", 
        ar: "البريد الإلكتروني مطلوب" 
      }, 
      400
    );
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new AppError(
      { 
        en: "User not found", 
        ar: "لم يتم العثور على المستخدم" 
      }, 
      404
    );
  }

  // Generate OTP and expiry
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Encrypt OTP before saving (optional, but recommended)
  const encryptedOTP = Crypto.AES.encrypt(
    otp,
    process.env.USER_OTP_KEY
  ).toString();

  user.resetPasswordOTP = encryptedOTP;
  user.resetPasswordOTPExpires = otpExpires;
  await user.save();

  // Send OTP email
  await sendOTPEmail(user.email, otp, false);

  res.status(200).json({
    status: "Success",
    message: { 
      en: "OTP sent to email for password reset", 
      ar: "تم إرسال رمز التحقق إلى البريد الإلكتروني لإعادة تعيين كلمة المرور" 
    },
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new AppError(
      { 
        en: "Provide all fields", 
        ar: "يرجى تقديم جميع الحقول" 
      }, 
      400
    );
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new AppError(
      { 
        en: "User not found", 
        ar: "لم يتم العثور على المستخدم" 
      }, 
      404
    );
  }

  // Decrypt stored OTP
  const decryptedOTP = Crypto.AES.decrypt(
    user.resetPasswordOTP,
    process.env.USER_OTP_KEY
  ).toString(Crypto.enc.Utf8);

  if (decryptedOTP !== otp || new Date() > user.resetPasswordOTPExpires) {
    throw new AppError(
      { 
        en: "Invalid or expired OTP", 
        ar: "رمز التحقق غير صالح أو منتهي الصلاحية" 
      }, 
      400
    );
  }

  user.password = newPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "Success",
    message: { 
      en: "Password reset successfully", 
      ar: "تم إعادة تعيين كلمة المرور بنجاح" 
    },
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new AppError(
      { 
        en: "All fields are required", 
        ar: "جميع الحقول مطلوبة" 
      }, 
      400
    );
  }

  if (newPassword !== confirmPassword) {
    throw new AppError(
      { 
        en: "Passwords do not match", 
        ar: "كلمتا المرور غير متطابقتين" 
      }, 
      400
    );
  }

  const user = await userModel.findById(req.user._id).select("+password");
  if (!user) {
    throw new AppError(
      { 
        en: "User not found", 
        ar: "لم يتم العثور على المستخدم" 
      }, 
      404
    );
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new AppError(
      { 
        en: "Current password is incorrect", 
        ar: "كلمة المرور الحالية غير صحيحة" 
      }, 
      400
    );
  }

  user.password = newPassword;
  await user.save();

  const token = jwt.sign(
    { id: user._id, userName: user.userName, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // set to true in production
    sameSite: "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({
    status: "Success",
    message: { 
      en: "Password changed successfully", 
      ar: "تم تغيير كلمة المرور بنجاح" 
    },
  });
});

export const getUserInfo = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError(
      { 
        en: "User not found", 
        ar: "لم يتم العثور على المستخدم" 
      }, 
      404
    );
  }

  const {
    _id: id,
    userName,
    email,
    role,
    isVerified,
    gender,
    profilePic,
    dateOfBirth,
    phoneNumber,
    createdAt,
  } = req.user;

  let decryptedPhone = "";
  if (phoneNumber) {
    decryptedPhone = Crypto.AES.decrypt(
      phoneNumber,
      process.env.USER_PHONE_KEY
    ).toString(Crypto.enc.Utf8);
  }

  res.status(200).json({
    status: "Success",
    user: {
      id,
      userName,
      email,
      role,
      isVerified,
      profilePic,
      gender,
      dateOfBirth,
      phoneNumber: decryptedPhone,
      createdAt,
    },
  });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  const userId = req.user._id;

  const listing = await listModel.findById(listingId);
  if (!listing){ 
    throw new AppError(
      { 
        en: "Listing not found", 
        ar: "لم يتم العثور على القائمة" 
      }, 
      404
    )
  };

  const user = await userModel.findById(userId);

  const index = user.favorites.indexOf(listingId);
  if (index > -1) {
    // Listing already favorited, remove it
    user.favorites.splice(index, 1);
  } else {
    // Add to favorites
    user.favorites.push(listingId);
  }

  await user.save();
  res.status(200).json({ favorites: user.favorites });
});

export const getUserFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await userModel.findById(userId).populate("favorites");

  res.status(200).json({ favorites: user.favorites });
});
