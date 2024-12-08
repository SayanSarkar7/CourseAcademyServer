import express from "express";
import { addToPlaylist, changePassword, forgetPassword, getMyProfile, login, logout, register, removeFromPlaylist, resetPassword, updateProfile, updateProfilePicture } from "../controllers/userController.js";
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
router.route("/forgetpassword").post(forgetPassword);
// Reset Password
router.route("/resetpassword/:token").put(resetPassword);


// AddToPlaylist
router.route("/addtoplaylist").post(isAuthenticated,addToPlaylist);
// RemoveFromPlaylist
router.route("/removefromplaylist").delete(isAuthenticated,removeFromPlaylist);


export default router;
