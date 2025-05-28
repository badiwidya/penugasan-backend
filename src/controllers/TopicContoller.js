import TopicService from "../services/TopicService.js";

class TopicController {
    constructor() {
        this.service = TopicService;

        this.getAllTopics = this.getAllTopics.bind(this);
        this.createBatchTopics = this.createBatchTopics.bind(this);
    }

    async getAllTopics(req, res, next) {
        try {
            const topics = await this.service.listTopics();

            res.json({
                status: true,
                message: "Berhasil mengambil data semua topik kelas",
                data: topics,
            });
        } catch (error) {
            next(error);
        }
    }

    async createBatchTopics(req, res, next) {
        try {
            const { topics } = req.body;

            if (!topics || !Array.isArray(topics) || topics.length === 0) {
                const error = new Error("Array topics dibutuhkan");
                error.statusCode = 400;
                throw error;
            }

            const responses = await this.service.createBatchTopics(topics);

            res.json(responses);
        } catch (error) {
            next(error);
        }
    }
}

export default new TopicController();
