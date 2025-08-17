export default class AppError extends Error {
    constructor(message, statusCode, details = null) {
        super(typeof message === "string" ? message : message.en);

        this.statusCode = statusCode;
        this.status = String(statusCode).startsWith("4") ? "fail" : "error";
        this.details = details;

        // message can be { en: "X", ar: "Y" }
        this.messageObj = typeof message === "object"
        ? message
        : { en: message, ar: message }; 
    }
}