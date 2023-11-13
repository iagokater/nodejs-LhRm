const express = require('express');
const router = express.Router();
const volumeController = require('../controllers/volume');


router.get('/', volumeController.volumeGetAll);
router.post('/endpoint', volumeController.postVolume);



module.exports = router;