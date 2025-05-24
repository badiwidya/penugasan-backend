import CourseService from "../services/CourseService.js";

class CourseController {
    constructor() {
        this.service = CourseService;

        this.getAllCourses = this.getAllCourses.bind(this);
        this.getCourse = this.getCourse.bind(this);
        this.getStudents = this.getStudents.bind(this);
        this.getTeachers = this.getTeachers.bind(this);
        this.getAssignmentsForCourse = this.getAssignmentsForCourse.bind(this);
    }

    async getAllCourses(req, res, next) {
        try {
            const courses = await this.service.listCourses();

            res.json({
                status: true,
                message: "Berhasil mengambil data semua kelas",
                data: courses,
            });
        } catch (error) {
            next(error);
        }
    }

    async getCourse(req, res, next) {
        try {
            const { courseId } = req.params;

            const course = await this.service.getCourse(courseId);

            res.json({
                status: true,
                message: "Berhasil mengambil data kelas",
                data: course,
            });
        } catch (error) {
            next(error);
        }
    }

    async getStudents() {
        try {
            const { courseId } = req.params;

            const students = await this.service.getStudents(courseId);

            res.json({
                status: true,
                message: "Berhasil mengambil data murid",
                data: students,
            });
        } catch (error) {
            next(error);
        }
    }

    async getTeachers() {
        try {
            const { courseId } = req.params;

            const students = await this.service.getTeachers(courseId);

            res.json({
                status: true,
                message: "Berhasil mengambil data guru",
                data: students,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAssignmentsForCourse() {
        try {
            const { courseId } = req.params;

            const assignments = this.service.getAssignments(courseId);

            res.json({
                status: true,
                message: "Berhasil mengambil data tugas di kelas",
                data: assignments,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new CourseController();
