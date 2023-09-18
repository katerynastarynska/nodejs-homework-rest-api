const { Schema, model } = require('mongoose');
const Joi = require("joi");

const handleMongooseError = require('../helpers/handleMongooseError');

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        match: emailPattern,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    }, 
    avatarURL: {
        type: String,
        required: true,
    }
},
    { versionKey: false }
)

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    email: Joi.string().pattern(emailPattern).required().messages({
        'any.required': 'Please provide a valid email address.'
    }),
    password: Joi.string().required(),
    subscription: Joi.string().valid(...subscriptionList),
    token: Joi.string(),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailPattern).required(),
    password: Joi.string().required(),
    subscription: Joi.string().valid(...subscriptionList).required(),
})

const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid(...subscriptionList).required(),
})

const User = model('user', userSchema);

const schemas = {
    registerSchema,
    loginSchema, 
    updateSubscriptionSchema,
}

module.exports = {
    User,
    schemas
}