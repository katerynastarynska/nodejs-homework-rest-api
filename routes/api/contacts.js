const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/contacts');
const { isValidId, validateToken } = require('../../middlewares');

router.get('/', validateToken, controllers.getAll);

router.get('/:contactId', validateToken, isValidId, controllers.getById);

router.post('/', validateToken, controllers.add);

router.delete('/:contactId', validateToken, isValidId, controllers.deleteById);

router.put('/:contactId', validateToken, isValidId, controllers.updateById);

router.patch('/:contactId/favorite', validateToken, isValidId, controllers.updateStatusContact);

module.exports = router;