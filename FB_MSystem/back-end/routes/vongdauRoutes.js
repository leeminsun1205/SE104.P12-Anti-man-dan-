const express = require('express');
const vongDauController = require('../controllers/vongDauController');

const router = express.Router();

router.get('/', vongDauController.getAll); // Lấy danh sách tất cả vòng đấu
router.get('/:id', vongDauController.getById); // Lấy vòng đấu theo ID
router.put('/:id', vongDauController.update); // Cập nhật vòng đấu
router.delete('/:id', vongDauController.delete); // Xóa vòng đấu
module.exports = router;