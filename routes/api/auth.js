const express = require('express');
const router = express.Router();

const { validateToken, upload } = require('../../middlewares');
const controllers = require('../../controllers/auth');

router.post('/register', controllers.register);

router.post('/login', controllers.login);

router.get('/current', validateToken, controllers.getCurrent);

router.post('/logout', validateToken, controllers.logout);

router.patch('/:userId/subscription', validateToken, controllers.updateUserSubscription);

router.patch('/avatars', validateToken, upload.single('avatar'), controllers.updateAvatar)

module.exports = router;