const express = require('express');
const {login,register,forgot_password,reset_password,verify_mail,set_password} = require('../controllers/authControllers.js');

const router = express.Router();

router.post('/login',login);
router.post('/register',register);
router.get('/verify/:token',verify_mail);
router.post('/set-password/:id',set_password);
router.post('/forgot-password',forgot_password);
router.post('/reset-password',reset_password);

module.exports = router;