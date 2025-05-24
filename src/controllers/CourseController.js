import CourseService from "../services/CourseService.js";

class CourseController {
    constructor() {
        this.service = CourseService;

        this.getAllCourses = this.getAllCourses.bind(this);
        this.getCourse = this.getCourse.bind(this);
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
                data: course
            });
        } catch (error) {
            next(error);            
        }
    }
}

export default new CourseController();
