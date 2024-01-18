import React, { useState } from 'react';
import Image from 'next/image';
import { Character } from '../components/utils/Character';
import ComboBox from './AutoComplete';

type CharacterListProps = {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
};

const CharacterList: React.FC<CharacterListProps> = ({ characters, onSelectCharacter }) => {  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category || '');
  };

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === '' || character.categories.includes(selectedCategory))
  );

  return (
    <div>
      <input 
        type="text"
        placeholder="Search characters..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '200px' }}
      />
      <ComboBox onCategorySelect={handleCategorySelect}/>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gridGap: '50px',
        maxWidth: '1000px', 
        margin: 'auto',
      }}>
        {filteredCharacters.length > 0 ? (
          filteredCharacters.map((character) => (
            <button 
              key={character._id}
              onClick={() => onSelectCharacter(character)}
              style={{ 
                position: 'relative', 
                width: '100%', 
                height: '250px',
                backgroundColor: 'transparent', 
                border: 'none', 
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <Image
                src={character.imageURL}
                alt={character.name}
                width={200}
                height={200}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'DarkGoldenRod', color: 'white', padding: '5px' }}>
                {character.name}
              </div>
            </button>
          ))
        ) : (
          <p>No characters found</p>
        )}
      </div>
    </div>
  );
};

export default CharacterList;
