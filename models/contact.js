const { Schema, model } = require('mongoose');
const Joi = require("joi");
const handleMongooseError = require('../helpers/handleMongooseError')
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
    }
},
    { versionKey: false });

contactSchema.post("save", handleMongooseError);

const phoneNumberPattern = /^(?:\(\d{3}\)[ ]*|\d{3}[ ]*|)[\d ]{7,12}$/;

const addSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(30)
        .required(),

    email: Joi.string().email({ minDomainSegments: 2 }).required(),

    phone: Joi.string().pattern(phoneNumberPattern).required(),
    favorite: Joi.boolean().optional()
})

const putSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(30)
        .optional().allow(null, '')
    ,

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