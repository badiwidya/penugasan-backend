import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import courseRoute from "./course.js";
import assignmentRoute from "./assignment.js";
import topicsRoute from "./topic.js";

const router = express.Router();

router.use(authMiddleware);

router.use("/courses", courseRoute);

router.use("/assignments", assignmentRoute);

router.use("/topics", topicsRoute);

router.get("/get-image", async (req, res) => {
    const url = req.query.url;

    try {
        const imageResponse = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://accounts.google.com',
            }
        });
        if (!imageResponse.ok) {
            throw new Error("Gagal mengambil gambar");
        }

        res.set("Content-Type", imageResponse.headers.get("content-type"));
        const buffer = await imageResponse.arrayBuffer();

        res.send(Buffer.from(buffer));
    } catch (error) {
        next(error);
    }
});

export default router;