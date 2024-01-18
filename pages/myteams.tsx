import React, { useState, useEffect } from 'react';
import TeamItem from '../components/TeamItem'; // Component for individual team
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';

const MyTeams = () => {
  const [teams, setTeams] = useState([]);

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
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setTeams(data); 
      } else {
        console.error('Failed to fetch teams:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };
  

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <>
        <GlobalStyle />
        <Layout>
            <h1>Your Teams</h1>
            {teams.map(team => (
                <TeamItem key={team._id} team={team} onDelete={fetchTeams} />
            ))}
        </Layout>
    </>
  );
};

export default MyTeams;
