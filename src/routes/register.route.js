const express = require('express');
const router  = express.Router();

const authController = require('../controllers/authentication.controller');

router.post('/', authController.register);

module.exports = router;