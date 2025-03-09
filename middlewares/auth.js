const { pool } = require('../config/db');
const { sendErrorResponse } = require('../utils/responseHelper');

/**
 * Middleware a felhasználó szerepkörének ellenőrzésére.
 * 
 * @param {string} role - Az elvárt szerepkör (pl. "admin", "institution").
 * @returns {Function} - Middleware függvény, amely ellenőrzi a szerepkört.
 */
const verifyRole = (role) => {
    return async (req, res, next) => {
        // Hívjuk meg a getRoleFromToken függvényt a szerepkör lekéréséhez.
        await getRoleFromToken(req, res, async () => {
            if (!req.userRole || req.userRole.role !== role) {
                return sendErrorResponse(res, 403, "Hozzáférés megtagadva. Nem megfelelő szerepkör.");
            }
            next(); // Ha minden rendben, továbbhaladunk.
        });
    };
};

/**
 * Middleware a felhasználó szerepkörének lekérésére token alapján.
 * 
 * @param {Object} req - Az Express kérés objektuma.
 * @param {Object} res - Az Express válasz objektuma.
 * @param {Function} next - Következő middleware hívása.
 */
const getRoleFromToken = async (req, res, next) => {
    try {
        const token = req.token;

        const sql = 'SELECT role, role_id FROM tokens JOIN users USING(user_id) JOIN roles USING(role_id) WHERE token = ?';
        const [results] = await pool.query(sql, [token]);

        req.userRole = results[0];
        
        next(); // Ha sikeres, továbblépünk.
    } catch (error) {
        console.error('Hiba a token ellenőrzése során:', error);
        return sendErrorResponse(res, 501, "Hiba a token ellenőrzése során.");
    }
};

/**
 * Middleware a token érvényességének ellenőrzésére.
 * 
 * @param {Object} req - Az Express kérés objektuma.
 * @param {Object} res - Az Express válasz objektuma.
 * @param {Function} next - Következő middleware hívása.
 */
const validToken = async (req, res, next) => {
    try {
        const token = req.headers['x-auth-token'];

        if (!token) {
            throw new Error("Nincs token megadva");
        }

        const [results] = await pool.query(`SELECT token, user_id FROM tokens WHERE token = ? AND is_valid='1'`, [token]);

        if (!results.length) {
            throw new Error("Érvénytelen token");
        }

        req.token = results[0].token;
        req.user_id = results[0].user_id;

        next(); // Ha sikeres, továbblépünk.
    } catch (error) {
        console.error('Hiba a token ellenőrzése során:', error);
        return sendErrorResponse(res, 401, error.message || "Szerverhiba");
    }
};

/**
 * Middleware a felhasználói fiók engedélyezettségének ellenőrzésére.
 * 
 * @param {string} role - A felhasználó típusa (pl. "person", "institution").
 * @returns {Function} - Middleware függvény.
 */
const isEnabled = (role) => {
    return async (req, res, next) => {
        try {
            const user_id = req.user_id;

            const [results] = await pool.query(
                `SELECT is_enabled FROM ${role}_profiles JOIN users USING(user_id) WHERE user_id = ?`,
                [user_id]
            );

            if (!results.length) {
                return sendErrorResponse(res, 404, 'A fiók nem található.');
            }

            if (!results[0].is_enabled) {
                throw new Error(`A fiók le van tiltva.`);
            }

            next(); // Ha a fiók engedélyezett, továbblépünk.
        } catch (error) {
            console.error('Hiba a fiók engedélyezettségének ellenőrzése során:', error);
            return sendErrorResponse(res, 406, error.message || "Szerverhiba");
        }
    };
};

/**
 * Middleware a felhasználói regisztráció jóváhagyottságának ellenőrzésére.
 * 
 * @param {string} role - A felhasználó típusa (pl. "person", "institution").
 * @returns {Function} - Middleware függvény.
 */
const isAccepted = (role) => {
    return async (req, res, next) => {
        try {
            const user_id = req.user_id;

            const [results] = await pool.query(
                `SELECT is_accepted FROM ${role}_profiles JOIN users USING(user_id) WHERE user_id = ?`,
                [user_id]
            );

            if (!results.length) {
                return sendErrorResponse(res, 404, 'A fiók nem található.');
            }

            if (!results[0].is_accepted) {
                throw new Error(`A fiókregisztráció nincs jóváhagyva.`);
            }

            next(); // Ha a regisztráció jóváhagyott, továbblépünk.
        } catch (error) {
            console.error('Hiba a fiókregisztráció jóváhagyásának ellenőrzése során:', error);
            return sendErrorResponse(res, 405, error.message || "Szerverhiba");
        }
    };
};

module.exports = { verifyRole, getRoleFromToken, validToken, isEnabled, isAccepted };
