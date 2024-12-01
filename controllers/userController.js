import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";
import { sendToken } from "../utils/sendToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // const file=req.file; // avatar

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exist", 409)); //The HTTP 409 status code, also known as the "conflict" error,
  }

  // upload file on cloudinary

  user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "temp id",
      url: "temp url",
    },
  });
  console.log(`in userController logging user: ${user}`);

  sendToken(res, user, "Registered Succesfully", 201);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // const file=req.file; // avatar

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

  console.log(`in userController logging user: ${user}`);

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

export const updateProfile=catchAsyncErrors(async (req,res,next)=>{
  const {name,email}=req.body;

  const user=await User.findById(req.user._id);

  if(name ) user.name=name;
  if(email ) user.name=email;

  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
  });

})

export const updateProfilePicture=catchAsyncErrors(async (req,res,next)=>{
  //cloudinary:todo
  res.status(200).json({
    success:true,
    message:"Profile Picture Updated Successfully",
  })
})
