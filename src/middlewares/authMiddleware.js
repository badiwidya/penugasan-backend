import { oauth2Client } from "../config/googleConfig.js";

export default function (req, res, next) {
    if (!req.session.tokens) {
        return res.status(401).json({
            status: "failed",
            error: "Unauthorized",
        });
    }
    oauth2Client.setCredentials(req.session.tokens);
    next();
}
