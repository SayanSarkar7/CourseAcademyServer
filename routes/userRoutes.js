import express from "express";
import { changePassword, getMyProfile, login, logout, register, updateProfile, updateProfilePicture } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/Auth.js";
 
const router=express.Router();


// To register a new user
router.route("/register").post(register);


// Login
router.route("/login").post(login);
// Logout
router.route("/logout").get(logout);
// Get my profile
router.route("/me").get(isAuthenticated,getMyProfile);

// Change Password
router.route("/changepassword").put(isAuthenticated,changePassword);
// Update Profile
router.route("/updateprofile").put(isAuthenticated,updateProfile);
// Update Profile Picture
router.route("/updateprofilepicture").put(isAuthenticated,updateProfilePicture);

// Forget Password
// Reset Password


// AddToPlaylist
// RemoveFromPlaylist


export default router;
