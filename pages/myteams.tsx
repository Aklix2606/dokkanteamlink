import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';
import { useAuth } from '../components/context/authContext';
import { useRouter } from 'next/router';

const CenteredButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
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
  margin-bottom: 4px;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  font-size: 22px;
  cursor: pointer;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  margin-left: 8px;

  &:hover {
    background-color: #005bb5;
  }
`;

const CharacterName = styled.span`
  flex-grow: 1;
  margin-right: 24px;
  font-size: 1.2em; 
`;

const TeamName = styled.h3`
  margin-bottom: 44px;
  font-size: 1.6em; 
`;

const SectionTitle = styled.h4`
  margin-bottom: 8px;
  font-size: 1.5em; 
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

const PaginationButton = styled.button`
  margin: 5px;
  padding: 10px;
  font-size: 35px;
  cursor: pointer;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const TeamItem = ({ team, onDelete, onAddCharacter, invokedCharacters, onRemoveCharacter, onUpdateTeamName, invokedPage, setInvokedPage }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [addedCharacters, setAddedCharacters] = useState(team.characters || []);
  const [newTeamName, setNewTeamName] = useState(team.nomequip);
  const charactersPerPage = 4;

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

  const handleUpdateTeamName = async () => {
    if (newTeamName === team.nomequip) {
      setErrorMessage('Es el mateix nom !!');
      return;
    }

    try {
      await onUpdateTeamName(team.nomequip, newTeamName);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const indexOfLastCharacter = invokedPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = invokedCharacters.slice(indexOfFirstCharacter, indexOfLastCharacter);
  const totalCharacterPages = Math.ceil(invokedCharacters.length / charactersPerPage);

  return (
    <Container>
      <TeamName>{team.nomequip}</TeamName>
      <input
        type="text"
        value={newTeamName}
        onChange={(e) => setNewTeamName(e.target.value)}
        style={{
          fontSize: '1.5em', 
          padding: '10px', 
          width: '100%', 
          boxSizing: 'border-box' 
        }}
      />
      <CenteredButton onClick={handleUpdateTeamName}>Actualitzar Nom</CenteredButton>
      <button onClick={onDelete}>Esborrar</button>
      {addedCharacters.length > 0 && (
        <div>
          <SectionTitle>Personatges que formen part de l'equip</SectionTitle>
          <ul>
            {addedCharacters.map((character) => (
              <ListItem key={character.nom}>
                <CharacterName>{character.nom}</CharacterName>
                <ActionButton onClick={() => handleRemoveCharacter(character)}>Treure</ActionButton>
              </ListItem>
            ))}
          </ul>
        </div>
      )}
      <SectionTitle>Personatges Invocats</SectionTitle>
      <ul>
        {currentCharacters.map((character) => (
          <ListItem key={character.nom}>
            <CharacterName>{character.nom}</CharacterName>
            <ActionButton onClick={() => handleAddCharacter(character)}>Afegir a l'equip</ActionButton>
          </ListItem>
        ))}
      </ul>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <div>
        <PaginationButton
          onClick={() => setInvokedPage(invokedPage - 1)}
          disabled={invokedPage === 1}
        >
          Anterior
        </PaginationButton>
        <PaginationButton
          onClick={() => setInvokedPage(invokedPage + 1)}
          disabled={invokedPage === totalCharacterPages}
        >
          Següent
        </PaginationButton>
      </div>
    </Container>
  );
};

const AddTeam = ({ onTeamAdded }) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleAddTeamSubmit = async () => {
    if (!newTeamName) {
      setErrorMessage('Siusplau poseu un nom.');
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
    <div>
      <h2>Afegir Equip</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input
        type="text"
        placeholder="Nom de l'equip"
        value={newTeamName}
        onChange={(e) => setNewTeamName(e.target.value)}
        style={{
          fontSize: '1em',
          padding: '10px',
          width: '25%',
          boxSizing: 'border-box',
          margin: '10px 0'
        }}
      />
      <CenteredButton onClick={handleAddTeamSubmit}>Crear Equip</CenteredButton>
    </div>
  );
};

const MyTeams = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [invokedCharacters, setInvokedCharacters] = useState([]);
  const [showAddTeamPopup, setShowAddTeamPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [invokedPage, setInvokedPage] = useState(1);
  const teamsPerPage = 1;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      fetchTeams();
      fetchInvokedCharacters();
    }
  }, [isLoggedIn, router]);

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
    setCurrentPage(teams.length + 1);
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
        setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
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

  const updateTeamName = async (nomequip, newNomequip) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(`/api/teams/${nomequip}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newNomequip }),
      });

      if (response.ok) {
        const data = await response.json();
        setTeams(teams.map(team => (team.nomequip === nomequip ? data : team)));
        setErrorMessage(null);
      } else {
        if (response.status === 403 || response.status === 500) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to update team name. Please try again later.');
      }
    } catch (error) {
      throw new Error('Error updating team name.');
    }
  };

  const currentTeam = teams[currentPage - 1];
  const totalPages = teams.length;

  return (
    <>
      <GlobalStyle />
      <Layout>
        <h1>Els teus equips</h1>
        <CenteredButton onClick={handleOpenAddTeamPopup}>Afegir equip</CenteredButton>
        {showAddTeamPopup && (
          <AddTeam onTeamAdded={handleTeamAdded} />
        )}
        {isLoading ? (
          <p>Carregant...</p>
        ) : errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : teams.length === 0 ? (
          <p>No s'ha trobat cap equip. Crea el teu primer equip per veure'l!</p>
        ) : (
          <>
            {currentTeam && (
              <TeamItem 
                key={currentTeam.nomequip} 
                team={currentTeam} 
                onDelete={() => deleteTeam(currentTeam.nomequip)} 
                onAddCharacter={addCharacterToTeam} 
                invokedCharacters={invokedCharacters}
                onRemoveCharacter={removeCharacterFromTeam}
                onUpdateTeamName={updateTeamName}
                invokedPage={invokedPage}
                setInvokedPage={setInvokedPage}
              />
            )}
            <div>
              <PaginationButton
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </PaginationButton>
              <PaginationButton
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Següent
              </PaginationButton>
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default MyTeams;
