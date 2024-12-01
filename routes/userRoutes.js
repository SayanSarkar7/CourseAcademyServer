import express from "express";
import { login, logout, register } from "../controllers/userController.js";
 
const router=express.Router();


// To register a new user
router.route("/register").post(register);


// Login
router.route("/login").post(login);
// Logout
router.route("/logout").get(logout);
// Get my profile

// Change Password
// Update Profile
// Update Profile Picture

// Forget Password
// Reset Password


// AddToPlaylist
// RemoveFromPlaylist


export default router;
