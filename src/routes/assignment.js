import express from "express";
import AssignmentController from "../controllers/AssignmentController.js";

const router = express.Router();

router.get("/", AssignmentController.getAllAssignments);
router.post("/batch", AssignmentController.createBatchAssignments);
router.post("/batch/publish", AssignmentController.publishAllAssignments);
router.post("/batch/delete", AssignmentController.deleteBatchAssignments);

export default router;