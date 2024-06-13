import Layout from "../components/Layout";
import TeamBuilder from "../components/TeamBuilder";
import { GlobalStyle } from "../components/utils/GlobalStyle";
import useSWR from 'swr';
import { Character } from "../components/utils/Character";
import { useEffect } from 'react';
import router from 'next/router';
import { useAuth } from '../components/context/authContext';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TeamsPage = () => {
    const { isLoggedIn } = useAuth();

    useEffect(() => {
      if (!isLoggedIn) {
        console.log('redirecting');
        router.push('/login');
      }
    }, [isLoggedIn, router]);
    

  const { data, error } = useSWR<Character[]>('/api/characters', fetcher);

  if (!isLoggedIn) {
    return <div>Redirigint...</div>;
  }

  if (error) return <div>Error al carregar</div>;
  if (!data) return <div>Carregant...</div>;

  return (
    <>
      <GlobalStyle/>
      <Layout>
        <TeamBuilder availableCharacters={data}></TeamBuilder>
      </Layout>
    </>
  );
};

export default TeamsPage;
