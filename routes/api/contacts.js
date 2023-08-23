const express = require('express');

const controllers = require('../../controllers/contacts');

const router = express.Router();

router.get('/', controllers.getAll)

router.get('/:contactId', controllers.getById)

router.post('/', controllers.add)

router.delete('/:contactId', controllers.deleteById)


router.put('/:contactId', controllers.updateById)

module.exports = router;