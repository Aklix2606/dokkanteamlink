// Characters.tsx
import React, { useState } from 'react';
import useSWR from 'swr';
import { Character } from '../components/utils/Character';
import CharacterList from '../components/CharacterList';
import CharacterDisplay from '../components/CharacterDisplay';
import Layout from "../components/Layout";
import { GlobalStyle } from "../components/utils/GlobalStyle";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Characters() {
    const { data, error } = useSWR<Character[]>('/api/characters', fetcher);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    const handleSelectCharacter = (character: Character) => {
        setSelectedCharacter(character);
    };

    const handleBackToList = () => {
        setSelectedCharacter(null);
    };

    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;

    return (
        <>
            <GlobalStyle/>
            <Layout>
                <h1>Characters</h1>
                {selectedCharacter ? (
                    <>
                        <button onClick={handleBackToList}>Back to List</button>
                        <CharacterDisplay character={selectedCharacter} />
                    </>
                ) : (
                    <CharacterList characters={data} onSelectCharacter={handleSelectCharacter} />
                )}
            </Layout>
        </>
    );
}
