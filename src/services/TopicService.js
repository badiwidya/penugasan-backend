import { classroom } from "../config/googleConfig.js";
import classesService from "./CourseService.js";

class TopicService {
    constructor() {
        this.classroom = classroom;
        this.helper = classesService;
    }

    async listTopics() {
        try {
            const courses = await this.helper.listCourses();

            const topicsPromises = courses.map(async (course) => {
                const courseTopics = await this.helper.getCourse(course.id);

                return {
                    courseId: course.id,
                    topics: courseTopics,
                };
            });

            const topics = await Promise.all(topicsPromises);

            return topics;
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data topik di kelas:", error);
            const err = new Error("Gagal mengambil data topik di kelas", courseId);
            err.statusCode = error.code || 500;

            throw err;
        }
    }

    async createTopic(topic, courseId) {
        try {
            const res = await this.classroom.courses.topics.create({
                courseId,
                requestBody: {
                    name: topic,
                },
            });

            return {
                courseId,
                success: true,
                topic: res.data,
            };
        } catch (error) {
            console.error("Terjadi kesalahan saat membuat topik baru untuk", courseId, ", Error:", error.message);

            return {
                courseId,
                success: false,
                error: error.message || "Internal server error",
            };
        }
    }

    async createBatchTopics(topics) {
        try {
            const topicsPromises = topics.map(async ({ topic, courseId }) => {
                try {
                    return this.createTopic(topic.name, courseId);
                } catch (error) {
                    console.log("Terjadi error saat membuat topik untuk kelas", courseId);
                    throw error;
                }
            });

            const response = await Promise.all(topicsPromises);

            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default new TopicService();
