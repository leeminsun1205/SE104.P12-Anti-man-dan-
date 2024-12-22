const { BienNhan, DoiBong, ThamSo } = require('../models');

const BienNhanController = {
    async getAll(req, res) {
        try {
            const bienNhans = await BienNhan.findAll({
                attributes: ['MaLePhi', 'SoTien', 'NgayBatDau', 'NgayHetHan', 'NgayThanhToan', 'TinhTrang'], // Các cột của Biên Nhận
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',
                        attributes: ['TenDoiBong'], // Chỉ lấy TenDoiBong từ bảng DoiBong
                    },
                ],
            });
    
            res.status(200).json(bienNhans);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách biên nhận:', error.message);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách biên nhận.' });
        }
    },

    async getByDoiBong(req, res) {
        try {
            const { MaDoiBong } = req.params;
            const bienNhans = await BienNhan.findAll({
                where: { MaDoiBong },
                include: [
                    { model: DoiBong, as: 'DoiBong' },
                ],
            });
            res.status(200).json(bienNhans);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách biên nhận của đội bóng.' });
        }
    },

    async create(req, res) {
        try {
            const { MaLePhi, MaDoiBong, NgayBatDau, NgayHetHan, NgayThanhToan, TinhTrang } = req.body;
    
            // Lấy giá trị SoTien từ bảng THAMSO
            const thamSo = await ThamSo.findOne();
            if (!thamSo) {
                return res.status(500).json({ error: 'Không tìm thấy giá trị tham số trong hệ thống.' });
            }
            const SoTien = thamSo.LePhi; // Lấy giá trị LePhi từ THAMSO
    
            // Tạo biên nhận với giá trị SoTien từ THAMSO
            const bienNhan = await BienNhan.create({
                MaLePhi,
                MaDoiBong,
                SoTien,
                NgayBatDau,
                NgayHetHan,
                NgayThanhToan,
                TinhTrang,
            });
    
            res.status(201).json(bienNhan);
        } catch (error) {
            console.error('Lỗi khi thêm biên nhận mới:', error);
            res.status(500).json({ error: 'Lỗi khi thêm biên nhận mới.', details: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const bienNhan = await BienNhan.findByPk(id);
            if (!bienNhan) return res.status(404).json({ error: 'Không tìm thấy biên nhận.' });
            await bienNhan.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa biên nhận.' });
        }
    },
};

module.exports = BienNhanController;
