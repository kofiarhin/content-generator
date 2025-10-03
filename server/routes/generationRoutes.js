const express = require('express');
const generationController = require('../controllers/generationController');

const router = express.Router();

router.post('/generate', generationController.generateAsset);
router.post('/generate/batch', generationController.generateBatch);
router.post('/refine/:id', generationController.refineAsset);

module.exports = router;
