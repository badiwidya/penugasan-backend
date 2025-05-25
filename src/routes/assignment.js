import express from "express";
import AssignmentController from "../controllers/AssignmentController.js";

const router = express.Router();

router.get("/", AssignmentController.getAllAssignments);
router.get("/", (req, res) => {});
router.get("/", (req, res) => {});
router.get("/", (req, res) => {});
router.get("/", (req, res) => {});
router.get("/", (req, res) => {});

export default router;