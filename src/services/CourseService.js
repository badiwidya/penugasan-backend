import { classroom } from "../config/googleConfig.js";

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

    async getCourse(courseId) {
        try {
            const response = await this.classroom.courses.get({
                id: courseId,
            });

            return response.data;
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data kelas:", error);
            const err = new Error("Gagal mengambil data kelas");
            err.statusCode = error.code || 500;

            throw err;
        }
    }

    async getStudents(courseId) {
        try {
            const response = await this.classroom.courses.students.list({
                courseId,
                pageSize: 20,
            });

            return response.data;
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data murid:", error);
            const err = new Error("Gagal mengambil data murid");
            err.statusCode = error.code || 500;

            throw err;
        }
    }

    async getTeachers(courseId) {
        try {
            const response = await this.classroom.courses.teachers.list({
                courseId,
                pageSize: 20,
            });

            return response.data;
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data guru:", error);
            const err = new Error("Gagal mengambil data guru");
            err.statusCode = error.code || 500;

            throw err;
        }
    }

    async getAssignments(courseId) {
        try {
            const response = await this.classroom.courses.courseWork.list({
                courseId,
                courseWorkState: ["PUBLISHED", "DRAFT"],
                pageSize: 200
            });

            return response.data;
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data tugas di kelas:", error);
            const err = new Error("Gagal mengambil data tugas di kelas", courseId);
            err.statusCode = error.code || 500;

            throw err;
        }
    }
}

export default new CourseService();
