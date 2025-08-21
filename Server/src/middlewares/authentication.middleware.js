import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import AppError from "../utilities/appError.js";
import { asyncHandler } from "./asyncHandlerError.middleware.js";

export const isUserLoggedIn =asyncHandler( async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(
      new AppError(
        {
          en: "You are not authorized to access this route, please login first",
          ar: "غير مصرح لك بالدخول إلى هذا المسار، يرجى تسجيل الدخول أولاً"
        },
        401
      )
    );
  }

  const payLoad = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findById(payLoad.id);

  if (!user) {
    return next(
      new AppError(
        {
          en: "User not found",
          ar: "المستخدم غير موجود"
        },
        404
      )
    );
  }

  req.user = user;
  next();
});
