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

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px; /* Reducimos el margen inferior */
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  margin-left: 8px; /* Añadimos un pequeño margen a la izquierda del botón */

  &:hover {
    background-color: #005bb5;
  }
`;

const CharacterName = styled.span`
  flex-grow: 1;
  margin-right: 8px; /* Reducimos el margen derecho */
`;

const TeamName = styled.h3`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
  margin-bottom: 8px;
`;

const Container = styled.div`
  padding: 16px;
  background-color: #000;
  color: #fff;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
`;

const ErrorMessage = styled.p`
  color: red;
`;

const TeamItem = ({ team, onDelete, onAddCharacter, invokedCharacters, onRemoveCharacter }) => {
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [addedCharacters, setAddedCharacters] = useState(team.characters || []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, router]);

  const handleAddCharacter = async (character) => {
    const existingCharacter = addedCharacters.find(char => char.nom === character.nom);
    if (existingCharacter) {
      setErrorMessage('Character already in the team.');
      return;
    }

    try {
      const addedCharacter = await onAddCharacter(team.nomequip, character.nom);
      setAddedCharacters([...addedCharacters, addedCharacter]);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRemoveCharacter = async (character) => {
    try {
      await onRemoveCharacter(team.nomequip, character.nom);
      setAddedCharacters(addedCharacters.filter(char => char.nom !== character.nom));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Container>
      <TeamName>{team.nomequip}</TeamName>
      <button onClick={onDelete}>Delete</button>
      {addedCharacters.length > 0 && (
        <div>
          <SectionTitle>Characters in Team</SectionTitle>
          <ul>
            {addedCharacters.map((character) => (
              <ListItem key={character.nom}>
                <CharacterName>{character.nom}</CharacterName>
                <ActionButton onClick={() => handleRemoveCharacter(character)}>Remove</ActionButton>
              </ListItem>
            ))}
          </ul>
        </div>
      )}
      <SectionTitle>Invoked Characters</SectionTitle>
      <ul>
        {invokedCharacters.map((character) => (
          <ListItem key={character.nom}>
            <CharacterName>{character.nom}</CharacterName>
            <ActionButton onClick={() => handleAddCharacter(character)}>Add to Team</ActionButton>
          </ListItem>
        ))}
      </ul>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Container>
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
  const [invokedCharacters, setInvokedCharacters] = useState([]);
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

  const fetchInvokedCharacters = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authentication token not found');
      return;
    }

    try {
      const response = await fetch('/api/invokedCharacters', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInvokedCharacters(data);
        setErrorMessage(null);
      } else {
        const errorResponse = await response.json();
        console.error('Failed to fetch invoked characters:', errorResponse.message);
        setErrorMessage(errorResponse.message || 'An error occurred while fetching invoked characters.');
      }
    } catch (error) {
      console.error('Error fetching invoked characters:', error);
      setErrorMessage('No existen personajes invocados.');
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

  const addCharacterToTeam = async (nomequip, nom) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(`/api/teams/${nomequip}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nomequip, nom }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        if (response.status === 403 || response.status === 500) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to add character to team. Please try again later.');
      }
    } catch (error) {
      throw new Error('Error adding character to team.');
    }
  };

  const removeCharacterFromTeam = async (nomequip, nom) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(`/api/teams/${nomequip}/character`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom }),
      });

      if (response.ok) {
        return;
      } else {
        if (response.status === 403 || response.status === 500) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to remove character from team. Please try again later.');
      }
    } catch (error) {
      throw new Error('Error removing character from team.');
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchInvokedCharacters();
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
            <TeamItem 
              key={team.nomequip} 
              team={team} 
              onDelete={() => deleteTeam(team.nomequip)} 
              onAddCharacter={addCharacterToTeam} 
              invokedCharacters={invokedCharacters}
              onRemoveCharacter={removeCharacterFromTeam}
            />
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
