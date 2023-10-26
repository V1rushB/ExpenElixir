import express from 'express';
import authMe from './Auth.js';
import premiumAuth from './PremiumAuth.js';
import { addUserIncome, businessIncome, deleteUserIncome } from '../controllers/Business.js';
import logger from '../logger.js';
import { validateIncome } from './Validate.js';
import checkBusiness from './business-check.js';
import { modifyIncome } from '../controllers/Income.js';
const router = express.Router();
router.post('/add-user-income', authMe, premiumAuth, checkBusiness, validateIncome, async (req, res, next) => {
    addUserIncome(req.body, req.query.id, res).then(() => {
        res.status(200).send(`You have successfully added a new income!`);
    }).catch(err => next(err));
});
router.delete('/delete-user-income', authMe, premiumAuth, checkBusiness, async (req, res, next) => {
    deleteUserIncome(req.query.id, req.query.userID, res).then(() => {
        logger.info(`User ${res.locals.user.username} deleted income ${req.params.id} for user with id ${req.query.userID}!`);
        res.status(200).send(`You have successfully deleted the income!`);
    }).catch(err => next(err));
});
router.get('/business-income', authMe, premiumAuth, checkBusiness, async (req, res, next) => {
    businessIncome(res).then(income => {
        logger.info(`User ${res.locals.user.username} requested all Incomes!`);
        res.status(200).send(income);
    }).catch(err => next(err));
});
router.put('/', authMe, premiumAuth, checkBusiness, validateIncome, async (req, res, next) => {
    modifyIncome(req.query.id, req.body, res).then(() => {
        logger.info(`User ${res.locals.user.username} modified income ${req.params.id}!`);
        res.status(200).send(`You have successfully modified the income!`);
    }).catch(err => next(err));
});
export default router;
//# sourceMappingURL=businessIncome.js.map