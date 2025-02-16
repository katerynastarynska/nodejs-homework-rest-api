const { Schema, model } = require('mongoose');
const Joi = require("joi");
const { handleMongooseError } = require('../helpers');

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
},
    { versionKey: false });

contactSchema.post("save", handleMongooseError);

const phoneNumberPattern = /^(?:\(\d{3}\)[ ]*|\d{3}[ ]*|)[\d ]{7,12}$/;
const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const addSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(30)
        .required(),
    email: Joi.string().pattern(emailPattern).required(),
    phone: Joi.string().pattern(phoneNumberPattern).required(),
    favorite: Joi.boolean().optional()
})

const putSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(30)
        .optional().allow(null, ''),

    email: Joi.string().email({ minDomainSegments: 2 }).optional().allow(null, ''),

    phone: Joi.string().pattern(phoneNumberPattern).optional().allow(null, ''),
    favorite: Joi.boolean(),
})

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
})

const Contact = model('contact', contactSchema);

const schemas = {
    addSchema,
    putSchema,
    updateFavoriteSchema
}

module.exports = {
    Contact,
    schemas
}