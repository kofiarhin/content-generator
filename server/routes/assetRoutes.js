const express = require('express');
const assetController = require('../controllers/assetController');

const router = express.Router();

router.get('/', assetController.listAssets);
router.get('/:id', assetController.getAsset);
router.patch('/:id/favorite', assetController.toggleFavorite);

module.exports = router;
