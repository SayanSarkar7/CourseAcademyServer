import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import { User } from "../models/User.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return next(new ErrorHandler("Not Logged In", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   console.log(decoded);
//   console.log(`printing req.user: ${req.user}`);

  req.user = await User.findById(decoded._id);
//   console.log(`printing again req.user: ${req.user}`);

  next();
});
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role != "admin")
    return next(
      new ErrorHandler(
        `${req.user.role} is not allowed to access this resource`,
        403
      )
    );
  next();
};
export const authorizeSubscribers = (req, res, next) => {
  if (req.user.subscription.status !== "active" && req.user.role !== "admin")
    return next(
      new ErrorHandler(
        "Only subscribers can access this resource",
        403
      )
    );
  next();
};
