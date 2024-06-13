// pages/login.tsx
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';
import { useAuth } from '../components/context/authContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  CssBaseline,
  Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

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
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Paper elevation={6} style={{ padding: '20px', marginTop: '50px' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Iniciar Sessió
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="mail"
                  label="Correu electrònic"
                  name="mail"
                  autoComplete="mail"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contrasenya"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Iniciar Sessió
                </Button>
                <Box display="flex" justifyContent="center">
                  <Link href="#" variant="body2" onClick={() => router.push('/signup')}>
                    {"Encara no tens compte? Registra't"}
                  </Link>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Layout>
    </>
  );
};

export default LoginPage;
