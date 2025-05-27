import { classroom } from "../config/googleConfig.js";

class CourseService {
    constructor() {
        this.classroom = classroom;
    }

    async getAllCourses() {
        try {
            const courses = await this.listCourses();

            const mappedData = await Promise.all(
                courses.map(async (course) => {
                    try {
                        const [teachers, students] = await Promise.all([
                            this.getTeachers(course.id),
                            this.getStudents(course.id),
                        ]);

                        return {
                            id: course.id,
                            name: course.name,
                            enrollmentCode: course.enrollmentCode,
                            alternateLink: course.alternateLink,
                            teachers: teachers.map(({ profile }) => ({
                                profile: {
                                    name: { fullName: profile.name.fullName },
                                    photoUrl: profile.photoUrl,
                                },
                            })),
                            students: students.map(({ profile }) => ({
                                profile: {
                                    name: { fullName: profile.name.fullName },
                                    photoUrl: profile.photoUrl,
                                },
                            })),
                            status: true,
                        };
                    } catch (error) {
                        console.log("Terjadi error saat ingin mengambil data kelas", course.id);
                        return {
                            id: course.id,
                            name: course.name,
                            status: false,
                        }
                    }
                })
            );

            return mappedData;
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data:", error.message);
            const err = new Error("Terjadi kesalahan saat mengambil data kelas");
            err.statusCode = error.code || 500;

            throw err;
        }
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

    async getStudents(courseId) {
        try {
            const response = await this.classroom.courses.students.list({
                courseId,
                pageSize: 20,
            });

            return response.data.students || [];
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

            return response.data.teachers || [];
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
                courseWorkStates: ["PUBLISHED", "DRAFT"],
                pageSize: 200,
            });

            return response.data.courseWork || [];
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data tugas di kelas:", error);
            const err = new Error("Gagal mengambil data tugas di kelas", courseId);
            err.statusCode = error.code || 500;

            throw err;
        }
    }

    async getTopics(courseId) {
        try {
            const response = await this.classroom.courses.topics.list({
                courseId,
                pageSize: 200,
            });

            return response.data.topic || [];
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data topik di kelas:", error);
            const err = new Error("Gagal mengambil data topik di kelas", courseId);
            err.statusCode = error.code || 500;

            throw err;
        }
    }
}

export default new CourseService();
