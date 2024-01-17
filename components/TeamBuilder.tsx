import React, { useState } from 'react';
import { Character } from '../components/utils/Character';
import CharacterList from '../components/CharacterList';
import Image from 'next/image';

type TeamBuilderProps = {
  availableCharacters: Character[];
};

const TeamBuilder: React.FC<TeamBuilderProps> = ({ availableCharacters }) => {
  const [team, setTeam] = useState<Character[]>([]);
  

  const addToTeam = (character: Character) => {
    if (team.length < 6 && !team.includes(character)) {
      setTeam(prev => [...prev, character]);
    }
  };

  const removeFromTeam = (character: Character) => {
    setTeam(prev => prev.filter(member => member !== character));
  };

  return (
    <div>
        <h2>Your Team (Max 6 Characters)</h2>
        <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gridGap: '50px',
            maxWidth: '1350px', 
            margin: 'auto', }}>
            {team.map(member => (
                <div key={member._id} style={{ position: 'relative' }}>
                    <button onClick={() => removeFromTeam(member)} style={{ backgroundColor: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
                        <Image
                            src={member.imageURL}
                            alt={member.name}
                            width={200}
                            height={200}
                        />
                    </button>
                    <div style={{ width: 200,position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'DarkGoldenRod', color: 'white', textAlign: 'center' }}>
                        {member.name}
                    </div>
                </div>
            ))}
        </div>

        <h2>Select Characters for Your Team</h2>
        <div>
            <CharacterList characters={availableCharacters} onSelectCharacter={addToTeam}/>
        </div>
    </div>
  );
};

export default TeamBuilder;
