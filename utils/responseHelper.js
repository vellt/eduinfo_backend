/**
 * Egységes sikeres válasz küldése az API-n keresztül.
 * 
 * @param {Object} res - Az Express válasz objektuma.
 * @param {any} data - A válaszban visszaadandó adat.
 * @param {string} [message="Sikeres művelet"] - A válaszhoz tartozó üzenet (alapértelmezett: "Sikeres művelet").
 */
exports.sendSuccessResponse = (res, data, message = "Sikeres művelet") => {
    res.status(200).json({
        code: 200,         // HTTP státuszkód
        message,           // Üzenet a válaszhoz
        errors: [],        // Hibák (üres listaként alapértelmezve)
        data,              // Az API által visszaadott adat
    });
};

/**
 * Egységes hibaválasz küldése az API-n keresztül.
 * 
 * @param {Object} res - Az Express válasz objektuma.
 * @param {number} statusCode - HTTP státuszkód (pl. 400, 500).
 * @param {string} message - A válaszhoz tartozó hibaüzenet.
 * @param {Array} [errors=[]] - Opcionális hibák listája (pl. validációs hibák).
 * @param {any} [data=null] - Opcionálisan visszaadható adat (alapértelmezett: null).
 */
exports.sendErrorResponse = (res, statusCode, message, errors = [], data = null) => {
    console.error(`error: ${message}`);
    res.status(statusCode).json({
        code: statusCode,  // HTTP státuszkód
        message,           // Hibaüzenet
        errors: errors,    // Hibák listája
        data: data,        // Alapértelmezett adat (null)
    });
};
