"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apiError_1 = require("../utils/apiError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof apiError_1.ApiError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errors: err.errors,
        });
    }
    console.error(err);
    return res.status(500).json({
        message: 'Internal Server Error',
    });
};
exports.errorHandler = errorHandler;
