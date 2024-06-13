import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import CharacterList from '../components/CharacterList';
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';
import { useAuth } from '../components/context/authContext';
import { Personatgeinvocat } from '../backend/models/models';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const fetcher = (url: string) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json());
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
  color: #666;
`;

export default function Characters() {
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [characterCount, setCharacterCount] = useState<number | null>(null);
  const [textVisible, setTextVisible] = useState(false);

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
    return <div>Error: {charactersError}</div>;
  }

  if (countError) {
    return <div>Error fetching character count: {countError}</div>;
  }

  if (!characters) {
    return <div>No hi ha personatges disponibles</div>;
  }

  const handleInvokeCharacter = () => {
    console.log('Invoking character...');
    setTextVisible(true);
  };

  return (
    <>
      <GlobalStyle />
      <Layout>
        <h1>Personatges</h1>
        <p>Número de personatges invocats: {characterCount}</p>
        <CenteredButton onClick={handleInvokeCharacter}>Invoca Personatge</CenteredButton>
        <HiddenText visible={textVisible}>El personatge ha estat invocat!</HiddenText>
        <CharacterList characters={characters} />
      </Layout>
    </>
  );
}
