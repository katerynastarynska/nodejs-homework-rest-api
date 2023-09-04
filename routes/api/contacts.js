const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/contacts');
const { isValidId, authenticate } = require('../../middlewares');

router.get('/', authenticate, controllers.getAll);

router.get('/:contactId', authenticate, isValidId, controllers.getById);

router.post('/', authenticate, controllers.add);

router.delete('/:contactId', authenticate, isValidId, controllers.deleteById);

router.put('/:contactId', authenticate, isValidId, controllers.updateById);

router.patch('/:contactId/favorite', authenticate, isValidId, controllers.updateStatusContact);

module.exports = router;