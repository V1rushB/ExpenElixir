import express from 'express';
import isEmail from 'validator/lib/isEmail.js';
import { passwordStrength } from 'check-password-strength';


const validateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const values = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'username',];
    const errorList = [];
    values.forEach(iterator=> {
        if(!req.body[iterator])
            return void errorList.push(`${iterator} is Required.`);
    });
    const user = req.body;
    try {
    if(!isEmail.default(user.email))
        errorList.push(`Invalid email.`);
     if(user.password.length < 10 && passwordStrength(user.password).value.toLocaleLowerCase().includes('weak'))
         errorList.push(`Password is too weak.`);
    } catch(err) {
        console.error(err);
        return res.status(500).send(`Empty body!`);
    }
    if(errorList.length)
        return res.status(400).send(errorList.join('\n'));
    next();
}

export {
    validateUser,
}