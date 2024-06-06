import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';
import { useAuth } from '../components/context/authContext';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Jugador } from '../backend/models/models';

const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const CenteredButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
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

const ErrorMessage = styled.div`
  color: red;
`;

export default function Guild() {
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [guildMembers, setGuildMembers] = useState<Jugador[] | null>(null);
  const [guildName, setGuildName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [guildNameerror, setGuildNameerror] = useState<string | null>(null);
  const router = useRouter();

  const { data: members, error: membersError } = useSWR<Jugador[]>('/api/gremi/membres', fetcher);
  
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (membersError) {
      setError(membersError.message);
      setGuildMembers(null);
    } else if (members) {
      setError(null);
      setGuildMembers(members);
    }
  }, [members, membersError]);

  const handleCreateGuild = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/gremi/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nom_gremi: guildName })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create guild');
      }

      const data = await response.json();
      setGuildMembers([data.message]);
      setGuildName('');

      
      mutate('/api/gremi/membres');
    } catch (error) {
      console.error('Error creating guild:', error);
      setGuildNameerror(error.message);
    }
  };

  const handleLeaveGuild = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/gremi/deixar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to leave guild');
      }

      
      mutate('/api/gremi/membres');
    } catch (error) {
      console.error('Error leaving guild:', error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GlobalStyle />
      <Layout>
        <h1>Gremio</h1>
        {!guildMembers && (
            <div>
            <input
              type="text"
              value={guildName}
              onChange={(e) => setGuildName(e.target.value)}
              placeholder="Nombre del Gremio"
            />
            <CenteredButton onClick={handleCreateGuild}>Crear Gremio</CenteredButton>
            {guildNameerror && <ErrorMessage>{guildNameerror}</ErrorMessage>}
          </div>
        )}
        {guildMembers && (
          <div>
            <h2>Membres del Gremi - {guildMembers[0].nom_gremi}</h2>
            <ul>
            {guildMembers.map((member, index) => (
                <li key={index}>{member.correu}</li>
            ))}
            </ul>
            <CenteredButton onClick={handleLeaveGuild}>Dejar Gremio</CenteredButton>
          </div>
        )}
      </Layout>
    </>
  );
}
