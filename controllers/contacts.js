const { Contact } = require('../models/contact');
const { schemas } = require('../models/contact');

const { HttpError } = require('../helpers');

const getAll = async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const result = await Contact.find({ owner }, ' ', { skip, limit }).populate('owner', 'email subscription');
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await Contact.findById(contactId);
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result)
    } catch (error) {
        next(error);
    }
}

const add = async (req, res, next) => {
    try {
        const { error } = schemas.addSchema.validate(req.body);
        if (error) {
            throw HttpError(400, "Missing required name field");
        }
        const { _id: owner } = req.user;
        const result = await Contact.create({ ...req.body, owner });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

const deleteById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await Contact.findByIdAndRemove(contactId);
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json({
            message: "Contact deleted"
        })
    } catch (error) {
        next(error);
    }
}

const updateById = async (req, res, next) => {
    try {
        const { error } = schemas.putSchema.validate(req.body);
        if (error) {
            throw HttpError(400, "missing fields", error);
        }
        const { contactId } = req.params;
        const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result)
    } catch (error) {
        next(error);
    }
}

const updateStatusContact = async (req, res, next) => {
    try {
        const { error } = schemas.updateFavoriteSchema.validate(req.body);
        if (error) {
            throw HttpError(400, "missing field favorite");
        }
        const { contactId } = req.params;
        const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
        if (!result) {
            throw HttpError(404);
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
    updateById,
    updateStatusContact
}