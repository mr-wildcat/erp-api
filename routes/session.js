const router = require('express').Router();
const controller = require('../controllers/session.controller');

router.get('/info', controller.checkToken, controller.info);
router.get('/logout', controller.checkToken, controller.logout);
router.post('/signin', controller.login);
router.post('/signin/new_token', controller.refreshToken);
router.post('/signup', controller.signup);

module.exports = router;
