import React from 'react';
import styled from 'styled-components';

// Styled components for styling
const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
    font-family: Arial, sans-serif;
`;

const Label = styled.label`
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
`;

const Select = styled.select`
    padding: 0.5rem;
    font-size: 1rem;
    border: 2px solid #007bff;
    border-radius: 4px;
    background-color: #f8f9fa;
    color: #333;

    &:focus {
        outline: none;
        border-color: #0056b3;
        box-shadow: 0 0 5px rgba(0, 91, 187, 0.5);
    }
`;

const Option = styled.option`
    padding: 0.5rem;
`;

function TeamSelector({ teams, onTeamsChange, selectedTeam }) {
    const filteredTeams = teams.filter(team => team.name);
    return (
      <div>
        <select value={selectedTeam} onChange={(e) => onTeamsChange(e.target.value)}>
          <option value="">Chọn mùa giải</option>
          {filteredTeams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
export default TeamSelector;