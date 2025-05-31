const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

router.post('/vote', voteController.castVote);
router.get('/status/:id', voteController.checkStatus);

module.exports = router;
