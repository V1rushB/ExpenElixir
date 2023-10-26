import express from 'express';
import { deleteAllCategory, deleteCategory, insertCategory, totalCategory, modifyCategory } from '../controllers/Category.js';
import authMe from '../middlewares/Auth.js';
import logger from '../logger.js';
import businessCategory from '../middlewares/businessCategory.js';
import { validateCategory } from '../middlewares/Validate.js';
const router = express.Router();
router.post('/', authMe, validateCategory, async (req, res, next) => {
    insertCategory(req.body, res).then(category => {
        res.status(200).send(`You have successfully added a new category!`);
    }).catch(err => next(err));
});
router.get('/', authMe, async (req, res, next) => {
<<<<<<< HEAD
    totalCategory(req).then(category => {
=======
    await totalCategory(res).then(category => {
>>>>>>> cb0ba2cd9df643339156b91aebbf2ed32f3b63cd
        logger.info(`User ${req.body.username} requested all categories!`);
        res.status(200).send(category);
    }).catch(err => next(err));
});
router.delete('/deleteAllCategorys', authMe, async (req, res, next) => {
    deleteAllCategory(res).then(category => {
        res.status(200).send(`You have successfully deleted all categories!`);
    }).catch(err => next(err));
});
router.delete('/deleteCategory/:id', authMe, async (req, res, next) => {
    await deleteCategory(req.params.id).then(category => {
        logger.info(`User ${req.body.username} deleted category ${req.params.id}!`);
        res.status(200).send(`You have successfully deleted the category with id: ${req.params.id}!`);
    }).catch(err => next(err));
});
router.put('', authMe, validateCategory, async (req, res, next) => {
    modifyCategory(req.query.id, req.body, res).then(() => {
        logger.info(`User ${res.locals.user.username} modified category ${req.params.id}!`);
        res.status(200).send(`You have successfully modified the category!`);
    }).catch(err => next(err));
});
router.use('/business', businessCategory);
export default router;
//# sourceMappingURL=Category.js.map