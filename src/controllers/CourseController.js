import CourseService from "../services/CourseService.js";

class CourseController {
    constructor() {
        this.service = CourseService;

        this.getAllCourses = this.getAllCourses.bind(this);
    }

    async getAllCourses(req, res, next) {
        try {
            const courses = await this.service.getAllCourses();

            res.json({
                status: true,
                message: "Berhasil mengambil data semua kelas",
                data: courses,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new CourseController();
