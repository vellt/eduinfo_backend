const express = require("express");
const { validToken, getRoleFromToken } = require("../../middlewares/auth");
const inputValidator = require("../../middlewares/validartors");
const service = require("../../services/v1/authService");
const router = express.Router();

const protected = [validToken];

// Route Definitions
router.post("/register", inputValidator.validateRegister, service.register);
router.post("/admin_reg", inputValidator.validateAdminRegister, service.adminRegister);
router.post("/standard_login", inputValidator.validateStandardLogin, service.standardLogin);
router.post("/token_login", protected, service.tokenLogin);
router.put("/logout", protected, service.logout);
router.get("/role", protected, getRoleFromToken, service.getRole);

module.exports = router;