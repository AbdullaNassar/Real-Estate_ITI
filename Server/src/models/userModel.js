import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import Crypto from "crypto-js";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      requierd: [true, "Username is required"],
      minLength: [
        3,
        "Username must be at Least 3 characters and you Put {VALUE} characters",
      ],
      maxLength: [
        50,
        "Username must be at Most 50 characters and you Put {VALUE} cahracters",
      ],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      requierd: [true, "Email is required"],
      minLength: [3, "Email must be at Least 3 characters"],
      maxLength: [50, "Email must be at Most 50 characters"],
      trim: true,
      unique: [true, "you are already registered "],
      lowercase: true,
      validate: {
        validator: (value) => {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: "Please enter a Valid Email Address",
      },
    },
    password: {
      type: String,
      requierd: [true, "Password is required"],
      minLength: [
        8,
        "password must at Least 8 characters and you Put {VALUE} characters",
      ],
      maxLength: [
        100,
        "[password must be at Most 100 Characters and you Put {VALUE} characters",
      ],
      // validate:{
      //     validator: (value)=>{
      //         return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,100}$/.test(value);
      //     },
      //     message:"password Must Contain At Least One Uppercase Letter, One Lowercase Letter, and One Number"
      // }
    },
    profilePic: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    role: {
      type: String,
      enum: ["host", "admin", "guest"],
      default: "guest",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    dateOfBirth: {
      type: Date,
    },
    phoneNumber: {
      type: String,
      // requierd:[true,'Phone Number is required'],
      // unique:[true,'This Number Registerd Before'],
      //Egyption Phone Number
      // validate:{
      //     validator: (value)=>{
      //         return /^01[0-2,5]\d{8}$/.test(value);
      //     },
      //     message:"Please enter a Valid Phone Number"
      // }
    },
    otp: String,
    otpExpiresAt: Date,
    resetPasswordOTP: String,
    resetPasswordOTPExpires: Date,
    passwordChangedAt:Date
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = bcrypt.hashSync(this.password, +process.env.HASHING_SALT);
      this.passwordChangedAt = Date.now() - 1000;
    }

    if (this.isModified("phoneNumber") && this.phoneNumber) {
      this.phoneNumber = Crypto.AES.encrypt(
        this.phoneNumber,
        process.env.USER_PHONE_KEY
      ).toString();
    }

    if (this.isModified("otp") && this.otp) {
      this.otp = Crypto.AES.encrypt(
        this.otp,
        process.env.USER_OTP_KEY
      ).toString();
    }

    next();
  } catch (err) {
    next(err);
  }
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
