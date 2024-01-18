// pages/login.tsx
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';
import { useAuth } from '../components/context/authContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        login(data.token); 
        router.push('/'); 
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  

  return (
    <>
        <GlobalStyle />
        <Layout>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
            <div>
                <p>Don't have an account?</p>
                <button onClick={() => router.push('/signup')}>Sign Up</button>
            </div>
      </Layout></>
  );
};

export default LoginPage;
