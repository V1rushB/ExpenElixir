import dataSource from "../db/dataSource.js";
import { Category } from "../db/entities/Category.js";
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import { CustomError } from '../CustomError.js';
import { decodeToken } from './Income.js';
const insertCategory = async (payload, req) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        return dataSource.manager.transaction(async (trans) => {
            const newCategory = Category.create({
                title: payload.title, description: payload.description, budget: payload.budget,
            });
            await trans.save(newCategory);
            const user = await Users.findOne({
                where: { id: decode?.id },
                relations: ["categories"],
            });
            if (!user) {
                throw new CustomError(`User not found.`, 404); // This should never happen. (unless token becomes suddenly invalid for some reason lol)
            }
            user.categories.push(newCategory);
            await trans.save(user);
        });
    }
    catch (err) {
        if (err instanceof CustomError)
            throw err;
        throw new CustomError(`Internal Server Error`, 500);
    }
};
const deleteAllCategory = async (req) => {
    const decode = jwt.decode(req.cookies["token"], { json: true });
    return dataSource.manager.transaction(async (trans) => {
        const user = await Users.findOneOrFail({
            where: { id: decode?.id },
            relations: ["categories"],
        });
        await Category.delete({ users: user.id });
    });
};
const deleteCategory = async (id) => {
    try {
        const category = await Category.findOne({ where: { id } });
        if (!category)
            throw new CustomError(`category with id: ${id} was not found!`, 404);
        await Category.remove(category);
        return category;
    }
    catch (err) {
        if (err instanceof CustomError)
            throw err;
        throw new CustomError(`Internal Server Error`, 500);
    }
};
const totalCategory = async (req) => {
    try {
        const decode = decodeToken(req);
        const user = await Users.findOne({
            where: { id: decode?.id }
        });
        if (!user)
            throw new CustomError('User not found', 404);
        return user?.categories;
    }
    catch (err) {
        if (err instanceof CustomError)
            throw err;
        throw new CustomError(`Internal Server Error`, 500);
    }
};
const modifyCategory = async (id, payload, res) => {
    try {
        const userCategories = res.locals.user.categories;
        if (!userCategories)
            throw new CustomError(`No categories were found!`, 404);
        const category = userCategories.find(category => category.id === id);
        if (!category)
            throw new CustomError(`Category with id: ${id} was not found!`, 404);
        category.budget = payload.budget;
        category.title = payload.title;
        category.description = payload.description;
        await category.save();
        return res.locals.user.username;
    }
    catch (err) {
        if (err instanceof CustomError)
            throw err;
        throw new CustomError(`Internal Server Error`, 500);
    }
};
export { insertCategory, deleteAllCategory, deleteCategory, totalCategory, modifyCategory, };
//# sourceMappingURL=Category.js.map