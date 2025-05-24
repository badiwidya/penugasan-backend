import express from "express";
import CourseController from "../controllers/CourseController.js";

const router = express.Router();

router.get("/", CourseController.getAllCourses);
router.get("/:courseId", CourseController.getCourse);
router.get("/:courseId/students", CourseController.getStudents);
router.get("/:courseId/teachers", CourseController.getTeachers);
router.get("/:courseId/assignments", CourseController.getAssignmentsForCourse);

export default router;