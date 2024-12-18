import express from "express";
import {isAuthenticated} from "../middlewares/Auth.js";
import { buySubscription } from "../controllers/paymentController.js";


const router=express.Router();

router.route("/subscription").get(isAuthenticated,buySubscription);
router.route("/subscription").get(isAuthenticated,verifySubscription);


export default router;
