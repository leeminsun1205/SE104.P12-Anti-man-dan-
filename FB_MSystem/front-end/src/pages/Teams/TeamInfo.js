import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamInfo.css';
import defaultHomeImage from '../../assets/images/teams/default_home.png';
import defaultAwayImage from '../../assets/images/teams/default_away.png';
import defaultThirdImage from '../../assets/images/teams/default_away.png';

function TeamInfo({ API_URL, teams }) {
  const { MaDoiBong } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null)
  const [stadiums, setStadiums] = useState({})

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await fetch(`${API_URL}/doi-bong/${MaDoiBong}`);
        if (!response.ok) {
          const message = await response.text();
          throw new Error(`Failed to fetch available teams: ${response.status} - ${message}`);
        }
        const data = await response.json();
        console.log(data)
        setStadiums(data.doiBong);
      } catch (error) {
        console.error("Error fetching available teams:", error);
        setError(error.message);
      }
    };

    fetchStadiums();
  }, [stadiums]);
  console.log(stadiums)
  const team = teams.find((t) => t.MaDoiBong === MaDoiBong);
  const handleToPlayer = (MaDoiBong) => {
    navigate(`/doi-bong/${MaDoiBong}/cau-thu`);
  };

  const handleStadiumClick = (stadiumId) => {
    navigate(`/san-thi-dau/${stadiumId}`);
  };

  if (!team) {
    return (
      <div className="team-info">
        <p>Không tìm thấy đội bóng.</p>
        <button className="go-back-team-button" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }
  return (
    <div className="team-info">
      <button className="go-back-team-button" onClick={() => navigate(-1)}>
        Quay lại
      </button>
      <div className="team-details">
        <h2>Thông tin đội bóng {team.TenDoiBong}</h2>
        <ul>
          <li>
            <strong>Thành phố:</strong> {team.ThanhPhoTrucThuoc}
          </li>
          <li>
            <strong>Huấn luyện viên:</strong> {team.TenHLV}
          </li>
          <li>
            <strong>Sân nhà:</strong>{" "}
            <span
              onClick={() => handleStadiumClick(stadiums.MaSan)}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              {team.TenSan ? team.TenSan : 'N/A'}
            </span>
          </li>
          <li>
            <strong>Sức chứa:</strong> {stadiums.SucChua}
          </li>
          <li>
            <strong>Đạt tiêu chuẩn (số sao):</strong> {stadiums.TieuChuan}{" "}
            <strong>của LĐBĐTG</strong>
          </li>
        </ul>
        <p className="team-description">
          <strong>Giới thiệu đội:</strong>
          <span>{team.ThongTin}</span>
        </p>
      </div>
      <div className="uniform-images">
        <div className="kit-container">
          <p className="kit-label">Áo sân nhà</p>
          <img
            src={
              team.home_kit_image instanceof File
                ? URL.createObjectURL(team.home_kit_image)
                : team.home_kit_image || defaultHomeImage
            }
            alt={`${team.TenDoiBong} Home Uniform`}
            className="uniform-image"
            loading="lazy"
          />
        </div>
        <div className="kit-container">
          <p className="kit-label">Áo sân khách</p>
          <img
            src={
              team.away_kit_image instanceof File
                ? URL.createObjectURL(team.away_kit_image)
                : team.away_kit_image || defaultAwayImage
            }
            alt={`${team.TenDoiBong} Away Uniform`}
            className="uniform-image"
            loading="lazy"
          />
        </div>
        <div className="kit-container">
          <p className="kit-label">Áo dự bị</p>
          <img
            src={
              team.third_kit_image instanceof File
                ? URL.createObjectURL(team.third_kit_image)
                : team.third_kit_image || defaultThirdImage
            }
            alt={`${team.name} Third Uniform`}
            className="uniform-image"
            loading="lazy"
          />
        </div>
      </div>
      <div className="action">
        <button className="to-player" onClick={() => handleToPlayer(team.MaDoiBong)}>
          Cầu thủ
        </button>
      </div>
    </div>
  );
}


export default TeamInfo