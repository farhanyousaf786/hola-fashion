const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// POST /api/email/order-confirmation
router.post('/order-confirmation', emailController.sendOrderConfirmation);

module.exports = router;
