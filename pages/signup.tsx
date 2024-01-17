// pages/signup.tsx
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        // Handle successful registration
        router.push('/login'); // Redirect to login page
      } else {
        // Handle errors, show messages to user
        console.error('Sign up error');
      }
    } catch (error) {
      console.error('Sign up error:', error);
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
                    onChange={(e) => setUsername(e.target.value)}
                />
                </div>
                <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </Layout>
    </>
  );
};

export default SignUpPage;
