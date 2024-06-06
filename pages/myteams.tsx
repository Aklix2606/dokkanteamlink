import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';
import router from 'next/router';
import { useAuth } from '../components/context/authContext';

const CenteredButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005bb5;
  }
`;


const TeamItem = ({ team, onDelete }) => {
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [addedCharacters, setAddedCharacters] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, router]);

  const handleShowCharacters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/personatgesinvocats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const charactersData = await response.json();
        setCharacters(charactersData.filter((char) => !addedCharacters.find((addedChar) => addedChar.numobj === char.numobj)));
      } else {
        if (response.status === 403 || response.status === 500) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          console.error('Failed to fetch player characters:', response.statusText);
          setErrorMessage('Failed to fetch player characters. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error fetching player characters:', error);
      setErrorMessage('An error occurred while fetching player characters.');
    }
  };

  const handleAddToTeam = async (character) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api//teams/:nomequip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nomequip: team.nomequip, nom: character.nom }),
      });

      if (response.ok) {
        setAddedCharacters([...addedCharacters, character]);
        setCharacters(characters.filter((char) => char.numobj !== character.numobj));
      } else {
        if (response.status === 403 || response.status === 500) {
          localStorage.removeItem('token');
         window.location.href = '/login';
        } else {
          console.error('Failed to add character to team:', response.statusText);
          setErrorMessage('Failed to add character to team. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error adding character to team:', error);
      setErrorMessage('An error occurred while adding character to team.');
    }
  };

  return (
    <div>
      <h3>{team.nomequip}</h3>
      <button onClick={onDelete}>Delete</button>
      <button onClick={handleShowCharacters}>Show Characters</button>
      {characters.length > 0 && (
        <div>
          <h4>Available Characters</h4>
          <ul>
            {characters.map((character) => (
              <li key={character.numobj}>
                {character.nom} - {character.numobj}{' '}
                <button onClick={() => handleAddToTeam(character)}>Add to Team</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {addedCharacters.length > 0 && (
        <div>
          <h4>Added Characters</h4>
          <ul>
            {addedCharacters.map((character) => (
              <li key={character.numobj}>
                {character.nom} - {character.numobj}
              </li>
            ))}
          </ul>
        </div>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};



const AddTeam = ({ onTeamAdded }) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleAddTeamSubmit = async () => {
    if (!newTeamName) {
      setErrorMessage('Please enter a team name.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nomequip: newTeamName }),
      });

      if (response.ok) {
        const newTeam = await response.json();
        onTeamAdded(newTeam);
        setNewTeamName('');
        setErrorMessage(null);
      } else {
        const errorResponse = await response.json();
        console.error('Failed to add team:', errorResponse.message);
        setErrorMessage(errorResponse.message || 'Failed to add team. Please try again later.');
      }
    } catch (error) {
      console.error('Error adding team:', error);
      setErrorMessage('An error occurred while adding the team.');
    }
  };

  return (
    <div className="add-team-popup">
      <h2>Add Team</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input
        type="text"
        placeholder="Team Name"
        value={newTeamName}
        onChange={(e) => setNewTeamName(e.target.value)}
      />
      <button onClick={handleAddTeamSubmit}>Create Team</button>
    </div>
  );
};

const MyTeams = () => {
  const [teams, setTeams] = useState([]);
  const [showAddTeamPopup, setShowAddTeamPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeams = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authentication token not found');
      return;
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        // No Content
        setTeams([]);
        setErrorMessage('Jugador sense equips creats');
      } else if (response.ok) {
        const data = await response.json();
        setTeams(data);
        setErrorMessage(null);
      } else {
        const errorResponse = await response.json();
        console.error('Failed to fetch teams:', errorResponse.message);
        setErrorMessage(errorResponse.message || 'An error occurred while fetching teams.');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setErrorMessage('No existeixen equips del jugador.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddTeamPopup = () => {
    setShowAddTeamPopup(true);
  };

  const handleCloseAddTeamPopup = () => {
    setShowAddTeamPopup(false);
    setErrorMessage(null);
  };

  const handleTeamAdded = (newTeam) => {
    setTeams([...teams, newTeam]);
    setShowAddTeamPopup(false);
  };

  const deleteTeam = async (nomequip) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authentication token not found');
      return;
    }

    try {
      const response = await fetch(`/api/teams/${nomequip}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTeams(teams.filter((team) => team.nomequip !== nomequip));
      } else {
        console.error('Failed to delete team:', response.statusText);
        setErrorMessage('Failed to delete team. Please try again later.');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      setErrorMessage('An error occurred while deleting the team.');
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Layout>
        <h1>Your Teams</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : teams.length === 0 ? (
          <p>No teams found. Create your first team!</p>
        ) : (
          teams.map((team) => (
            <TeamItem key={team.nomequip} team={team} onDelete={() => deleteTeam(team.nomequip)} />
          ))
        )}
        {showAddTeamPopup && (
          <AddTeam onTeamAdded={handleTeamAdded} />
        )}
        <CenteredButton onClick={handleOpenAddTeamPopup}>Add Team</CenteredButton>
      </Layout>
    </>
  );
};
export default MyTeams;