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
}

export default new TopicService();