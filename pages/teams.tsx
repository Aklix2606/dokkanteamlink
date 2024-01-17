import Layout from "../components/Layout";
import TeamBuilder from "../components/TeamBuilder";
import { GlobalStyle } from "../components/utils/GlobalStyle";
import useSWR from 'swr';
import { Character } from "../components/utils/Character";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
    const { data, error } = useSWR<Character[]>('/api/characters', fetcher);

    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;
    return (
        <>
            <GlobalStyle/>
            <Layout>
                <TeamBuilder availableCharacters={data}></TeamBuilder>
            </Layout>
        </>
    )
}