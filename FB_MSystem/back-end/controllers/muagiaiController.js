const { MuaGiai } = require('../models');
const { isDuplicate } = require('../utils/isDuplicate');

const MuaGiaiController = {
    async getAll(req, res) {
        try {
            const muaGiais = await MuaGiai.findAll();
            res.status(200).json(muaGiais);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách mùa giải.' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const muaGiai = await MuaGiai.findByPk(id);
            if (!muaGiai) return res.status(404).json({ error: 'Không tìm thấy mùa giải.' });
            res.status(200).json(muaGiai);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin mùa giải.' });
        }
    },

    async create(req, res) {
        try {
            const { MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc } = req.body;
            const isDuplicateName = await isDuplicate(MuaGiai, 'TenMuaGiai', TenMuaGiai);
            if (isDuplicateName) {
                return res.status(400).json({ error: `Tên mùa giải "${TenMuaGiai}" đã tồn tại.` });
            }
            const muaGiai = await MuaGiai.create({
                MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc,
            });
            res.status(201).json(muaGiai);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm mùa giải.', details: error.massages });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const muaGiai = await MuaGiai.findByPk(id);
            if (!muaGiai) return res.status(404).json({ error: 'Không tìm thấy mùa giải.' });
            if (updates.TenMuaGiai && updates.TenMuaGiai !== muaGiai.TenMuaGiai) {
                const isDuplicateName = await isDuplicate(MuaGiai, 'TenMuaGiai', updates.TenMuaGiai);
                if (isDuplicateName) {
                    return res.status(400).json({ error: `Tên mùa giải "${updates.TenMuaGiai}" đã tồn tại.` });
                }
            }
            await muaGiai.update(updates);
            res.status(200).json(muaGiai);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật mùa giải.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const muaGiai = await MuaGiai.findByPk(id);
            if (!muaGiai) return res.status(404).json({ error: 'Không tìm thấy mùa giải.' });
            await muaGiai.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa mùa giải.' });
        }
    },
};

module.exports = MuaGiaiController;
