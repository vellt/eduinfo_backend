const multer = require('multer');
const { sendErrorResponse } = require('../utils/responseHelper');

// Multer hiba kezelő middleware
const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Minden Multer hiba
        console.error("Multer hiba:", err);
        return sendErrorResponse(res, 400, 'Fájl feltöltési hiba', []);
    } else if (err) {
        // Minden más hiba
        console.error("Általános hiba:", err);
        return sendErrorResponse(res, 500, err.message, []);
    }
    next();
};

module.exports = { multerErrorHandler };