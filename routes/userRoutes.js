import express from "express";
import { register } from "../controllers/userController.js";
 
const router=express.Router();


// To register a new user
router.route("/register").post(register);


// Login
// Logout
// Get my profile

// Change Password
// Update Profile
// Update Profile Picture

// Forget Password
// Reset Password


// AddToPlaylist
// RemoveFromPlaylist


export default router;
