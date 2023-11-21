const express = require('express');
const router = express.Router();
const {
   helloWebhook,
   verifyWebhook,
   handleRequest,
} = require('../controllers/messenger.controller');

router.get('/', helloWebhook);
router.get('/webhook', verifyWebhook);
router.post('/webhook', handleRequest);
module.exports = router;
