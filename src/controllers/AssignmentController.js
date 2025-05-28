import { json } from "express";
import AssignmentService from "../services/AssignmentService.js";

class AssignmentController {
    constructor() {
        this.service = AssignmentService;

        this.getAllAssignments = this.getAllAssignments.bind(this);
        this.createBatchAssignments = this.createBatchAssignments.bind(this);
        this.publishAllAssignments = this.publishAllAssignments.bind(this);
    }

    async getAllAssignments(req, res, next) {
        try {
            const assignments = await this.service.listAssignments();

            console.log(assignments)

            res.json({
                status: true,
                message: "Berhasil mengambil data semua tugas di kelasnya masing-masing",
                data: assignments,
            });
        } catch (error) {
            next(error);
        }
    }

    async createBatchAssignments(req, res, next) {
        try {
            const { assignments } = req.body;
            if (!assignments || !Array.isArray(assignments) || assignments.length === 0) {
                const error = new Error("Array assignment dibutuhkan");
                error.statusCode = 400;
                throw error;
            }

            const responses = await this.service.createBatchAssignments(assignments);

            res.json(responses);
        } catch (error) {
            next(error);
        }
    }

    async publishAllAssignments(req, res, next) {
        try {
            const { assignments } = req.body;
            const responses = await this.service.publishAssignment(assignments);

            res.json(responses);
        } catch (error) {
            next(error);
        }
    }
}

export default new AssignmentController();
