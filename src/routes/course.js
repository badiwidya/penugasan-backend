import express from "express";
import CourseController from "../controllers/CourseController.js";

const router = express.Router();

router.get("/courses", CourseController.getAllCourses);
router.get("/courses/:courseId", CourseController.getCourse);
router.get("/courses/:courseId/students");
router.get("/courses/:courseId/teachers");
router.get("/courses/:courseId/assignments");

export default router;