import express from "express";
import CourseController from "../controllers/CourseController.js";

const router = express.Router();

router.get("/", CourseController.getAllCourses);

export default router;