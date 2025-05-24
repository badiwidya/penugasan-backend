export default function (err, req, res, next) {
    console.error("Terjadi error:", err);
    if (res.headerSent) return next(err);

    let error = {
        message: err.message || "Internal Server Error",
        statusCode: err.statusCode || 500,
    };

    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: err,
    });
}
