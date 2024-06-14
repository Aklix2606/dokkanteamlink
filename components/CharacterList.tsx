import React, { useState } from 'react';
import { Personatge, Personatgeinvocat, Objecte } from '../backend/models/models';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/system';
import { mutate } from 'swr';

const StyledButton = styled(Button)({
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    padding: '10px',
    width: '100%',
    textAlign: 'left',
    textTransform: 'none',
    fontSize: '18px',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
});

const CharacterStatsContainer = styled('div')({
    color: '#000',
});

type CharacterListProps = {
    characters: Personatgeinvocat[];
};

const CharacterList: React.FC<CharacterListProps> = ({ characters }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState<Personatgeinvocat | null>(null);
    const [characterStats, setCharacterStats] = useState<Personatge | null>(null);
    const [availableObjects, setAvailableObjects] = useState<Objecte[]>([]);
    const [showObjectSelector, setShowObjectSelector] = useState(false);
    const [objecteData, setObjecteData] = useState<Objecte | null>(null);

    const token = localStorage.getItem('token');

    const handleCharacterClick = async (character: Personatgeinvocat) => {
        setSelectedCharacter(character);
        try {
            const encodedNom = encodeURIComponent(character.nom);
            const statsResponse = await fetch(`/api/personatge/stats/${encodedNom}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const statsData = await statsResponse.json();
            setCharacterStats(statsData);

            if (character.numobj) {
                const objecteResponse = await fetch(`/api/objecte/consulta/${character.numobj}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const objecteData = await objecteResponse.json();
                setObjecteData(objecteData);
            } else {
                setObjecteData(null);
            }
        } catch (error) {
            console.error('Error fetching character stats or object data:', error);
        }
    };

    const handleAddObject = async () => {
        setShowObjectSelector(true);
        try {
            const response = await fetch(`/api/objecte/disponible`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setAvailableObjects(data);
        } catch (error) {
            console.error('Error fetching available objects:', error);
        }
    };

    const handleAssignObject = async (numobj: number) => {
        if (selectedCharacter) {
            try {
                const response = await fetch(`/api/personatge/assigna`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ nom: selectedCharacter.nom, numobj })
                });

                if (response.ok) {
                    setSelectedCharacter({ ...selectedCharacter, numobj });
                    const objecteResponse = await fetch(`/api/objecte/consulta/${numobj}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const objecteData = await objecteResponse.json();
                    setObjecteData(objecteData);
                    setShowObjectSelector(false);
                } else {
                    console.error('Error assigning object:', response.statusText);
                }
            } catch (error) {
                console.error('Error assigning object:', error);
            }
        }
    };

    const handleDeleteCharacter = async () => {
        if (selectedCharacter) {
            try {
                const response = await fetch(`/api/personatgeinvocat/${selectedCharacter.nom}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setSelectedCharacter(null);
                    setCharacterStats(null);
                    setObjecteData(null);
                    // Refrescar la lista de personajes invocados y el conteo
                    mutate('/api/personatgesinvocats');
                    mutate('/api/personatgesinvocats/count');
                } else {
                    console.error('Error deleting character:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting character:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setSelectedCharacter(null);
        setCharacterStats(null);
        setObjecteData(null);
        setShowObjectSelector(false);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Buscar personatges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: '10px', padding: '5px', width: '200px' }}
            />
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gridGap: '20px',
            }}>
                {characters
                    .filter((character) => character.nom.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((character) => (
                        <StyledButton key={character.nom} onClick={() => handleCharacterClick(character)}>
                            {character.nom}
                        </StyledButton>
                    ))}
            </div>
            <Modal open={selectedCharacter !== null} onClose={handleCloseModal}>
                <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '5px', maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
                    {selectedCharacter && (
                        <>
                            <CharacterStatsContainer>
                                <h2>{selectedCharacter.nom}</h2>
                                {characterStats && (
                                    <>
                                        <h3>Estadístiques</h3>
                                        <p>Tipus: {characterStats.tipus}</p>
                                        <p>Vida: {characterStats.vida}</p>
                                        <p>Atac: {characterStats.atac}</p>
                                        <p>Defensa: {characterStats.defensa}</p>
                                        <h3>Objecte</h3>
                                        {objecteData ? (
                                            <>
                                                <p>Numobj: {objecteData.numobj}</p>
                                                <p>Tipusobj: {objecteData.tipusobj}</p>
                                            </>
                                        ) : (
                                            <p>No Objecte Asignat</p>
                                        )}
                                    </>
                                )}
                            </CharacterStatsContainer>
                            {!objecteData && (
                                <Button onClick={handleAddObject}>Afegir Objecte</Button>
                            )}
                            <Button onClick={handleDeleteCharacter} color="error">Eliminar Personatge</Button>
                        </>
                    )}
                    <Button onClick={handleCloseModal}>Tancar</Button>
                </div>
            </Modal>
            {showObjectSelector && (
                <Modal open={showObjectSelector} onClose={() => setShowObjectSelector(false)}>
                    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '5px', maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
                        <h3>Selecciona un Objecte</h3>
                        {availableObjects.length > 0 ? (
                            <ul>
                                <CharacterStatsContainer>
                                {availableObjects.map((obj) => (
                                    
                                        <li key={obj.numobj}>
                                            {obj.tipusobj} (ID: {obj.numobj})
                                            <Button onClick={() => handleAssignObject(obj.numobj)}>Assignar</Button>
                                        </li>
                                    
                                ))}
                                </CharacterStatsContainer>
                            </ul>
                        ) : (
                            <p>No hi ha objectes disponibles</p>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CharacterList;
