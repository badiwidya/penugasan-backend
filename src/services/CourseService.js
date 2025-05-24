import { classroom } from "../config/googleConfig";

class CourseService {
    constructor() {
        this.classroom = classroom;
    }

    async listCourses() {
        try {
            const response = await this.classroom.courses.list({
                teacherId: "me",
                courseStates: ["ACTIVE"],
                pageSize: 20,
            });

            return response.data.courses || [];
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data kelas:", error);
            const err = new Error("Gagal mengambil data kelas");
            err.statusCode = error.code || 500;

            throw err;
        }
    }
}

export default new CourseService();