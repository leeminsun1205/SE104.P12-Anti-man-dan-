const { BanThang, TranDau, CauThu, DoiBong, LoaiBanThang } = require('../models');

const BanThangController = {
    async getAll(req, res) {
        try {
            const banThangs = await BanThang.findAll({
                include: [
                    { model: TranDau, as: 'TranDau' },
                    { model: CauThu, as: 'CauThu' },
                    { model: DoiBong, as: 'DoiBong' },
                    { model: LoaiBanThang, as: 'LoaiBanThang' },
                ],
            });
            res.status(200).json(banThangs);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách bàn thắng.' });
        }
    },

    async getByTranDau(req, res) {
        try {
            const { MaTranDau } = req.params;
            const banThangs = await BanThang.findAll({
                where: { MaTranDau },
                include: [
                    { model: CauThu, as: 'CauThu' },
                    { model: DoiBong, as: 'DoiBong' },
                    { model: LoaiBanThang, as: 'LoaiBanThang' },
                ],
            });
            res.status(200).json(banThangs);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy bàn thắng của trận đấu.' });
        }
    },

    async create(req, res) {
        try {
            const { MaBanThang, MaTranDau, MaDoiBong, MaCauThu, MaLoaiBanThang, ThoiDiem } = req.body;
            const banThang = await BanThang.create({
                MaBanThang, MaTranDau, MaDoiBong, MaCauThu, MaLoaiBanThang, ThoiDiem,
            });
            res.status(201).json(banThang);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm bàn thắng.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const banThang = await BanThang.findByPk(id);
            if (!banThang) return res.status(404).json({ error: 'Không tìm thấy bàn thắng.' });
            await banThang.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa bàn thắng.' });
        }
    },
};

module.exports = BanThangController;