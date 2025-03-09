const { body } = require("express-validator");

// Regisztráció validálása
exports.validateRegister = [
  body("email").isEmail().withMessage("Nem valós email cím"),
  body("name").notEmpty().withMessage("Töltsd ki a nevet!"),
  body("password").isLength({ min: 6 }).withMessage("A jelszónak legalább 6 karakternek kell lennie!"),
  body("as").isIn(["person", "institution"]).withMessage("Nem megfelelő felhasználói szerep"),
];

// Standard bejelentkezés validálása
exports.validateStandardLogin = [
  body("email").isEmail().withMessage("Nem valós email cím"),
  body("password").notEmpty().withMessage("A jelszó megadása kötelező!"),
];

// Admin regisztráció validálása
exports.validateAdminRegister = [
  body("email").isEmail().withMessage("Nem valós email cím"),
  body("name").notEmpty().withMessage("Töltsd ki a nevet!"),
  body("password").isLength({ min: 6 }).withMessage("A jelszónak legalább 6 karakternek kell lennie!"),
];

exports.validateEmail = [
  body('email')
    .notEmpty().withMessage('Az e-mail mező nem lehet üres')
    .isEmail().withMessage('Érvénytelen e-mail formátum'),
]

