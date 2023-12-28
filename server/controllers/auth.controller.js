import User from '../models/User.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken';



export const signup = async (
    req, res, next) => {
    const { username, email, password } = req.body;
    const hashPassword = bcryptjs.hashSync(password, 12);
    const newUser = new User({ username, email, password: hashPassword });
    try {
        await newUser.save()
        res.status(201).json('User create done!')
    } catch (error) {
        next(error);
    }
}




export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {


        const validuser = await User.findOne({ email });
        if (!validuser) {
            return next(errorHandler(404, 'User not found!'))
        }


        const validpassword = bcryptjs.compareSync(password, validuser.password);
        if (!validpassword) return next(errorHandler(401, 'Wrong Credentials!'));

        const token = jwt.sign({ id: validuser._id }, process.env.JWT_KEY)
        const {password:pass,...rest} = validuser._doc;
        res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24) }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
}