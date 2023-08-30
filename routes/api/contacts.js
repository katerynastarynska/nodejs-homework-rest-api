const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/contacts');
const { isValidId } = require('../../middlewares');

router.get('/', controllers.getAll);

router.get('/:contactId', isValidId, controllers.getById);

router.post('/', controllers.add);

router.delete('/:contactId', isValidId, controllers.deleteById);

router.put('/:contactId', isValidId, controllers.updateById);

router.patch('/:contactId/favorite', isValidId, controllers.updateStatusContact);

module.exports = router;