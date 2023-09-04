const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const { schemas } = require('../models/user');

const { HttpError } = require('../helpers');

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
    try {
        const { error } = schemas.registerSchema.validate(req.body);
        if (error) {
            throw HttpError(400, "Validation error");
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, "Email in use")
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ ...req.body, password: hashedPassword });
        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription
            }
        })
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { error } = schemas.loginSchema.validate(req.body);
        if (error) {
            throw HttpError(400, "Validation error");
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(401, "Email or password is wrong");
        }
        const passwordToCompare = await bcrypt.compare(password, user.password);
        if (!passwordToCompare) {
            throw HttpError(401, "Email or password is wrong");
        }

        const payload = {
            id: user._id,
        }

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
        await User.findByIdAndUpdate(user._id, { token })
        res.status(200).json({
            token,
            user: {
                email
            }
        })

    } catch (error) {
        next(error);
    }
}

const getCurrent = async (req, res, next) => {
    try {
        const { email, subscription } = req.user;
        res.status(200).json({
            email,
            subscription
        })
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: null });
        res.status(204);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    getCurrent,
    logout
}