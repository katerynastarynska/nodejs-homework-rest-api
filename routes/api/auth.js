const express = require('express');
const router = express.Router();

const { authenticate, isValidId } = require('../../middlewares');
const controllers = require('../../controllers/auth');

router.post('/register', controllers.register);

router.post('/login', controllers.login);

router.get('/current', authenticate, controllers.getCurrent);

router.post('/logout', authenticate, controllers.logout);

router.patch('/:userId/subscription', authenticate, controllers.updateUserSubscription);

module.exports = router;