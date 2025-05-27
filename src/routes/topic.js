import TopicController from "../controllers/TopicContoller.js";
import express from "express";

const router = express.Router();

router.get("/", TopicController.getAllTopics);

export default router;