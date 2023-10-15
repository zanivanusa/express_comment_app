var express = require('express');
var router = express.Router();
var odgovorController = require('../controllers/odgovorController.js');

router.post('/objavi_form', odgovorController.create);

module.exports = router;
