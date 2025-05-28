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
            let firstAssignmentSuccess = false;

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
                            pairIds[course.id][topic.name] = topic.topicId;
                        });

                        pairIds[course.id].status = true;

                        if (!firstAssignmentSuccess) {
                            topicsForCourse.forEach((topic) => {
                                if (!(topic.name in assignments)) {
                                    assignments[topic.name] = [];
                                }
                            });

                            assignmentsForCourse.forEach((assignment) => {
                                const topicName = topicsForCourse.find(
                                    (topic) => topic.topicId === assignment.topicId
                                ).name;

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
                                    state: assignment.state,
                                });
                            });
                            firstAssignmentSuccess = true;
                        }
                    } catch (error) {
                        console.log("Terjadi error saat mengambil data pairId untuk kelas", course.id, "error:", error);
                        pairIds[course.id] = {
                            status: false,
                        };
                    }
                })
            );

            return { assignments, pairIds };
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data tugas di kelas:", error.message);
            const err = new Error("Gagal mengambil data tugas");
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

        const utcTime = Date.UTC(year, month, day, hours, minutes, seconds, miliseconds);

        return new Date(utcTime);
    }

    async createBatchAssignments(assignments) {
        const successfullyCreated = [];

        const response = await Promise.allSettled(
            assignments.map(async ({ courseId, assignment }) => {
                try {
                    if (!assignment || !assignment.title) {
                        throw new Error("Judul tugas diperlukan!");
                    }

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

                    let requestBody = {
                        ...assignment,
                        workType: "ASSIGNMENT",
                    };

                    if (!assignment.state) {
                        requestBody.state = "DRAFT";
                    }

                    const apiResponse = await this.classroom.courses.courseWork.create({
                        courseId,
                        requestBody,
                    });

                    successfullyCreated.push({
                        courseId,
                        courseWorkId: apiResponse.data.id,
                    });

                    return {
                        courseId,
                        status: true,
                    };
                } catch (error) {
                    console.log("Terjadi error saat membuat tugas di:", courseId, " Error:", error.message);
                    return {
                        courseId,
                        status: false,
                    };
                }
            })
        );

        const hasFailed = response.some((r) => r.value.status === false);

        if (hasFailed) {
            const rollbackResults = await Promise.allSettled(
                successfullyCreated.map(async ({ courseId, courseWorkId }) => {
                    let retry = 0;
                    let success = false;
                    let lastError = null;

                    while (retry < 3 && !success) {
                        try {
                            await this.classroom.courses.courseWork.delete({
                                courseId,
                                id: courseWorkId,
                            });
                            success = true;
                            return { courseId, status: "rolled_back" };
                        } catch (error) {
                            retry++;
                            lastError = error;
                            await new Promise((resolve) => setTimeout(resolve, 300 * retry));
                        }
                    }

                    return {
                        courseId,
                        status: "rollback_failed",
                        error: lastError.message,
                    };
                })
            );

            const failedRollbacks = rollbackResults.filter((result) => result.value?.status === "rollback_failed");

            if (failedRollbacks.length > 0) {
                console.error("Gagal rollback di kelas:", failedRollbacks);
                return {
                    status: false,
                    message: "Ada tugas yang gagal dibuat DAN gagal di-rollback",
                    detail: failedRollbacks.map((f) => f.value.courseId),
                };
            }

            return {
                status: false,
                message: "Ada tugas yang gagal dibuat, berhasil rollback semua",
            };
        }

        return {
            status: true,
            message: "Semua tugas berhasil dibuat",
        };
    }

    async publishAssignment(assignments) {
        const response = await Promise.allSettled(
            assignments.map(async ({ courseId, courseWorkId }) => {
                try {
                    await this.classroom.courses.courseWork.patch({
                        courseId,
                        id: courseWorkId,
                        updateMask: "state",
                        requestBody: {
                            state: "PUBLISHED",
                        },
                    });

                    return {
                        status: true,
                        courseId,
                        courseWorkId,
                    };
                } catch (error) {
                    console.log("Gagal saat publish tugas untuk kelas", courseId, " Error:", error.message);
                    return {
                        status: false,
                        courseId,
                        courseWorkId,
                    };
                }
            })
        );

        const failed = response.filter((r) => r.value.status === false);

        if (failed.length > 0) {
            return {
                status: "partial",
                message: "Tugas ini gagal dipublish di beberapa kelas, silakan cek sendiri",
                detail: failed.map((f) => f.value.courseId),
            };
        }

        return {
            status: true,
            message: "Semua tugas berhasil dipublish",
        };
    }
}

export default new AssignmentService();
