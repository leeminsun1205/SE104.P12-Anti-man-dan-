const express = require('express');
const bodyParser = require('body-parser');

// Import các routes
const cauThuRoutes = require('./routes/cauThuRoutes');
const doiBongRoutes = require('./routes/doiBongRoutes');
const sanThiDauRoutes = require('./routes/sanThiDauRoutes');
const mgDbCtRoutes = require('./routes/mg_Db_CtRoutes');
const bangXepHangRoutes = require('./routes/bangXepHangRoutes');
const tranDauRoutes = require('./routes/tranDauRoutes');
const banThangRoutes = require('./routes/banThangRoutes');
const loaiBanThangRoutes = require('./routes/loaiBanThangRoutes');
const ut_XepHangRoutes = require('./routes/ut_XepHangRoutes');
const vuaPhaLuoiRoutes = require('./routes/vuaPhaLuoiRoutes');
const loaiUuTienRoutes = require('./routes/loaiUuTienRoutes');
const thePhatRoutes = require('./routes/thePhatRoutes');
const loaiThePhatRoutes = require('./routes/loaiThePhatRoutes');
const ds_ThePhatRoutes = require('./routes/ds_ThePhatRoutes');
const thamSoRoutes = require('./routes/thamSoRoutes');
const lichSuGiaiDauRoutes = require('./routes/lichSuGiaiDauRoutes');
const thanhTichRoutes = require('./routes/thanhTichRoutes');
const vongDauRoutes = require('./routes/vongDauRoutes');
const muaGiaiRoutes = require('./routes/muaGiaiRoutes');
const bienNhanRoutes = require('./routes/bienNhanRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Định tuyến cho các routes
// Cầu thủ, đội bóng, sân thi đấu, MG_DB_CT
app.use('/cau-thu', cauThuRoutes);
app.use('/doi-bong', doiBongRoutes);
app.use('/san-thi-dau', sanThiDauRoutes);
app.use('/mg-db-ct', mgDbCtRoutes);

// Bảng xếp hạng, trận đấu, bàn thắng, ưu tiên xếp hạng, vua phá lưới, loại ưu tiên
app.use('/bang-xep-hang', bangXepHangRoutes);
app.use('/tran-dau', tranDauRoutes);
app.use('/ban-thang', banThangRoutes);
app.use('/loai-ban-thang', loaiBanThangRoutes);
app.use('/ut-xep-hang', ut_XepHangRoutes);
app.use('/vua-pha-luoi', vuaPhaLuoiRoutes);
app.use('/loai-uu-tien', loaiUuTienRoutes);

// Thẻ phạt, loại thẻ phạt, DS thẻ phạt
app.use('/the-phat', thePhatRoutes);
app.use('/loai-the-phat', loaiThePhatRoutes);
app.use('/ds-the-phat', ds_ThePhatRoutes);

// Tham số, lịch sử giải đấu, thành tích, vòng đấu, mùa giải, biên nhận
app.use('/tham-so', thamSoRoutes);
app.use('/lich-su-giai-dau', lichSuGiaiDauRoutes);
app.use('/thanh-tich', thanhTichRoutes);
app.use('/vong-dau', vongDauRoutes);
app.use('/mua-giai', muaGiaiRoutes);
app.use('/bien-nhan', bienNhanRoutes);

// Khởi động server
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server đang khởi chạy tại http://localhost:${PORT}`);
});


