import React, { useState, useEffect } from 'react';
import apiRequest from '../backend/utils/apiUtils';
import Layout from '../components/Layout';
import {GlobalStyle} from '../components/utils/GlobalStyle';


export default function Home() {
  const [users, setUsers] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Fetch Users
    fetch('/api/user')
      .then(response => response.json())
      .then(data => setUsers(data));

    // Fetch Characters
    fetch('/api/characters')
      .then(response => response.json())
      .then(data => setCharacters(data));

    // Fetch Teams
    fetch('/api/teams')
      .then(response => response.json())
      .then(data => setTeams(data));
  }, []);


  const testApi = async (method: string, route: string, payload: Record<string, unknown> | null = null) => {
    try {
      const data = await apiRequest(method, route, payload);
      console.log(`${method} response:`, data);
    } catch (error) {
      console.error(`Error in ${method} request:`, error);
    }
  };

  return (
    <>
      <GlobalStyle/>
      <Layout>
          <h1>API Data</h1>
      </Layout>
    </>
  );
}
