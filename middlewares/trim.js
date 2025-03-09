exports.trimMiddleware = (req, res, next) => {
    // Trimmeljük a req.body tartalmát
    if (req.body && typeof req.body === 'object') {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        }
    }

    // Trimmeljük a req.query tartalmát
    if (req.query && typeof req.query === 'object') {
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
            }
        }
    }

    // Trimmeljük a req.params tartalmát
    if (req.params && typeof req.params === 'object') {
        for (const key in req.params) {
            if (typeof req.params[key] === 'string') {
                req.params[key] = req.params[key].trim();
            }
        }
    }

    next(); // Továbbadjuk a vezérlést
};
