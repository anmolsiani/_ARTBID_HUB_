"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const artworkController_1 = require("../controllers/artworkController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, upload_1.upload.array('images', 10), artworkController_1.createArtwork);
router.get('/', artworkController_1.getArtworks);
router.get('/saved', auth_1.authenticate, artworkController_1.getSavedArtworks);
router.get('/reels', artworkController_1.getReelsFeed);
router.get('/:id', artworkController_1.getArtworkById);
router.put('/:id', auth_1.authenticate, artworkController_1.updateArtwork);
router.delete('/:id', auth_1.authenticate, artworkController_1.deleteArtwork);
router.post('/:id/like', auth_1.authenticate, artworkController_1.likeArtwork);
router.post('/:id/save', auth_1.authenticate, artworkController_1.saveArtwork);
exports.default = router;
//# sourceMappingURL=artworks.js.map