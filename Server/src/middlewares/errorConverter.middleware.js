// src/middlewares/errorConverter.js

import AppError from "../utilities/appError.js";

const translateKnownErrors = (err) => {
    // JSON body parsing error
    if (err instanceof SyntaxError && 'body' in err) {
        return new AppError('Request body contains invalid JSON', 400);
    }

    // Mongoose CastError (invalid id, etc.)
    if (err?.name === 'CastError') {
        return new AppError(`Invalid value for field "${err.path}"`, 400, { value: err.value });
    }

    // Mongoose ValidationError
    if (err?.name === 'ValidationError') {
        const details = Object.values(err.errors).map((e) => e.message);
        return new AppError('Validation failed', 422, details);
    }

    // Mongo duplicate key error
    if (err?.code === 11000) {
        const fields = Object.keys(err.keyPattern || err.keyValue || {});
        return new AppError(`Duplicate value for fields: ${fields.join(', ')}`, 409, err.keyValue);
    }

    // JWT
    if (err?.name === 'JsonWebTokenError') {
        return new AppError('Invalid token', 401);
    }
    if (err?.name === 'TokenExpiredError') {
        return new AppError('Token has expired', 401);
    }

    // Multer (file upload)
    if (err?.name === 'MulterError') {
        return new AppError(`File upload error: ${err.message}`, 400);
    }

    // Zod/Joi validation
    if (err?.name === 'ZodError') {
        const details = err.issues?.map((i) => `${i.path?.join('.')}: ${i.message}`);
        return new AppError('Validation failed (Zod)', 422, details);
    }

    // Rate limit
    if (err?.statusCode === 429) {
        return new AppError('Too many requests. Please try again later.', 429);
    }

    return null;
    };

    export const errorConverter = (err, req, res, next) => {
    if (err instanceof AppError) return next(err);

    const translated = translateKnownErrors(err);
    if (translated) return next(translated);

    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error';
    next(new AppError(message, status));
};
