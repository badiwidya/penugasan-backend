import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import courseRoute from "./course.js";

const router = express.Router();

router.use(authMiddleware);

router.use("/courses", courseRoute);

export default router;