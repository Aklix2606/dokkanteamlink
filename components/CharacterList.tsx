
import React from 'react';
import { Character } from '../components/utils/Character';

type CharacterListProps = {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
};

const CharacterList: React.FC<CharacterListProps> = ({ characters, onSelectCharacter }) => {
    return (
      <div>
        {characters.map((character) => (
          <button 
            key={character._id}  
            onClick={() => onSelectCharacter(character)}
            style={{ display: 'block', margin: '5px' }}
          >
            {character.name}
          </button>
        ))}
      </div>
    );
};

export default CharacterList;
