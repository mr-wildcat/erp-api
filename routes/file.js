const router = require('express').Router();
const sessionController = require('../controllers/session.controller');
const fileController = require('../controllers/file.controller');

router.get('/list', sessionController.checkToken, fileController.getAll);
router.get('/:id', sessionController.checkToken, fileController.getAll);
router.get('/download/:id', sessionController.checkToken, fileController.download);
router.post('/upload', sessionController.checkToken, fileController.upload);
router.put('/update/:id', sessionController.checkToken, fileController.update);
router.delete('/delete/:id', sessionController.checkToken, fileController.delete);

module.exports = router;
