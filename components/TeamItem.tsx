import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const TeamItem = ({ team, onDelete }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const memberDetails = await Promise.all(team.members.map(async (characterId) => {
        const response = await fetch(`/api/characters/${characterId}`);
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to fetch character', characterId);
          return null;
        }
      }));

      setMembers(memberDetails.filter(member => member !== null));
    };

    fetchMembers();
  }, [team.members]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error('Authentication token not found');
      return;
    }

    try {
      const response = await fetch(`/api/teams/${team._id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        alert('Team deleted successfully!');
        onDelete();
      } else {
        const errorData = await response.json();
        console.error('Failed to delete team:', errorData.error);
      }
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  return (
    <div>
      <h3>{team.name}</h3>
      {members.map(member => (
        <div key={member._id}>
          <Image src={member.imageURL} alt={member.name} width={100} height={100} />
          <p>{member.name}</p>
        </div>
      ))}
      <button onClick={handleDelete}>Delete Team</button>
    </div>
  );
};

export default TeamItem;
