import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import CharacterList from '../components/CharacterList';
import Layout from "../components/Layout";
import { GlobalStyle } from "../components/utils/GlobalStyle";
import { useAuth } from '../components/context/authContext';
import { Personatge } from '../backend/models/models';
import { useRouter } from 'next/router';

const fetcher = (url: string) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json());
};

export default function Characters() {
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga
  const [characterCount, setCharacterCount] = useState<number | null>(null); // Estado para almacenar el conteo de personajes

  const { data: characters, error: charactersError } = useSWR<Personatge[]>('/api/personatgesinvocats', fetcher);
  const { data: countData, error: countError } = useSWR('/api/personatgesinvocats/count', fetcher);
  const router = useRouter();
  console.log(characters);

  // Verificar si el usuario está autenticado al cargar el componente
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setIsLoading(false); // Marcar que ya no estamos cargando
    }
  }, [isLoggedIn, router]);

  // Obtener el conteo de personajes invocados
  useEffect(() => {
    if (countData) {
      setCharacterCount(countData.count);
    }
  }, [countData]);

  // Mostrar componente de carga si aún estamos comprobando la autenticación
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Mostrar componente de error si hay un error al obtener los personajes
  if (charactersError) {
    return <div>Error: {charactersError}</div>;
  }

  // Mostrar componente de error si hay un error al obtener el conteo
  if (countError) {
    return <div>Error fetching character count: {countError}</div>;
  }

  // Si no hay datos disponibles, mostramos un mensaje
  if (!characters) {
    return <div>No characters available</div>;
  }

  return (
    <>
      <GlobalStyle/>
      <Layout>
        <h1>Personatges</h1>
        <p>Número de personatges invocats: {characterCount}</p>
        <CharacterList characters={characters} />
      </Layout>
    </>
  );
}
