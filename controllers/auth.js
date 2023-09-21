const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const Jimp = require('jimp');
const { nanoid } = require("nanoid");

const { User } = require('../models/user');
const { schemas } = require('../models/user');

const { HttpError } = require('../helpers');
const { sendEmail } = require('../helpers');

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

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
        const avatarURL = gravatar.url(email);

        const verificationToken = nanoid()
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
            avatarURL,
            verificationToken,
        });
      
        await sendEmail({
            to: email,
            subject: "Please confirm your email",
            html: `<a href='${BASE_URL}/api/users/verify/${verificationToken}'>Confirm your email</a>`,
        })

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
                avatarURL: newUser.avatarURL
            }
        })
    } catch (error) {
        next(error);
    }
}

const verifyEmail = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });
        if (!user) {
            throw HttpError(400, 'User already verificated')
        }
        const response = await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null }, { new: true })
        return res.status(200).json({ message: 'Verification successful' })
    } catch (error) {
        next(error);
    }
}

const resendVerificationEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(400, 'missing required field email')
        }
        if (user.verify) {
            throw HttpError(400, 'Verification has already been passed')
        }
        await sendEmail({
            to: email,
            subject: "Please confirm your email",
            html: `<a href='${BASE_URL}/api/users/verify/${user.verificationToken}'>Confirm your email</a>`,
        })
        return res.status(200).json({ message: 'Verification email sent' })
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
        const { email, password, subscription } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(401, "Email or password is wrong");
        }
        if (!user.verify) {
            throw HttpError(401, "Email is not verified");
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
                email,
                subscription
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
        const user = await User.findByIdAndUpdate(_id, { token: null });
        if (!user) {
            throw HttpError(401);
        }
        res.status(204).json({
            message: "Logout success"
        });
    } catch (error) {
        next(error);
    }
}

const updateUserSubscription = async (req, res, next) => {
    try {
        const { error } = schemas.updateSubscriptionSchema.validate(req.body);
        if (error) {
            throw HttpError(400, "Validation field error");
        }
        const { _id } = req.user;
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
        if (!user) {
            throw HttpError(401);
        }
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

const updateAvatar = async (req, res, next) => {

    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const imageName = `${_id}_${originalname}`
    try {
        const resultUpload = path.join(avatarsDir, imageName);

        const avatar = await Jimp.read(tempUpload);
        avatar.resize(250, 250);
        await avatar.writeAsync(resultUpload);

        const avatarURL = path.join('avatars', imageName);
        await User.findByIdAndUpdate(_id, { avatarURL });

        res.json({
            avatarURL,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    register,
    login,
    getCurrent,
    logout,
    updateUserSubscription,
    updateAvatar,
    verifyEmail,
    resendVerificationEmail
}