const express = require('express');
const { sendContactEmail, verifyContactEmail } = require('../controllers/contactController');

const router = express.Router();

// POST /api/contact - Send contact message
router.post('/', sendContactEmail);

// GET /api/contact/verify/:token - Verify email and save message
router.get('/verify/:token', verifyContactEmail);

module.exports = router;
