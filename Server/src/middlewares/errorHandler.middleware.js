export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    const statusCode = err.statusCode || 500;

    const payload = {
        success: false,
        status: err.status || (String(statusCode).startsWith("4") ? "fail" : "error"),
        message: err.messageObj || { en: err.message || "Internal server error", ar: "خطأ في الخادم الداخلي" },
        details: err.details || undefined,
        requestId: req.id || undefined,
        ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
    };

    res.status(statusCode).json(payload);
};
