import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamInfo.css';
import defaultHomeImage from '../../assets/images/teams/default_home.png';
import defaultAwayImage from '../../assets/images/teams/default_away.png';

function TeamInfo({ teams }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const teamId = parseInt(id, 10);
    const team = teams.find((t) => t.id === teamId);

    const handleToPlayer = (id) => {
        navigate(`/teams/${id}/players`);
    };

    const handleToOtherMatches = (id) => {
        navigate(`/teams/${id}/other-matches`);
    };

    if (!team) {
        return (
            <div className="team-info">
                <p>Không tìm thấy đội bóng.</p>
                <button className="go-back-button" onClick={() => navigate(-1)}>
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="team-info">
            <button className="go-back-button" onClick={() => navigate(-1)}>
                Quay lại
            </button>
            <div className="team-details">
                <h2>Thông tin đội bóng {team.name}</h2>
                <ul>
                    <li>
                        <strong>Thành phố:</strong> {team.city}
                    </li>
                    <li>
                        <strong>Cơ quan/Công ty chủ quản:</strong> {team.managing_body}
                    </li>
                    <li>
                        <strong>Sân nhà:</strong> {team.stadium}
                    </li>
                    <li>
                        <strong>Sức chứa:</strong> {team.capacity}
                    </li>
                    <li>
                        <strong>Đạt tiêu chuẩn (số sao):</strong> {team.fifa_stars} <strong>của Liên đoàn bóng đá Thế giới</strong>
                    </li>
                </ul>
                <p>
                    <strong>Giới thiệu đội:</strong> {team.description}
                </p>
            </div>
            <div className="uniform-images">
                <div className="kit-container"> {/* Wrap label and image */}
                    <p className="kit-label">Áo sân nhà</p>
                    <img
                        src={
                            team.home_kit_image instanceof File
                                ? URL.createObjectURL(team.home_kit_image)
                                : team.home_kit_image || defaultHomeImage
                        }
                        alt={`${team.name} Home Uniform`}
                        className="uniform-image"
                        loading="lazy"
                    />
                </div>
                <div className="kit-container"> {/* Wrap label and image */}
                    <p className="kit-label">Áo sân khách</p>
                    <img
                        src={
                            team.away_kit_image instanceof File
                                ? URL.createObjectURL(team.away_kit_image)
                                : team.away_kit_image || defaultAwayImage
                        }
                        alt={`${team.name} Away Uniform`}
                        className="uniform-image"
                        loading="lazy"
                    />
                </div>
            </div>
            <div className="action">
                <button className="toplayer" onClick={() => handleToPlayer(team.id)}>
                    Cầu thủ
                </button>
                <button
                    className="to-other-matches"
                    onClick={() => handleToOtherMatches(team.id)}
                >
                    Giải đấu khác
                </button>
            </div>
        </div>
    );
}

export default TeamInfo;