import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Crypto from "crypto-js";
import { sendOTPEmail } from "../utilities/sendEmail.utilies.js";

const generateToken = (id, userName, role) => {
  return jwt.sign({ id, userName, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const isCorrectPassword = async (currentPassword, userPassword) => {
  return await bcrypt.compare(currentPassword, userPassword);
};

export const signUp = async (req, res) => {
  try {
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
    console.log("here", req.body);

    if (!userName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: "Failed",
        message: "Please provide all required fields",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "Failed",
        message: "Password Don't Match",
      });
    }

    const isUserExist = await userModel.findOne({ email: email });

    if (isUserExist) {
      return res.status(409).json({
        status: "Failed",
        message: "User Already Exists",
      });
    }

    const otp = Math.floor(10000 + Math.random() * 900000).toString();

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);    


    const profilePic =
      "https://res.cloudinary.com/dxfmw4nch/image/upload/v1753882410/profilePics/muxts6jedfnjupzdqzgf.jpg";

    console.log("sadsd");
    const user = await userModel.create({
      userName,
      email,
      password,
      gender,
      role,
      // dateOfBirth,
      phoneNumber,
      profilePic,
      otp,
      otpExpiresAt,
    });
    console.log("okk");

    await sendOTPEmail(user.email, otp);

    return res.status(201).json({
      status: "Success",
      message: "User Created Successfuly",
    });
  } catch (error) {
    return res.status(501).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "Faild",
        message: "please provide email and password",
      });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User Must Register First",
      });
    }

    const ispasswordMatch = await isCorrectPassword(password, user.password);

    if (!ispasswordMatch) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid Eamil Or Password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        status: "Failed",
        message: "Please verify your email via OTP first",
      });
    }

    const token = generateToken(user._id, user.userName, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // only secure in prod
      sameSite: "Lax", // or "None" if you're testing cross-site (rarely needed in localhost)
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return res.status(200).json({
      status: "Success",
      message: "User Logged In Successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "internal Server Error",
      error: error.message,
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    res
      .status(200)
      .json({ status: "success", message: "User logged out succssfully" });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
