import React, { useState, useEffect } from "react";
import styles from "./MatchForm.module.css";

function MatchForm({ match: initialMatch, onSave, onCancel, API_URL }) {
  const [editedMatch, setEditedMatch] = useState(initialMatch);
  const [homeTeamPlayers, setHomeTeamPlayers] = useState([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState([]);

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      if (editedMatch?.homeTeamId && editedMatch?.season) {
        try {
          const homeResponse = await fetch(
            `${API_URL}/teams/${editedMatch.homeTeamId}/players?season=${editedMatch.season}`
          );
          if (homeResponse.ok) {
            const homeData = await homeResponse.json();
            setHomeTeamPlayers(homeData.players);
          } else {
            console.error("Failed to fetch home team players");
            setHomeTeamPlayers([]);
          }
        } catch (error) {
          console.error("Error fetching home team players:", error);
          setHomeTeamPlayers([]);
        }
      }

      if (editedMatch?.awayTeamId && editedMatch?.season) {
        try {
          const awayResponse = await fetch(
            `${API_URL}/teams/${editedMatch.awayTeamId}/players?season=${editedMatch.season}`
          );
          if (awayResponse.ok) {
            const awayData = await awayResponse.json();
            setAwayTeamPlayers(awayData.players);
          } else {
            console.error("Failed to fetch away team players");
            setAwayTeamPlayers([]);
          }
        } catch (error) {
          console.error("Error fetching away team players:", error);
          setAwayTeamPlayers([]);
        }
      }
    };

    fetchTeamPlayers();
  }, [editedMatch?.homeTeamId, editedMatch?.awayTeamId, editedMatch?.season, API_URL]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedMatch((prevMatch) => ({
      ...prevMatch,
      [name]: value,
    }));
  };

  const handleGoalsChange = (newGoals) => {
    setEditedMatch((prevMatch) => ({
      ...prevMatch,
      goals: newGoals,
    }));
  };

  const handleCardsChange = (newCards) => {
    setEditedMatch((prevMatch) => ({
      ...prevMatch,
      cards: newCards,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(editedMatch);
  };

  const getAvailablePlayersForTeam = (teamName) => {
    if (teamName === editedMatch?.homeTeamName) {
      return homeTeamPlayers;
    } else if (teamName === editedMatch?.awayTeamName) {
      return awayTeamPlayers;
    }
    return [];
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      {/* Existing form inputs */}
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="homeTeam">
          Đội nhà:
        </label>
        <input
          className={styles.input}
          type="text"
          id="homeTeam"
          name="homeTeamName"
          value={editedMatch?.homeTeamName || ""}
          readOnly
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="awayTeam">
          Đội khách:
        </label>
        <input
          className={styles.input}
          type="text"
          id="awayTeam"
          name="awayTeamName"
          value={editedMatch?.awayTeamName || ""}
          readOnly
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="homeScore">
          Bàn thắng đội nhà:
        </label>
        <input
          className={styles.input}
          type="number"
          id="homeScore"
          name="homeScore"
          value={editedMatch?.homeScore || 0}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="awayScore">
          Bàn thắng đội khách:
        </label>
        <input
          className={styles.input}
          type="number"
          id="awayScore"
          name="awayScore"
          value={editedMatch?.awayScore || 0}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="date">
          Ngày:
        </label>
        <input
          className={styles.input}
          type="date"
          id="date"
          name="date"
          value={editedMatch?.date || ""}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="time">
          Giờ:
        </label>
        <input
          className={styles.input}
          type="time"
          id="time"
          name="time"
          value={editedMatch?.time || ""}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="stadium">
          Sân vận động:
        </label>
        <input
          className={styles.input}
          type="text"
          id="stadium"
          name="stadiumName"
          value={editedMatch?.stadiumName || ""}
          readOnly
        />
      </div>

      {/* Goals Table */}
      <GoalsTable
        goals={editedMatch?.goals || []}
        onChange={handleGoalsChange}
        homeTeamName={editedMatch?.homeTeamName}
        awayTeamName={editedMatch?.awayTeamName}
        getAvailablePlayers={getAvailablePlayersForTeam}
      />

      {/* Cards Table */}
      <CardsTable
        cards={editedMatch?.cards || []}
        onChange={handleCardsChange}
        homeTeamName={editedMatch?.homeTeamName}
        awayTeamName={editedMatch?.awayTeamName}
        getAvailablePlayers={getAvailablePlayersForTeam}
      />

      <div className={styles.buttonGroup}>
        <button className={styles.saveButton} type="submit">
          Lưu
        </button>
        <button className={styles.cancelButton} type="button" onClick={onCancel}>
          Hủy
        </button>
      </div>
    </form>
  );
}

// GoalsTable Component
function GoalsTable({ goals, onChange, homeTeamName, awayTeamName, getAvailablePlayers }) {
  const handleGoalChange = (index, field, value) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, [field]: value } : goal
    );
    onChange(updatedGoals);
  };

  const addGoal = () => {
    onChange([
      ...goals,
      { player: "", team: homeTeamName, type: "", time: "" },
    ]);
  };

  const removeGoal = (index) => {
    onChange(goals.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.tableContainer}>
      <label className={styles.label}>Bàn thắng:</label>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cầu thủ</th>
            <th>Đội</th>
            <th>Loại</th>
            <th>Thời điểm</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((goal, index) => (
            <tr key={index}>
              <td>
                <select
                  value={goal.player}
                  onChange={(e) =>
                    handleGoalChange(index, "player", e.target.value)
                  }
                >
                  <option value="">Chọn cầu thủ</option>
                  {getAvailablePlayers(goal.team).map((player) => (
                    <option key={player.id} value={player.name} />
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={goal.team}
                  onChange={(e) =>
                    handleGoalChange(index, "team", e.target.value)
                  }
                >
                  <option value={homeTeamName}>{homeTeamName}</option>
                  <option value={awayTeamName}>{awayTeamName}</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={goal.type}
                  onChange={(e) =>
                    handleGoalChange(index, "type", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={goal.time}
                  onChange={(e) =>
                    handleGoalChange(index, "time", e.target.value)
                  }
                />
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => removeGoal(index)}
                  className={styles.removeButton}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addGoal} className={styles.addButton}>        Thêm bàn thắng
      </button>
    </div>
  );
}

function CardsTable({ cards, onChange, homeTeamName, awayTeamName, getAvailablePlayers }) {
  const handleCardChange = (index, field, value) => {
    const updatedCards = cards.map((card, i) =>
      i === index ? { ...card, [field]: value } : card
    );
    onChange(updatedCards);
  };

  const addCard = () => {
    onChange([
      ...cards,
      { player: "", team: homeTeamName, type: "Yellow", time: "" },
    ]);
  };

  const removeCard = (index) => {
    onChange(cards.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.tableContainer}>
      <label className={styles.label}>Thẻ phạt:</label>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cầu thủ</th>
            <th>Đội</th>
            <th>Loại</th>
            <th>Thời điểm</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card, index) => (
            <tr key={index}>
              <td>
                <select
                  value={card.player}
                  onChange={(e) =>
                    handleCardChange(index, "player", e.target.value)
                  }
                >
                  <option value="">Chọn cầu thủ</option>
                  {getAvailablePlayers(card.team).map((player) => (
                    <option key={player.id} value={player.name} />
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={card.team}
                  onChange={(e) =>
                    handleCardChange(index, "team", e.target.value)
                  }
                >
                  <option value={homeTeamName}>{homeTeamName}</option>
                  <option value={awayTeamName}>{awayTeamName}</option>
                </select>
              </td>
              <td>
                <select
                  value={card.type}
                  onChange={(e) =>
                    handleCardChange(index, "type", e.target.value)
                  }
                >
                  <option value="Yellow">Thẻ vàng</option>
                  <option value="Red">Thẻ đỏ</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={card.time}
                  onChange={(e) =>
                    handleCardChange(index, "time", e.target.value)
                  }
                />
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => removeCard(index)}
                  className={styles.removeButton}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addCard} className={styles.addButton}>
        Thêm thẻ phạt
      </button>
    </div>
  );
}

export default MatchForm;