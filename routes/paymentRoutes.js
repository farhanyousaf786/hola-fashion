const express = require('express');
const router = express.Router();
const { createPayment } = require('../controllers/paymentController');

// POST /api/payments
router.post('/', createPayment);

module.exports = router;
