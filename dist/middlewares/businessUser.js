import express from 'express';
import authMe from './Auth.js';
import PremiumAuth from './PremiumAuth.js';
import { businessBalance, businessUsers, createUserUnderRoot } from '../controllers/Business.js';
import logger from '../logger.js';
import { validateUser } from './Validate.js';
import checkBusiness from './business-check.js';
const router = express.Router();
router.post('/add-user', authMe, PremiumAuth, checkBusiness, validateUser, async (req, res, next) => {
    createUserUnderRoot(req.body, res).then(user => {
        logger.info(`201 Created - /user/addUser - POST - ${req.ip}`);
        res.status(201).send(`${user.username} has been successfully added to your business!`);
    }).catch(err => next(err));
});
// router.put('/upgrade-to-premium', authMe, async (req, res, next) => { // just some testing stuff
//     try {
//         const user = res.locals.user;
//         console.log(`profiles are ${user.profile}`);
//         if(user.profile) {
//         user.profile.role = 'Root';
//         await user.profile.save();
//         const newBusiness = Business.create({
//             businessName: user.profile.firstName + "'s Business",
//             rootUserID: user.id,
//             users: [user],
//         });
//         await newBusiness.save();
//         user.business = newBusiness;
//         await user.save();
//         }
//         logger.info(`200 OK - /user/upgradeToPremium - PUT - ${req.ip}`);
//         res.status(200).send(`You have been upgraded to premium successfully ${user.username}!`);
//     } catch (err) {
//         return next(new CustomError(`An error occurred while trying to upgrade you to premium. Error: ${err}`, 500));
//     }
// });
router.get('/business-users', authMe, PremiumAuth, checkBusiness, async (req, res, next) => {
    businessUsers(res).then(users => {
        logger.info(`200 OK - /user/businessUsers - GET - ${req.ip}`);
        res.status(200).send(users);
    }).catch(err => next(err));
});
router.get('/business-balance', authMe, PremiumAuth, checkBusiness, async (req, res, next) => {
    businessBalance(res).then(balance => {
        logger.info(`200 OK - /user/businessBalance - GET - ${req.ip}`);
        res.status(200).send(`Your business balance is: ${balance}`);
    }).catch(err => next(err));
});
export default router;
//# sourceMappingURL=businessUser.js.map