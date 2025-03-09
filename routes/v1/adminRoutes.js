const express = require("express");
const { validToken, getRoleFromToken, verifyRole } = require("../../middlewares/auth");
const service = require("../../services/v1/adminService");
const router = express.Router();

// Route Middlewares
const protected = [validToken, getRoleFromToken, verifyRole(service.role)];

// Route Definitions
router.get("/users", protected, service.getUsers);
router.get("/users_version", protected, service.getUsersVersion);
router.put("/disable_institution/:institution_profile_id", protected, service.disableInstitution);
router.put("/enable_institution/:institution_profile_id", protected, service.enableInstitution);
router.put("/accept_institution/:institution_profile_id", protected, service.acceptInstitution);
router.put("/disable_person/:person_profile_id", protected, service.disablePerson);
router.put("/enable_person/:person_profile_id", protected, service.enablePerson);

module.exports = router;