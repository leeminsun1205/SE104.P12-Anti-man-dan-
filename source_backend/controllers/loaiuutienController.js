const { LoaiUuTien } = require('../models');

const LoaiUuTienController = {
    async getAll(req, res) {
        try {
            const loaiUuTiens = await LoaiUuTien.findAll();
            res.status(200).json(loaiUuTiens);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách loại ưu tiên.' });
        }
    },

    async create(req, res) {
        try {
            const { MaLoaiUT, TenLoaiUT } = req.body;
            const loaiUuTien = await LoaiUuTien.create({
                MaLoaiUT, TenLoaiUT,
            });
            res.status(201).json(loaiUuTien);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm loại ưu tiên.' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const loaiUuTien = await LoaiUuTien.findByPk(id);
            if (!loaiUuTien) return res.status(404).json({ error: 'Không tìm thấy loại ưu tiên.' });
            await loaiUuTien.update(updates);
            res.status(200).json(loaiUuTien);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật loại ưu tiên.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const loaiUuTien = await LoaiUuTien.findByPk(id);
            if (!loaiUuTien) return res.status(404).json({ error: 'Không tìm thấy loại ưu tiên.' });
            await loaiUuTien.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa loại ưu tiên.' });
        }
    },
};

module.exports = LoaiUuTienController;