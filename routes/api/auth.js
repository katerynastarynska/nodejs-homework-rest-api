const express = require('express');
const router = express.Router();

const { authenticate } = require('../../middlewares');
const controllers = require('../../controllers/auth');

router.post('/register', controllers.register);

router.post('/login', controllers.login);

router.get('/current', authenticate, controllers.getCurrent);

router.post('/logout', authenticate, controllers.logout)

module.exports = router;