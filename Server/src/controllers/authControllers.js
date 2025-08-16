import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "../utilities/sendEmail.utilies.js";
import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import AppError from "../utilities/appError.js";

const generateToken = (id, userName, role) => {
  return jwt.sign({ id, userName, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const isCorrectPassword = async (currentPassword, userPassword) => {
  return await bcrypt.compare(currentPassword, userPassword);
};

export const signUp = asyncHandler(async (req, res, next) => {
  const {
    userName,
    email,
    password,
    confirmPassword,
    gender,
    role,
    dateOfBirth,
    phoneNumber,
  } = req.body;

  if (!userName || !email || !password || !confirmPassword) {
    return next(new AppError("Please provide all required fields", 400));
  }
  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    return next(new AppError("User already exists", 409));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const profilePic =
    "https://res.cloudinary.com/dxfmw4nch/image/upload/v1753882410/profilePics/muxts6jedfnjupzdqzgf.jpg";

  const user = await userModel.create({
    userName,
    email,
    password,
    gender,
    role,
    dateOfBirth,
    phoneNumber,
    profilePic,
    otp,
    otpExpiresAt,
  });

  await sendOTPEmail(user.email, otp);

  res.status(201).json({
    status: "success",
    message: "User created successfully",
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError("Invalid email or password", 400));
  }

  const isPasswordMatch = await isCorrectPassword(password, user.password);
  if (!isPasswordMatch) {
    return next(new AppError("Invalid email or password", 400));
  }

  if (!user.isVerified) {
    return next(new AppError("Please verify your email via OTP first", 403));
  }

  const token = generateToken(user._id, user.userName, user.role);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set true in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site in prod, lax in dev
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    token,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
});
