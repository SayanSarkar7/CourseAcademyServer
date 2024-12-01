import  jwt  from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import { User } from "../models/User.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const {token}=req.cookies;

    if(!token) return next(new ErrorHandler("Not Logged In",401));

    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    console.log(decoded);
    console.log(`printing req.user: ${req.user}`);
    
    req.user=await User.findById(decoded._id);
    console.log(`printing again req.user: ${req.user}`);

    next();


});
