import React from 'react';
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';

export default function Home() {
  return (
    <>
      <GlobalStyle/>
      <Layout>
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#fff' }}>
          <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#fff' }}>Benvingut al Nostre Dinàmic Creador d'Equips!</h1>

          <h2 style={{ fontSize: '2em', fontWeight: 'bold', color: '#fff' }}>🌟 Descobreix una Nova Manera de Crear i Gestionar els Teus Equips!</h2>
          <p style={{ fontSize: '1.2em', color: '#fff' }}>Benvingut a un món on construir i gestionar els teus equips no només és fàcil, sinó també divertit! La nostra innovadora plataforma està dissenyada per portar la teva experiència de creació d'equips al següent nivell. Tant si ets un aficionat a muntar equips de fantasía com si simplement busques una manera eficient d'organitzar grups, tenim tot el que necessites.</p>
          
          <h3 style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#fff' }}>🔥 Característiques Clau:</h3>
          <ul style={{ fontSize: '1.2em', color: '#fff' }}>
            <li><strong>Crea els Teus Equips</strong>: Construeix els teus equips únics seleccionant d'una àmplia gamma de personatges.</li>
            <li><strong>Gestiona amb Facilitat</strong>: Actualitza els teus equips segons ho consideris oportú.</li>
            <li><strong>Visualitza el Teu Equip</strong>: Veu com el teu equip cobra vida!</li>
            <li><strong>Segur i Personalitzat</strong>: Els teus equips són només teus.</li>
            <li><strong>Comunitat i Compartició</strong>: Participa en una comunitat de creadors d'equips.</li>
          </ul>

          <h3 style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#fff' }}>🌐 Experiència Sense Interrupcions a Tots els Dispositius</h3>
          <p style={{ fontSize: '1.2em', color: '#fff' }}>La nostra plataforma està dissenyada per a l'accessibilitat i facilitat d'ús en diversos dispositius.</p>

          <h3 style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#fff' }}>🚀 Comença Ara</h3>
          <p style={{ fontSize: '1.2em', color: '#fff' }}>Endinsa't en l'experiència de construir equips de manera senzilla. Registra't avui mateix i comença a crear equips que reflecteixin el teu estil i estratègia.</p>
        </div>
      </Layout>
    </>
  );
}
