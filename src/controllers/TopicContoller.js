import TopicService from "../services/TopicService.js";

class TopicController {
    constructor() {
        this.service = TopicService;

        this.getAllTopics = this.getAllTopics.bind(this);
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

    
}
