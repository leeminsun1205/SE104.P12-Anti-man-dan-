#Tạo schema/database
CREATE SCHEMA IF NOT EXISTS se104 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_general_ci;
#Kết nối csdl
USE SE104;

#Tạo bảng
CREATE TABLE CAUTHU (
	MaCauThu	CHAR(10) NOT NULL,
	TenCauThu	VARCHAR(50) NOT NULL,
	NgaySinh	DATE NOT NULL,
	QuocTich	VARCHAR(50) NOT NULL,
	LoaiCauThu	BIT NOT NULL, -- true: Trong Nước, false: Ngoài Nước
	ViTri	    VARCHAR(30) NOT NULL,
	ChieuCao	DECIMAL(3,2) NOT NULL CHECK (ChieuCao > 0),
	CanNang	    DECIMAL(5,2) NOT NULL CHECK (CanNang > 0),
	SoAo	    TINYINT UNSIGNED NOT NULL CHECK (SoAo BETWEEN 1 AND 99),
	TieuSu	    VARCHAR(1000),
    CONSTRAINT CK_LoaiCauThu_QuocTich CHECK ((LoaiCauThu = 1 AND QuocTich = 'Việt Nam') OR (LoaiCauThu = 0 AND QuocTich <> 'Việt Nam')),
	CONSTRAINT PK_CAUTHU PRIMARY KEY (MaCauThu)
);

CREATE TABLE SANTHIDAU (
	MaSan CHAR(10) NOT NULL,                
	TenSan VARCHAR(50) NOT NULL,                        
	DiaChiSan VARCHAR(80) NOT NULL,                     
	SucChua INT NOT NULL CHECK (SucChua > 0),           
	TieuChuan TINYINT NOT NULL CHECK (TieuChuan BETWEEN 1 AND 5),
    CONSTRAINT PK_SANTHIDAU PRIMARY KEY (MaSan)
);

CREATE TABLE DOIBONG (
	MaDoiBong CHAR(10) NOT NULL,
	TenDoiBong VARCHAR(50) NOT NULL,
	ThanhPhoTrucThuoc VARCHAR (50) NOT NULL,
	MaSan CHAR(10) NOT NULL UNIQUE,
	TenHLV VARCHAR(50) NOT NULL,
	ThongTin VARCHAR(1000),
    CONSTRAINT UQ_TenDoiBong UNIQUE (TenDoiBong),
    CONSTRAINT PK_DOIBONG PRIMARY KEY (MaDoiBong),
    CONSTRAINT FK_DOIBONG_SANTHIDAU FOREIGN KEY (MaSan) REFERENCES SANTHIDAU(MaSan)
);

CREATE TABLE BIENNHAN (
	MaBienNhan	CHAR(10) NOT NULL,
	MaDoiBong CHAR(10) NOT NULL UNIQUE,
	LePhi BIGINT NOT NULL, -- VND
	NgayBatDau DATE NOT NULL,
	NgayHetHan DATE NOT NULL,
	NgayThanhToan DATE,
	TinhTrang BIT NOT NULL, -- false: Chưa thanh toán, true: Đã thanh toán
	CONSTRAINT CK_NgayBatDau_NgayHetHan_BN CHECK (NgayBatDau < NgayHetHan),     
	CONSTRAINT CK_HopLe CHECK ((NgayThanhToan IS NULL AND TinhTrang = 0) OR (NgayThanhToan >= NgayBatDau AND TinhTrang = 1)),
    CONSTRAINT PK_BIENNHAN PRIMARY KEY (MaBienNhan),
    CONSTRAINT FK_BIENNHAN_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong) ON DELETE CASCADE                         
);

CREATE TABLE MUAGIAI (
	MaMuaGiai CHAR(10) NOT NULL,
	TenMuaGiai VARCHAR(50) NOT NULL,
	NgayBatDau DATE NOT NULL,
	NgayKetThuc DATE NOT NULL,
    CONSTRAINT CK_NgayBatDau_NgayKetThuc_MG CHECK (NgayBatDau < NgayKetThuc),
    CONSTRAINT UQ_TenMuaGiai UNIQUE (TenMuaGiai),
    CONSTRAINT PK_MUAGIAI PRIMARY KEY (MaMuaGiai)
);

CREATE TABLE MG_DB_CT (
	MaMuaGiai CHAR(10) NOT NULL,
	MaDoiBong CHAR(10) NOT NULL,
	MaCauThu CHAR(10) NOT NULL,
    CONSTRAINT FK_MG_DB_CT PRIMARY KEY (MaMuaGiai, MaDoiBong, MaCauThu),
    CONSTRAINT FK_MG_DB_CT_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai) ON DELETE CASCADE,
    CONSTRAINT FK_MG_DB_CT_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_MG_DB_CT_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu)
);

CREATE TABLE VONGDAU (
    MaVongDau CHAR(10) NOT NULL,                
    MaMuaGiai CHAR(10) NOT NULL,                
    LuotDau BIT NOT NULL,  # false: lượt đi, true: lượt về                     
    SoThuTu TINYINT UNSIGNED NOT NULL,          
    NgayBatDau DATE,                            
    NgayKetThuc DATE,                           
    CONSTRAINT CK_NgayBatDau_NgayKetThuc CHECK (NgayBatDau IS NULL OR NgayKetThuc IS NULL OR NgayBatDau <= NgayKetThuc),
    CONSTRAINT PK_VONGDAU PRIMARY KEY (MaVongDau), 
    CONSTRAINT FK_VONGDAU_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai) ON DELETE CASCADE                                                
);

CREATE TABLE TRANDAU (
	MaVongDau CHAR(10) NOT NULL,
	MaTranDau CHAR(10) NOT NULL,
	MaDoiBongNha CHAR(10) NOT NULL,
	MaDoiBongKhach	CHAR(10) NOT NULL,
    MaSan CHAR(10) NOT NULL,
	NgayThiDau DATE,
	GioThiDau TIME,
    BanThangDoiNha INT,
	BanThangDoiKhach INT,
    CONSTRAINT CK_DoiKhacNhau CHECK (MaDoiBongNha <> MaDoiBongKhach),
    CONSTRAINT CK_BanThangDoiNha CHECK (BanThangDoiNha >= 0),
	CONSTRAINT CK_BanThangDoiKhach CHECK (BanThangDoiKhach >= 0),
    CONSTRAINT PK_TRANDAU PRIMARY KEY (MaTranDau),
    CONSTRAINT FK_TRANDAU_VONGDAU FOREIGN KEY (MaVongDau) REFERENCES VONGDAU(MaVongDau),
    CONSTRAINT FK_TRANDAU_DOIBONGNHA FOREIGN KEY (MaDoiBongNha) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_TRANDAU_DOIBONGKHACH FOREIGN KEY (MaDoiBongKhach) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_TRANDAU_SANTHIDAU FOREIGN KEY (MaSan) REFERENCES SANTHIDAU(MaSan)
);

CREATE TABLE LOAIBANTHANG (
	MaLoaiBanThang CHAR(10) NOT NULL,
	TenLoaiBanThang VARCHAR (20) NOT NULL,
	MoTa VARCHAR (50),
    CONSTRAINT UQ_TenLoaiBanThang UNIQUE (TenLoaiBanThang),
    CONSTRAINT PK_LOAIBANTHANG PRIMARY KEY (MaLoaiBanThang)
);

CREATE TABLE BANTHANG (
	MaBanThang CHAR(10) NOT NULL,
	MaTranDau CHAR(10) NOT NULL,
	MaDoiBong CHAR(10) NOT NULL,
	MaCauThu CHAR(10) NOT NULL,
	MaLoaiBanThang CHAR(10) NOT NULL,
	ThoiDiem INT NOT NULL,
    CONSTRAINT CK_ThoiDiem CHECK (ThoiDiem > 0 AND ThoiDiem <= 90),
    CONSTRAINT PK_BANTHANG PRIMARY KEY (MaBanThang),
    CONSTRAINT FK_BANTHANG_TRANDAU FOREIGN KEY (MaTranDau) REFERENCES TRANDAU(MaTranDau),
    CONSTRAINT FK_BANTHANG_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_BANTHANG_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu),
    CONSTRAINT FK_BANTHANG_LOAIBANTHANG FOREIGN KEY (MaLoaiBanThang) REFERENCES LOAIBANTHANG(MaLoaiBanThang)
);

CREATE TABLE BANGXEPHANG (
	MaMuaGiai CHAR(10) NOT NULL,
	MaVongDau CHAR (10) NOT NULL,
	MaDoiBong CHAR(10) NOT NULL,
	SoTran TINYINT NOT NULL,
	SoTranThang	TINYINT NOT NULL,
	SoTranHoa TINYINT NOT NULL,
	SoTranThua TINYINT NOT NULL,
	SoBanThang TINYINT NOT NULL,
	SoBanThua TINYINT NOT NULL,
    DiemSo TINYINT NOT NULL,
	HieuSo TINYINT NOT NULL,
    CONSTRAINT CK_SoTran_BXH CHECK (SoTran = SoTranThang + SoTranHoa + SoTranThua),
    CONSTRAINT CK_HieuSo_BXH CHECK (HieuSo = SoBanThang - SoBanThua),
    CONSTRAINT PK_BANGXEPHANG PRIMARY KEY (MaMuaGiai, MaVongDau, MaDoiBong),
    CONSTRAINT FK_BANGXEPHANG_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai),
    CONSTRAINT FK_BANGXEPHANG_VONGDAU FOREIGN KEY (MaVongDau) REFERENCES VONGDAU(MaVongDau)
);

CREATE TABLE LOAIUUTIEN (
	MaLoaiUuTien CHAR(10) NOT NULL,
	TenLoaiUuTien VARCHAR (50) NOT NULL,
    CONSTRAINT PK_LOAIUUTIEN PRIMARY KEY (MaLoaiUuTien)
);

CREATE TABLE UT_XEPHANG (
	MaMuaGiai CHAR(10) NOT NULL,
	MaLoaiUuTien CHAR (10) NOT NULL,
	MucDoUuTien TINYINT NOT NULL,
    CONSTRAINT PK_UT_XEPHANG PRIMARY KEY (MaMuaGiai, MaLoaiUuTien),
    CONSTRAINT FK_UT_XEPHANG_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai),
    CONSTRAINT FK_UT_XEPHANG_LOAIUUTIEN FOREIGN KEY (MaLoaiUuTien) REFERENCES LOAIUUTIEN(MaLoaiUuTien)
);

CREATE TABLE VUAPHALUOI (
	MaCauThu CHAR(10) NOT NULL,
	MaMuaGiai CHAR(10) NOT NULL,
    MaDoiBong CHAR(10) NOT NULL,
	SoTran TINYINT NOT NULL,
	SoBanThang TINYINT NOT NULL,
    CONSTRAINT PK_VUAPHALUOI PRIMARY KEY (MaCauThu, MaMuaGiai),
    CONSTRAINT FK_VUAPHALUOI_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_VUAPHALUOI_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai),
    CONSTRAINT FK_VUAPHALUOI_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu)
);

CREATE TABLE LOAITHEPHAT (
	MaLoaiThePhat CHAR(10) NOT NULL,
	TenLoaiThePhat VARCHAR(10) NOT NULL,
	MoTa VARCHAR(50),
    CONSTRAINT UQ_TenLoaiThePhat UNIQUE (TenLoaiThePhat),
    CONSTRAINT PK_LOAITHEPHAT PRIMARY KEY (MaLoaiThePhat)
);

CREATE TABLE THEPHAT (
	MaThePhat CHAR(10) NOT NULL,         
	MaTranDau CHAR(10) NOT NULL,                    
	MaCauThu CHAR(10) NOT NULL,                     
	MaLoaiThePhat CHAR(10) NOT NULL,               
	ThoiGian TIME NOT NULL,                         
	LyDo VARCHAR(100) NOT NULL, 
    CONSTRAINT PK_THEPHAT PRIMARY KEY (MaThePhat),
	CONSTRAINT FK_THETPHAT_TRANDAU FOREIGN KEY (MaTranDau) REFERENCES TRANDAU(MaTranDau), 
	CONSTRAINT FK_THETPHAT_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu),   
	CONSTRAINT FK_THETPHAT_LOAITHEPHAT FOREIGN KEY (MaLoaiThePhat) REFERENCES LOAITHEPHAT(MaLoaiThePhat) 
);

CREATE TABLE DS_THEPHAT (
	MaCauThu CHAR(10) NOT NULL,                   
	MaVongDau VARCHAR(10) NOT NULL,               
	SoTheVang TINYINT NOT NULL,                    
	SoTheDo TINYINT NOT NULL,                     
	TinhTrangThiDau BIT NOT NULL, # 0: cấm thi đấu, 1: được thi đấu                 
	CONSTRAINT PK_DS_THEPHAT PRIMARY KEY (MaCauThu, MaVongDau),             
	CONSTRAINT FK_DS_THEPHAT_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu),
    CONSTRAINT FK_DS_THEPHAT_DOIBONG FOREIGN KEY (MaVongDau) REFERENCES VONGDAU(MaVongDau)
);

CREATE TABLE LS_GIAIDAU (
	MaDoiBong VARCHAR(10) NOT NULL,            
	SoLanThamGia TINYINT NOT NULL,             
	SoLanVoDich TINYINT NOT NULL,              
	SoLanAQuan TINYINT NOT NULL,               
	SoLanHangBa TINYINT NOT NULL,
    TongSoTran TINYINT NOT NULL,   
	CONSTRAINT PK_LS_GIAIDAU PRIMARY KEY (MaDoiBong),                  
	CONSTRAINT FK_LS_GIAIDAU_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong) 
);

CREATE TABLE THANHTICH (
	MaDoiBong	CHAR(10) NOT NULL,
	MaMuaGiai	CHAR(10) NOT NULL,
	SoTranDaThiDau	TINYINT NOT NULL,
	SoTranThang	TINYINT NOT NULL,
	SoTranHoa	TINYINT NOT NULL,
	SoTranThua	TINYINT NOT NULL,
	XepHang	TINYINT NOT NULL CHECK (XepHang > 0),
    CONSTRAINT CK_TongSoTran_TT CHECK (SoTranDaThiDau = SoTranThang + SoTranHoa + SoTranThua),
    CONSTRAINT PK_THANHTICH PRIMARY KEY (MaDoiBong, MaMuaGiai),    
    CONSTRAINT FK_THANHTICH_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_THANHTICH_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai)
);

CREATE TABLE THAMSO (
    id INT PRIMARY KEY DEFAULT 1,                    
    SucChuaToiThieu INT NOT NULL DEFAULT 5000,       
    TieuChuanToiThieu TINYINT NOT NULL DEFAULT 3,    
    TuoiToiThieu TINYINT NOT NULL DEFAULT 18,        
    TuoiToiDa TINYINT NOT NULL DEFAULT 40,           
    SoLuongCauThuToiThieu TINYINT NOT NULL DEFAULT 11, 
    SoLuongCauThuToiDa TINYINT NOT NULL DEFAULT 25,  
    SoCauThuNgoaiToiDa TINYINT NOT NULL DEFAULT 5,   
    LePhi INT NOT NULL DEFAULT 1000000000,
    NgayBatDauLePhi DATE NOT NULL DEFAULT '2024-12-23',
    NgayHetHanLePhi DATE NOT NULL DEFAULT '2025-1-23',
    ThoiDiemGhiBanToiDa INT NOT NULL DEFAULT 90,    
    DiemThang TINYINT NOT NULL DEFAULT 3,           
    DiemHoa TINYINT NOT NULL DEFAULT 1,             
    DiemThua TINYINT NOT NULL DEFAULT 0,            
    CONSTRAINT CK_ID CHECK (id = 1),
    CONSTRAINT CK_NgayBatDau_NgayHetHan_TS CHECK (NgayBatDauLePhi <= NgayHetHanLePhi),
    CONSTRAINT CK_Tuoi_TS CHECK (TuoiToiThieu < TuoiToiDa),
	CONSTRAINT CK_SoLuongCauThu_TS CHECK (SoLuongCauThuToiThieu <= SoLuongCauThuToiDa),
	CONSTRAINT CK_SucChua_TS CHECK (SucChuaToiThieu > 0),
	CONSTRAINT CK_ThoiDiemGhiBan_TS CHECK (ThoiDiemGhiBanToiDa >= 0)
);
INSERT INTO THAMSO (
    id,
    SucChuaToiThieu,
    TieuChuanToiThieu,
    TuoiToiThieu,
    TuoiToiDa,
    SoLuongCauThuToiThieu,
    SoLuongCauThuToiDa,
    SoCauThuNgoaiToiDa,
    LePhi,
    NgayBatDauLePhi,
    NgayHetHanLePhi,
    ThoiDiemGhiBanToiDa,
    DiemThang,
    DiemHoa,
    DiemThua
) VALUES (
    1, 5000, 3, 18, 40, 11, 25, 5, 1000000000, '2024-12-23', '2025-1-23', 90, 3, 1, 0
);

#Kiểm tra bảng
select * from thamso
-- SHOW TABLES;
-- DESCRIBE TRANDAU;
-- select * from trandau;
-- DROP TABLE IF EXISTS TRANDAU;
