import AppError from "../utilities/appError.js"

export const notFound = (req,res,next)=>{
    next(new AppError(`This Path ${req.originalUrl} Not Found`,404));
}