import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import Crypto from 'crypto-js';
import { sendOTPEmail } from "../utilities/sendEmail.utilies.js";

const generateToken = (id,userName,role)=>{
    return jwt.sign(
        {id,userName,role},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );
}

const isCorrectPassword =async (currentPassword,userPassword)=>{
    return await bcrypt.compare(currentPassword,userPassword)
}

export const signUp = async (req,res)=>{
    try {
        const {
            userName,
            email,
            password,
            confirmPassword,
            gender,
            role,
            dateOfBirth,
            phoneNumber
        }= req.body;
        

        if(!userName || !email || !password || !confirmPassword){
            return res.status(400).json({
                status:"Failed",
                message:"Please provide all required fields"
            })
        }
        if(password!==confirmPassword){
            return res.status(400).json({
                status:"Failed",
                message:"Password Don't Match"
            })
        }

        const isUserExist = await userModel.findOne({email:email});
        if(isUserExist){
            return res.status(409).json({
                status:"Failed",
                message:"User Already Exists"
            })
        }

        const otp =  Math.floor(10000 + Math.random()*900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
                
        const user = await userModel.create({
            userName,
            email,
            password,
            gender,
            role,
            dateOfBirth,
            phoneNumber,
            otp,
            otpExpiresAt
        });

        await sendOTPEmail(user.email,otp);

        return res.status(201).json({
            status:"Success",
            message:"User Created Successfuly",
        })
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error: error.message,
        })
    }
}

export const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                status:"Faild",
                message:"please provide email and password"
            });
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({
                status:"failed",
                message:"User Must Register First"
            });
        }

        const ispasswordMatch =await isCorrectPassword(password,user.password);

        if(!ispasswordMatch){
            return res.status(401).json({
                status:"Failed",
                message:"Invalid Eamil Or Password"
            });
        }

        if(user.phoneNumber){
            const decryptPhoneNumber = Crypto.AES.decrypt(
                user.phoneNumber,
                process.env.USER_PASSWORD_KEY
            ).toString(Crypto.enc.Utf8);
            console.log(decryptPhoneNumber);
            
            user.phoneNumber = decryptPhoneNumber;
            await user.save();
        }

        if (!user.isVerified) {
            return res.status(403).json({
                status:"Failed",
                message: 'Please verify your email via OTP first' 
                });
            }
        const token = generateToken(user._id,user.userName,user.role);
        return res.status(200).json({
            status:"Success",
            message:"User Logged In Successfully",
            token:token
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"internal Server Error",
            error: error.message
        })
    }
} 

export const isUserLoggedIn = async (req,res,next)=>{
    try {
        let token="";
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
            return res.status(401).json({
                status:"Failed",
                message:"you are not authorized to access this route,please login first"
            })
        }

        const payLoad = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(payLoad.id);

        if(!user){
            return es.status(404).json({
                status:"Failed",
                message:"User Not Found"
            })
        }


        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"internal Server Error",
            error: error.message
        })
    }
}

export const userPermission = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user?.role)){
            return res.status(403).json({
                status:"Failed",
                message:"You do not have permission to access this route"
            });
        }
        next();
    }
}