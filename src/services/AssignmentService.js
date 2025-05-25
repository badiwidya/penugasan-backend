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

    async createAssignment(courseId, assignment) {
        try {
            if (!assignment || !assignment.title) {
                throw new Error("Judul tugas diperlukan!");
            }

            const response = await this.classroom.courses.courseWork.create({
                courseId,
                requestBody: {
                    ...assignment,
                    workType: "ASSIGNMENT",
                    state: "PUBLISHED",
                },
            });

            return {
                courseId,
                success: true,
                assignment: response.data,
            };
        } catch (error) {
            console.error("Terjadi kesalahan saat membuat tugas baru untuk", courseId, ", Error:", error.message);

            return {
                courseId,
                success: false,
                error: error.message || "Internal server error",
            };
        }
    }

    async createBatchAssignments(assignments) {
        try {
            const assignmentsPromises = assignments.map(async ({ courseId, assignment }) => {
                try {
                    if (assignment.maxPoints !== undefined) {
                        assignment.maxPoints = Math.max(0, parseInt(assignment.maxPoints) || 0);
                    }

                    if (assignment.dueDate) {
                        const dueDate = new Date(assignment.dueDate);
                        assignment.dueDate = {
                            year: dueDate.getUTCFullYear(),
                            month: dueDate.getUTCMonth() + 1,
                            day: dueDate.getUTCDate(),
                        };
                        assignment.dueTime = {
                            hours: dueDate.getUTCHours(),
                            minutes: dueDate.getUTCMinutes(),
                        };
                    }

                    return this.createAssignment(courseId, assignment);
                } catch (error) {
                    console.error("Terjadi kesalahan saat membuat tugas baru:", error.message);
                    return {
                        courseId,
                        success: false,
                        error: error.message,
                    };
                }
            });

            const response = await Promise.all(assignmentsPromises);

            return response;
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data tugas di kelas:", error);
            const err = new Error("Gagal mengambil data tugas di kelas", courseId);
            err.statusCode = error.code || 500;

            throw err;
        }
    }
}

export default new AssignmentService();
