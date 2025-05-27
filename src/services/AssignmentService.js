import { classroom } from "../config/googleConfig.js";
import classesService from "./CourseService.js";

class AssignmentService {
    constructor() {
        this.classroom = classroom;
        this.helper = classesService;
    }

    /* 
    Expected Response (karena semua kelas bakal sama konten tugas dan topiknya)
    {
        pairIds: {
            "courseId": {
                "assName": "assId",
                "topName": "topId"
            }
        },
        assignments: {
            top1: [],
            top2: [],
            top3: []
        }
    }
    
    */

    async listAssignments() {
        try {
            const courses = await this.helper.listCourses();
            const assignments = {};
            const pairIds = {};
            const firstAssignmentSuccess = false;

            await Promise.all(
                courses.map(async (course) => {
                    try {
                        const [assignmentsForCourse, topicsForCourse] = await Promise.all([
                            this.helper.getAssignments(course.id),
                            this.helper.getTopics(course.id),
                        ]);

                        pairIds[course.id] = {};

                        assignmentsForCourse.forEach((assignment) => {
                            pairIds[course.id][assignment.title] = assignment.id;
                        });

                        topicsForCourse.forEach((topic) => {
                            pairIds[course.id][topic.name] = topic.id;
                        });

                        pairIds[course.id].status = true;

                        if (!firstAssignmentSuccess) {
                            topicsForCourse.forEach((topic) => {
                                if (!(topic.name in assignments)) {
                                    assignments[topic.name] = {};
                                }
                            });

                            assignmentsForCourse.forEach((assignment) => {
                                const topicName = topicsAvailable.find((topic) => topic.id === assignment.topicId).name;

                                let dueDate = null;
                                if (assignment.dueDate) {
                                    dueDate = this.parseDueDateTime(assignment.dueDate, assignment.dueTime);
                                }

                                assignments[topicName].push({
                                    name: assignment.title,
                                    description: assignment.description,
                                    dueDate: dueDate ? dueDate.toISOString() : null,
                                    maxPoints: assignment.maxPoints,
                                    creationTime: assignment.creationTime,
                                    scheduledTime: assignment.scheduledTime,
                                    materials: assignment.materials,
                                });
                            });
                            firstAssignmentSuccess = true;
                        }
                    } catch (error) {
                        console.log(
                            "Terjadi error saat mengambil data pairId untuk kelas",
                            course.id,
                            "error:",
                            error.message
                        );
                        pairIds[course.id] = {
                            status: false,
                        };
                    }
                })
            );

            return { assignments, pairIds };
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data tugas di kelas:", error.message);
            const err = new Error("Gagal mengambil data tugas di kelas", courseId);
            err.statusCode = error.code || 500;

            throw err;
        }
    }

    parseDueDateTime(dueDate, dueTime) {
        if (!dueDate) return null;

        const year = dueDate.year;
        const month = dueDate.month - 1;
        const day = dueDate.day;

        const hours = dueTime?.hours ?? 0;
        const minutes = dueTime?.minutes ?? 0;
        const seconds = dueTime?.seconds ?? 0;
        const miliseconds = dueTime?.nanos ? dueTime?.nanos / 1e6 : 0;

        return new Date(year, month, day, hours, minutes, seconds, miliseconds);
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
