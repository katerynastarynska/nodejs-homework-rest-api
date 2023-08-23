const Joi = require("joi");

const contacts = require('../models/contacts');

const { HttpError } = require('../helpers');

const addSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),

    email: Joi.string().email({ minDomainSegments: 2 }).required(),

    phone: Joi.string().pattern(/^[0-9]{7,12}$/).required(),
})

const getAll = async (req, res, next) => {
    try {
        const result = await contacts.listContacts();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contacts.getContactById(contactId);
        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(result)
    } catch (error) {
        next(error);
    }
}

const add = async (req, res, next) => {
    try {
        const { error } = addSchema.validate(req.body);
        if (error) {
            throw HttpError(400, "Missing required name field");
        }
        const result = await contacts.addContact(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

const deleteById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contacts.removeContact(contactId);
        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json({
            message: "contact deleted"
        })
    } catch (error) {
        next(error);
    }
}
const updateById = async (req, res, next) => {
    try {
        const { error } = addSchema.validate(req.body);
        if (error) {
            throw HttpError(400, "missing fields");
        }
        const { contactId } = req.params;
        const result = await contacts.updateContact(contactId, req.body);
        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(result)
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    getById,
    add,
    deleteById,
    updateById
}