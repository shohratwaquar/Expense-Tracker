const express = require('express');
const transController = require('../controllers/transaction');
router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware');
const validateAddTransaction = require('../validations/transactions');

router.post('/addtransaction',authMiddleware,validateAddTransaction,transController.addTransactions);
router.get('/get-transactions',authMiddleware,transController.getTransactions);
router.post('/get-transactions/filter',authMiddleware,transController.getTransactionsFiltered);
router.get('/get-transaction/:id',authMiddleware,transController.getTransaction);
router.post('/update-transaction/:id',authMiddleware,validateAddTransaction,transController.updateTransaction);
router.delete('/delete-transaction/:id',authMiddleware,transController.deleteTransaction);
module.exports = router;