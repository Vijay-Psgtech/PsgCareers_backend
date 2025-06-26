const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

router.post('/:userId', visitorController.trackVisitor);
router.get('/:userId', visitorController.getVisitorCount);

module.exports = router;