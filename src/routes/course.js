import express from "express";
import CourseController from "../controllers/CourseController.js";

const router = express.Router();

router.get("/", CourseController.getAllCourses);
router.get("/:courseId", CourseController.getCourse);
router.get("/:courseId/students");
router.get("/:courseId/teachers");
router.get("/:courseId/assignments");

export default router;