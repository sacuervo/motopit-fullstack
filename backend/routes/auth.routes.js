const express = require('express');
const { register, login } = require('../controllers/auth.controller.js');
const {
  registerValidator,
  loginValidator,
} = require('../validators/auth.validator.js');
const validateReq = require('../middlewares/validateReq.middleware.js');

const router = express.Router();

router.post('/register', registerValidator, validateReq, register);
router.post('/login', loginValidator, validateReq, login);

module.exports = router;
