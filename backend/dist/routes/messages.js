"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controllers/messageController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/conversations', messageController_1.getConversations);
router.get('/:conversationId', messageController_1.getMessages);
router.post('/send', messageController_1.sendMessage);
exports.default = router;
//# sourceMappingURL=messages.js.map