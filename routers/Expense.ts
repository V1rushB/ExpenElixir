import express from 'express';
import { Expense } from '../db/entities/Expense.js';
import { deleteAllExpenses, deleteExpense, getExpenses, getFilteredExpenses, insertExpense, totalExpenses } from '../controllers/Expense.js';
import authMe from '../middlewares/Auth.js';
import logger from '../logger.js';
import uImage from '../utils/uploadS3Image.js';
import expenseBusiness from '../middlewares/businessExpense.js';
import { validateExpense } from '../middlewares/Validate.js';
import expenseAnalytics from '../middlewares/epxense-analytics.js';
import filtering from '../middlewares/filtering.js';

const router = express.Router();

router.post('/', authMe, validateExpense, async (req, res, next) => {
    insertExpense(req.body, res).then(expense => {
        logger.info(`User ${req.body.username} added a new Expense!`);
        res.status(200).send(`You have successfully added a new Expense!`);
    }).catch(err => next(err));
});

router.get('/', authMe, async (req, res, next) => {
    getExpenses(req, res).then(expense => {
        logger.info(`User ${req.body.username} requested all Expenses!`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});

router.get('/total', authMe, async (req, res, next) => {
    totalExpenses(res).then(expense => {
        logger.info(`User ${req.body.username} requested total Expenses!`);
        res.status(200).send(`Total expenses: ${expense}`);
    }).catch(err => next(err));
});


router.delete('/all-expenses', authMe, async (req, res, next) => {
    deleteAllExpenses(res).then(expense => {
        res.status(200).send(`You have successfully deleted all expenses!`);
    }).catch(err => next(err));
});

router.delete('/:id', authMe, async (req, res, next) => {
    deleteExpense({id:req.params.id}).then(expense => {
        logger.info(`User ${req.body.username} deleted expense ${req.params.id}!`);
        res.status(200).send(`You have successfully deleted the expense with id: ${req.params.id}!`);
    }).catch(err => next(err));
});

router.get('/all', authMe, async (req, res, next) => { // testing purposes
    const expenses = await Expense.find();
    res.status(200).send(expenses);
});

router.use('/search', filtering);
router.use('/analytics', expenseAnalytics);
router.use('/business', expenseBusiness);

export default router;