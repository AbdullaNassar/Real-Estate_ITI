import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const isUserLoggedIn = async (req, res, next) => {
  try {
    // if (!req.headers.authorization.startsWith("Bearer")) {
    //   return res.status(400).json({
    //     status: "Failed",
    //     message: "Bearer Token Is Required",
    //   });
    // }

    // let token = req.headers.authorization.split(" ")[1];
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        status: "Failed",
        message:
          "you are not authorized to access this route,please login first",
      });
    }

    const payLoad = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(payLoad.id);

    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "User Not Found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      status: "Failed",
      message: "Invalid Token",
      error: error.message,
    });
  }
};
