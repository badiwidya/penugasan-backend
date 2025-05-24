import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.get("/auth/google", AuthController.redirectAuth);
router.get("/auth/google/callback", AuthController.callbackHandler);
router.post("/logout", logout);

export default router;
