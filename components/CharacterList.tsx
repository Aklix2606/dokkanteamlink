import React, { useState } from 'react';
import { Personatge } from '../backend/models/models';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/system';

const StyledButton = styled(Button)({
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    padding: '10px',
    width: '100%',
    textAlign: 'left',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
});

const CharacterStatsContainer = styled('div')({
    color: '#000', // Cambiar el color del texto a negro
});

type CharacterListProps = {
    characters: Personatge[];
};

const CharacterList: React.FC<CharacterListProps> = ({ characters }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState<Personatge | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [characterStats, setCharacterStats] = useState<any | null>(null);

    const handleCharacterClick = async (character: Personatge) => {
        setSelectedCharacter(character);
        setIsLoadingStats(true);
        try {
            const response = await fetch(`/api/personatge/stats/${character.nom}`);
            const data = await response.json();
            setCharacterStats(data);
            setIsLoadingStats(false);
        } catch (error) {
            setIsLoadingStats(false);
            console.error('Error fetching character stats:', error);
        }
    };

    const handleCloseModal = () => {
        setSelectedCharacter(null);
        setCharacterStats(null);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: '10px', padding: '5px', width: '200px' }}
            />
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gridGap: '20px',
            }}>
                {characters.map((character) => (
                    <StyledButton key={character.nom} onClick={() => handleCharacterClick(character)}>
                        {character.nom}
                    </StyledButton>
                ))}
            </div>
            <Modal open={selectedCharacter !== null} onClose={handleCloseModal}>
                <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '5px', maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
                    {selectedCharacter && (
                        <>
                            {isLoadingStats ? (
                                <p>Loading character stats...</p>
                            ) : (
                                <>
                                    {characterStats && (
                                        <CharacterStatsContainer>
                                            <h2>{selectedCharacter.nom}</h2>
                                            <p>Tipus: {characterStats.tipus}</p>
                                            <p>Vida: {characterStats.vida}</p>
                                            <p>Atac: {characterStats.atac}</p>
                                            <p>Defensa: {characterStats.defensa}</p>
                                        </CharacterStatsContainer>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    <Button onClick={handleCloseModal}>Close</Button>
                </div>
            </Modal>
        </div>
    );
};

export default CharacterList;
