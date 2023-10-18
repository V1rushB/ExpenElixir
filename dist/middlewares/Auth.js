import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import { CustomError } from '../CustomError.js';
const authMe = async (req, res, next) => {
    try {
        const token = req.cookies["token"] || "";
        const isValidToken = jwt.verify(token, process.env.SECRET_KEY || "");
        if (isValidToken) {
            const decode = jwt.decode(token, { json: true });
            const user = await Users.findOne({
                where: { email: decode?.email }
            });
            res.locals.user = user;
            return next();
        }
        throw new CustomError(`Unauthorized`, 401);
    }
    catch (err) {
        return next(err);
    }
};
export default authMe;
//# sourceMappingURL=Auth.js.map