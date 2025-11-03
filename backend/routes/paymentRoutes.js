const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

router.get('/', paymentsController.getPayments);
router.post('/', paymentsController.addPayment);
router.put('/:id', paymentsController.updatePayment);
router.delete('/:id', paymentsController.deletePayment);

module.exports = router;
