import AssignmentService from "../services/AssignmentService.js";

class AssignmentController {
    constructor() {
        this.service = AssignmentService;

        this.getAllAssignments = this.getAllAssignments.bind(this);
    }

    async getAllAssignments(req, res, next) {
        try {
            const assignments = await this.service.listAssignments();

            res.json({
                status: true,
                message: "Berhasil mengambil data semua tugas di kelasnya masing-masing",
                data: assignments,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AssignmentController();
