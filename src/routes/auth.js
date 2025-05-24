import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.get("/google", AuthController.redirectAuth);
router.get("/google/callback", AuthController.callbackHandler);
router.post("/logout", AuthController.logout);

export default router;
