import express from "express";

const router = express.Router();

router.get("/courses");
router.get("/courses/:courseId");
router.get("/courses/:courseId/students");
router.get("/courses/:courseId/teachers");
router.get("/courses/:courseId/assignments");

export default router;