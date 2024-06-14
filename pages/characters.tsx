import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import CharacterList from '../components/CharacterList';
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';
import { useAuth } from '../components/context/authContext';
import { Personatgeinvocat } from '../backend/models/models';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    // Token no válido o no proporcionado
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  
  return response.json();
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

interface HiddenTextProps {
  visible: boolean;
}

const HiddenText = styled.div<HiddenTextProps>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
  color: green;
`;

export default function Characters() {
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [characterCount, setCharacterCount] = useState<number | null>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [invokedCharacter, setInvokedCharacter] = useState<string | null>(null);

  const { data: characters, error: charactersError } = useSWR<Personatgeinvocat[]>('/api/personatgesinvocats', fetcher);
  const { data: countData, error: countError } = useSWR('/api/personatgesinvocats/count', fetcher);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (countData) {
      setCharacterCount(countData.count);
    }
  }, [countData]);

  if (isLoading) {
    return <div>Carregant...</div>;
  }

  if (charactersError) {
    return <div>Error: {charactersError.message}</div>;
  }

  if (countError) {
    return <div>Error aconseguint el nombre de personatges: {countError.message}</div>;
  }

  // Verificación adicional de los datos recibidos
  if (!Array.isArray(characters)) {
    return <div>Error: Dades de personatges invalides</div>;
  }

  const handleInvokeCharacter = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/personatge/invoca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to invoke character');
      }

      const data = await response.json();
      setInvokedCharacter(data.character);
      setTextVisible(true);

      // Refrescar la lista de personajes invocados y el conteo
      mutate('/api/personatgesinvocats');
      mutate('/api/personatgesinvocats/count');
    } catch (error) {
      console.error('Error invoking character:', error);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Layout>
        <h1>Personatges</h1>
        <p>Número de personatges invocats: {characterCount}</p>
        <CenteredButton onClick={handleInvokeCharacter}>Invoca Personatge</CenteredButton>
        <HiddenText visible={textVisible}>
          {invokedCharacter ? `El personatge invocat és: ${invokedCharacter}` : ''}
        </HiddenText>
        <CharacterList characters={characters} />
      </Layout>
    </>
  );
}
