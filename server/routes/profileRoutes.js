const express = require('express');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.post('/', profileController.createOrUpdateProfile);
router.get('/', profileController.getProfile);

module.exports = router;
