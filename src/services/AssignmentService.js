import { classroom } from "../config/googleConfig.js";
import classesService from "./CourseService.js";

class AssignmentService {
    constructor() {
        this.classroom = classroom;
        this.helper = classesService;
    }

    async listAssignments() {
        try {
            const courses = await this.helper.listCourses();

            const assignmentPromises = courses.map(async (course) => {
                const coursesAssignments = await this.helper.getAssignments(course.id);

                return {
                    courseId: course.id,
                    assignments: coursesAssignments,
                };
            });

            const assignments = await Promise.all(assignmentPromises);

            return assignments;
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data tugas di kelas:", error);
            const err = new Error("Gagal mengambil data tugas di kelas", courseId);
            err.statusCode = error.code || 500;

            throw err;
        }
    }
}

export default new AssignmentService();