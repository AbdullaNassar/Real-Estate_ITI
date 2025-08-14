// src/middlewares/errorHandler.js
const isDev = process.env.NODE_ENV !== 'production';

export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    const statusCode = err.statusCode || 500;

    const payload = {
        success: false,
        status: err.status || (String(statusCode).startsWith('4') ? 'fail' : 'error'),
        message: err.message || 'Internal server error',
        details: err.details || undefined,
        requestId: req.id || undefined,
        ...(isDev ? { stack: err.stack } : {}),
    };

    res.status(statusCode).json(payload);
    };
