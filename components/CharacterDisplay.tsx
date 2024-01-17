import React from 'react';
import Image from 'next/image';

// Assuming you have a Character interface defined elsewhere
import { Character } from '../components/utils/Character';

interface CharacterDisplayProps {
    character: Character;
  }
  
  const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ character }) => {
      return (
        <div>
          <h2>{character.name}</h2>
          <div style={{ width: '200px', height: '200px', position: 'relative' }}>
            <Image
              src={character.imageURL}
              alt={character.name}
              layout='fill'
              objectFit='cover'
            />
          </div>
          <p>Title: {character.title}</p>
          <p>Rarity: {character.rarity}</p>
          <p>Class: {character.class}</p>
          <p>Type: {character.type}</p>
          <p>Cost: {character.cost}</p>
          <p>Leader Skill: {character.leaderSkill}</p>
          <p>Super Attack: {character.superAttack}</p>
          <p>Ultra Super Attack: {character.ultraSuperAttack}</p>
          <p>Passive: {character.passive}</p>
          <p>Links: {character.links.join(', ')}</p>
          <p>Categories: {character.categories.join(', ')}</p>
          <p>Ki Meter: {character.kiMeter.join(', ')}</p>
          <p>HP: {character.baseHP} - {character.rainbowHP}</p>
          <p>Attack: {character.baseAttack} - {character.rainbowAttack}</p>
          <p>Defence: {character.baseDefence} - {character.rainbowDefence}</p>
          <p>Ki Multiplier: {character.kiMultiplier}</p>
          <p>Transformations: {character.transformations.join(', ')}</p>
          {/* Add more fields as needed */}
        </div>
      );
  };
  
  export default CharacterDisplay;
