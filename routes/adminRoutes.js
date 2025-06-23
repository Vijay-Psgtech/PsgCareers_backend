const express = require('express');
const { getAdminUsers, CreateAdmin, DeleteUser } = require('../controllers/adminController');

const router = express.Router();

router.get('/getAdminUsers',getAdminUsers);
router.post('/create-admin',CreateAdmin);
router.delete('/:id',DeleteUser);

module.exports = router;