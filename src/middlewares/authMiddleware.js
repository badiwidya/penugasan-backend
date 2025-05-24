export default function (req, res, next) {
    if (!req.session.tokens) {
        res.status(401).json({
            status: "failed",
            error: "Unauthorized",
        });
    }
    next();
}
