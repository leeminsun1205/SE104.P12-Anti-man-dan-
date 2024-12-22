const express = require('express');
const thamSoController = require('../controllers/thamSoController');

const router = express.Router();

router.get('/', thamSoController.getAll); // Lấy danh sách tham số
router.put('/', thamSoController.update); // Cập nhật tham số

module.exports = router;