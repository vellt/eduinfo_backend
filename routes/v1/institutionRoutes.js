const express = require("express");
const { upload } = require("../../config/multerConfig");
const { validToken, isAccepted, isEnabled, getRoleFromToken, verifyRole } = require("../../middlewares/auth");
const { multerErrorHandler } = require("../../middlewares/multerErrorHandler");
const service = require("../../services/v1/institutionService");
const router = express.Router();
const inputValidator = require("../../middlewares/validartors");

// Route Middlewares
const PROTECTED = [validToken, isAccepted(service.role), isEnabled(service.role), getRoleFromToken, verifyRole(service.role)];
const IMAGE = (imageName) => [upload.single(imageName), multerErrorHandler];

// Route Definitions
router.get("/profile", PROTECTED, service.getProfile);
router.get("/enabled", PROTECTED, service.checkEnabled);
router.get("/accepted", PROTECTED, service.checkAccepted);
router.delete("/profile", PROTECTED, service.deleteProfile);
router.post("/story", PROTECTED, IMAGE("banner_image"), service.createStory);
router.put("/story/:story_id", PROTECTED, IMAGE("banner_image"), service.updateStory);
router.delete("/story/:story_id", PROTECTED, service.deleteStory);
router.post("/event", PROTECTED, IMAGE("banner_image"), service.createEvent);
router.put("/event/:event_id", PROTECTED, IMAGE("banner_image"), service.updateEvent);
router.delete("/event/:event_id", PROTECTED, service.deleteEvent);
router.get("/categories", service.getCategories);
router.put("/institution_categories", PROTECTED, service.updateInstitutionCategories);
router.put("/avatar", PROTECTED, IMAGE("avatar_image"), service.updateAvatar);
router.put("/banner", PROTECTED, IMAGE("banner_image"), service.updateBanner);
router.put("/name", PROTECTED, service.updateName);
router.put("/email",inputValidator.validateEmail, PROTECTED, service.updateEmail);
router.put("/password", PROTECTED, service.updatePassword);
router.put("/description", PROTECTED, service.updateDescription);
router.post("/public/email", PROTECTED, service.addPublicEmail);
router.put("/public/email/:public_email_id", PROTECTED, service.updatePublicEmail);
router.delete("/public/email/:public_email_id", PROTECTED, service.deletePublicEmail);
router.post("/public/phone", PROTECTED, service.addPublicPhone);
router.put("/public/phone/:public_phone_id", PROTECTED, service.updatePublicPhone);
router.delete("/public/phone/:public_phone_id", PROTECTED, service.deletePublicPhone);
router.post("/public/website", PROTECTED, service.addPublicWebsite);
router.put("/public/website/:public_website_id", PROTECTED, service.updatePublicWebsite);
router.delete("/public/website/:public_website_id", PROTECTED, service.deletePublicWebsite);
router.get("/messages_version", PROTECTED, service.getMessagesVersion);
router.get("/messages_version/:messaging_room_id", PROTECTED, service.getMessagingRoomVersion);
router.get("/messaging_rooms", PROTECTED, service.getMessagingRooms);
router.post("/send_message/:person_profile_id", PROTECTED, service.sendMessage);
router.get("/messaging_rooms/:messaging_room_id", PROTECTED, service.getMessagingRoom);

module.exports = router;