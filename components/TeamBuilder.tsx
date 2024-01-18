import React, { useState } from 'react';
import { Character } from '../components/utils/Character';
import CharacterList from '../components/CharacterList';
import Image from 'next/image';

type TeamBuilderProps = {
  availableCharacters: Character[];
};

const TeamBuilder: React.FC<TeamBuilderProps> = ({ availableCharacters }) => {
  const [team, setTeam] = useState<Character[]>([]);
  const [teamName, setTeamName] = useState('');

  const handleTeamNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setTeamName(event.target.value);
  };

  const addToTeam = (character: Character) => {
    if (team.length < 6 && !team.includes(character)) {
      setTeam(prev => [...prev, character]);
    }
  };

  const removeFromTeam = (character: Character) => {
    setTeam(prev => prev.filter(member => member !== character));
  };

  const fetchUserId = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authentication token not found');
      return null;
    }
  
    const response = await fetch('/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
  
    if (response.ok) {
      const userData = await response.json();
      return userData._id; 
    } else {
      console.error('Failed to fetch user data');
      return null;
    }
  };

  const handleSaveTeam = async () => {
    const userId = await fetchUserId(); 
    if (!userId) return;
  
    const teamMembers = team.map(character => character._id);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authentication token not found');
      return;
    }
  
    try {
      const response = await fetch(`/api/users/${userId}/teams`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: teamName, members: teamMembers }),
      });
  
      if (response.ok) {
        alert('Team updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to update team:', errorData.error);
      }
    } catch (error) {
      console.error('Error updating team:', error);
    }
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
        <input
          type="text"
          value={teamName}
          onChange={handleTeamNameChange}
          placeholder="Enter team name"
          style={{ marginBottom: '10px' }}
        />
        <button onClick={handleSaveTeam}>Save Team</button>     
        <h2>Select Characters for Your Team</h2>
        <div>
            <CharacterList characters={availableCharacters} onSelectCharacter={addToTeam}/>
        </div>
    </div>
  );
};

export default TeamBuilder;
