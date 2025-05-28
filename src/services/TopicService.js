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
                const courseTopics = await this.helper.getTopics(course.id);

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

    async createBatchTopics(topics) {
        const successfullyCreated = [];

        const response = await Promise.allSettled(
            topics.map(async ({ topic, courseId }) => {
                try {
                    const apiResponse = await this.classroom.courses.topics.create({
                        courseId,
                        requestBody: {
                            name: topic,
                        },
                    });

                    successfullyCreated.push({
                        courseId,
                        topicId: apiResponse.data.topicId,
                    });

                    return {
                        courseId,
                        status: true,
                    };
                } catch (error) {
                    console.log("Terjadi error saat membuat topik di:", courseId, " Error:", error.message);
                    return {
                        courseId,
                        status: false,
                    };
                }
            })
        );

        const hasFailed = response.some((r) => r.value.status === false);

        if (hasFailed) {
            await Promise.allSettled(
                successfullyCreated.map(async ({ courseId, topicId }) => {
                    await this.classroom.courses.topics.delete({
                        courseId,
                        id: topicId,
                    });
                })
            );

            return {
                status: false,
                message: "Ada topik yang gagal dibuat, berhasil rollback",
            };
        }

        return {
            status: true,
            message: "Semua tugas berhasil dibuat",
        };
    }
}

export default new TopicService();
