import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";


export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const file=req.file; // avatar
  

  

  
  if (!name || !email || !password || !file) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exist", 409)); //The HTTP 409 status code, also known as the "conflict" error,
  }

  // upload file on cloudinary
  const fileUri = getDataUri(file);
  
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);


  user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  console.log(`in userController logging user: ${user}`);

  sendToken(res, user, "Registered Succesfully", 201);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

 

  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Incorect email or password", 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Incorect email or password", 401));
  }

  // upload file on cloudinary

  // console.log(`in userController login user: ${user}`);

  sendToken(res, user, `Welcome Back, ${user.name}`, 200);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      // secure:true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

export const getMyProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const changePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Enter all fields", 400));
  }
  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Incorrect Old Password", 400));
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
  });
});

export const updateProfilePicture = catchAsyncErrors(async (req, res, next) => {
  // upload file on cloudinary
  const file=req.file; // avatar

  if(!file){
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const user=await User.findById(req.user._id);

  const fileUri = getDataUri(file);
  
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);


  user.avatar={
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Picture Updated Successfully",
  });
});

export const forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User Not Found", 400));
  }
  const resetToken = await user.getResetToken();
  // console.log(resetToken);
  await user.save();

  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // console.log(url);

  const message = `Click on the link to reset your password. ${url} . If you have not requested then please ignore.`;

  // console.log(message);

  //send token via email
  await sendEmail(user.email, "CourseAcademy Reset Password", message);
  res.status(200).json({
    success: true,
    message: `Reset Token has been sent to ${user.email}`,
  });
});
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user)
    return next(new ErrorHandler("Token is invalid or has been expired", 401));

  user.password = req.body.password;

  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
    token,
  });
});

export const addToPlaylist = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const course = await Course.findById(req.body.id);

  if (!course) return next(new ErrorHandler("Invalid Course Id", 404));


  // console.log();
  

  const itemExist = user.playlist.find((item) => {
    console.log(item);
    
    if (item.course.toString() === course._id.toString()) return true;
  });

  if (itemExist) return next(new ErrorHandler("Item Already Exist", 409));

  user.playlist.push({
    course: course._id,
    poster: course.poster.url,
  });
  
  await user.save();
  res.status(200).json({
    success: true,
    message: "Added to playlist",
  });
});
export const removeFromPlaylist = catchAsyncErrors(
  async (req, res, next) => {
    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.query.id);
  
    if (!course) return next(new ErrorHandler("Invalid Course Id", 404));
  
  
    const newPlaylist=user.playlist.filter(item=>{
      if(item.course.toString()!==course._id.toString()) return item;
    })
  
    user.playlist=newPlaylist;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Removed from playlist",
    });
  }
);
