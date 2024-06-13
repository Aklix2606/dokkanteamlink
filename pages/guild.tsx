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

const SearchInput = styled.input`
  margin: 10px 0;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
`;

export default function Guild() {
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [guildMembers, setGuildMembers] = useState<Jugador[] | null>(null);
  const [guildName, setGuildName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [guildNameError, setGuildNameError] = useState<string | null>(null);
  const [allGuilds, setAllGuilds] = useState<{ nom_gremi: string }[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const { data: members, error: membersError } = useSWR<Jugador[]>('/api/gremi/membres', fetcher);
  const { data: guilds, error: guildsError } = useSWR<{ nom_gremi: string }[]>('/api/gremi/tots', fetcher);

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

  useEffect(() => {
    if (guildsError) {
      setError(guildsError.message);
      setAllGuilds(null);
    } else if (guilds) {
      setError(null);
      setAllGuilds(guilds);
    }
  }, [guilds, guildsError]);

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
      mutate('/api/gremi/tots');
    } catch (error) {
      console.error('Error creating guild:', error);
      setGuildNameError(error.message);
    }
  };

  const handleJoinGuild = async (guildName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/gremi/unir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nom_gremi: guildName })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join guild');
      }

      mutate('/api/gremi/membres');
      mutate('/api/gremi/tots');
    } catch (error) {
      console.error('Error joining guild:', error);
      setError(error.message);
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
      mutate('/api/gremi/tots');
    } catch (error) {
      console.error('Error leaving guild:', error);
      setError(error.message);
    }
  };

  const filteredGuilds = allGuilds?.filter(guild =>
    guild.nom_gremi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Carregant...</div>;
  }

  return (
    <>
      <GlobalStyle />
      <Layout>
        <h1>Gremi</h1>
        {!guildMembers ? (
          <>
            <div>
              <input
                type="text"
                value={guildName}
                onChange={(e) => setGuildName(e.target.value)}
                placeholder="Nom del Gremi"
              />
              <CenteredButton onClick={handleCreateGuild}>Crear Gremi</CenteredButton>
              {guildNameError && <ErrorMessage>{guildNameError}</ErrorMessage>}
            </div>
            <h2>Llista de gremis</h2>
            <SearchInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar gremi"
            />
            {filteredGuilds && (
              <ul>
                {filteredGuilds.map((guild, index) => (
                  <li key={index}>
                    {guild.nom_gremi}
                    <CenteredButton onClick={() => handleJoinGuild(guild.nom_gremi)}>Unir-se</CenteredButton>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <div>
            <h2>Membres del Gremi - {guildMembers[0].nom_gremi}</h2>
            <ul>
              {guildMembers.map((member, index) => (
                <li key={index}>{member.correu}</li>
              ))}
            </ul>
            <CenteredButton onClick={handleLeaveGuild}>Deixar el Gremi</CenteredButton>
          </div>
        )}
      </Layout>
    </>
  );
}
