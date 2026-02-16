"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/profile/:username', userController_1.getUserProfile);
router.put('/profile', auth_1.authenticate, userController_1.updateProfile);
router.post('/:userId/follow', auth_1.authenticate, userController_1.followUser);
router.get('/:userId/followers', userController_1.getFollowers);
router.get('/:userId/following', userController_1.getFollowing);
exports.default = router;
//# sourceMappingURL=users.js.map