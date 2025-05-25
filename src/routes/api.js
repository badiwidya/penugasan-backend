import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import courseRoute from "./course.js";
import assignmentRoute from "./assignment.js";

const router = express.Router();

router.use(authMiddleware);

router.use("/courses", courseRoute);

router.use("/assignments", assignmentRoute);

export default router;