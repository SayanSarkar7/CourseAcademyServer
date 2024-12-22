import express from "express";
import { authorizeAdmin, isAuthenticated } from "../middlewares/Auth.js";
import { contact, courseRequest, getAdminDashboardStats } from "../controllers/otherController.js";

const router=express.Router();

// Contact Form
router.route("/contact").post(contact);

// Request Form
router.route("/courserequest").post(courseRequest);

// Get Admin Dashboard Stats
router.route("/admin/stats").post(isAuthenticated,authorizeAdmin,getAdminDashboardStats);




export default router;





