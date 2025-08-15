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
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/deuxt0stn/image/upload/v1754918464/download_vggpl3.png",
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
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
    otp: String,
    otpExpiresAt: Date,
    resetPasswordOTP: String,
    resetPasswordOTPExpires: Date,
    passwordChangedAt: Date,
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
