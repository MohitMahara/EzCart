import express from "express";
import { makePaymentController, registerController } from "../controllers/authController.js";
import { loginController } from "../controllers/authController.js";
import { forgetPasswordController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { updateProfileController } from "../controllers/authController.js";
import {ordersController} from "../controllers/authController.js";

//router object

const router = express.Router();

// routing
// REGISTER || METHOD POST

router.post("/register", registerController);

// LOGIN || METHOD POST

router.post("/login", loginController);

// Forget Password

router.post("/forgot-password", forgetPasswordController);



// protected user route auth

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// protected Admin route auth

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});


// update profile

router.put("/profile", requireSignIn, updateProfileController);


// orders 

router.get("/orders", requireSignIn, ordersController);

// make payment 

router.post("/create-checkout-session", requireSignIn, makePaymentController)


export default router;
