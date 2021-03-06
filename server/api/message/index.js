'use strict';

var express = require('express');
var controller = require('./message.controller');
var config = require('../../config/environment');

var router = express.Router();

router.get('/stats', controller.stats);
router.get('/', controller.index);
router.post('/', controller.create);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.delete('/', controller.deleteMultiple);

module.exports = router;