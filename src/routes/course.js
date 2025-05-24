import express from "express";
import CourseController from "../controllers/CourseController.js";

const router = express.Router();

router.get("/", CourseController.getAllCourses);
router.get("/:courseId", CourseController.getCourse);
router.get("/:courseId/students", (req, res) => {});
router.get("/:courseId/teachers", (req, res) => {});
router.get("/:courseId/assignments", (req, res) => {});

export default router;