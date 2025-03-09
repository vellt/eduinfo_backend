const express = require("express");
const { upload } = require("../../config/multerConfig");
const { validToken, isAccepted, isEnabled, getRoleFromToken, verifyRole } = require("../../middlewares/auth");
const { multerErrorHandler } = require("../../middlewares/multerErrorHandler");
const service = require("../../services/v1/personService");
const router = express.Router();
const inputValidator = require("../../middlewares/validartors");

// Route Middlewares
const PROTECTED = [validToken, isAccepted(service.role), isEnabled(service.role), getRoleFromToken, verifyRole(service.role)];
const IMAGE = (imageName)=> [upload.single(imageName), multerErrorHandler];

// Route Definitions
router.get('/home', PROTECTED, service.getHomeData);
router.get('/home_version', PROTECTED, service.getHomeVersion);
router.get('/events', PROTECTED, service.getEvents);
router.get('/interested_events', PROTECTED, service.getInterestedEvents);
router.post('/event_interest/:event_id', PROTECTED, service.addEventInterest);
router.delete('/event_interest/:event_id', PROTECTED, service.removeEventInterest);
router.post('/like_story/:story_id', PROTECTED, service.likeStory);
router.delete('/like_story/:story_id', PROTECTED, service.unlikeStory);
router.get('/categories', service.getCategories);
router.get('/institutions_by_category/:category_id', service.getInstitutionsByCategory);
router.get('/institutions/:institution_profile_id', PROTECTED, service.getInstitutionDetails);
router.post('/follow_institution/:institution_profile_id', PROTECTED, service.followInstitution);
router.delete('/follow_institution/:institution_profile_id', PROTECTED, service.unfollowInstitution);
router.get('/followes_version', PROTECTED, service.getFollowesVersion);
router.get('/followes', PROTECTED, service.getFollowes);
router.get('/profile', PROTECTED, service.getPersonProfile);
router.get("/enabled", PROTECTED, service.isEnabled);
router.get("/accepted", PROTECTED, service.isAccepted);
router.put("/avatar", PROTECTED, IMAGE("avatar_image"), service.updateAvatar);
router.put("/name",PROTECTED, service.updateName);
router.put("/email", inputValidator.validateEmail, PROTECTED, service.updateEmail);
router.put("/password", PROTECTED, service.updatePassword);
router.delete("/profile", PROTECTED, service.deleteProfile);
router.get("/messages_version", PROTECTED, service.getMessagesVersion);
router.get("/messages_version/:messaging_room_id", PROTECTED, service.getMessagingRoomVersion);
router.get("/messaging_rooms", PROTECTED, service.getMessagingRooms);
router.post("/send_message/:institution_profile_id", PROTECTED, service.sendMessage);
router.get("/messaging_rooms/:messaging_room_id", PROTECTED, service.getMessagingRoom);
router.get("/find_messaging_rooms/:institution_profile_id", PROTECTED, service.findOrCreateMessagingRoom);

module.exports = router;