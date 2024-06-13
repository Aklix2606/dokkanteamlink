// pages/signup.tsx
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';
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

const SignUpPage: React.FC = () => {
  const [correu, setCorreu] = useState<string>('');
  const [contrasenya, setContrasenya] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correu, contrasenya, nom_gremi: null }),
      });
  
      if (response.ok) {
        router.push('/login');
      } else {
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
                Registre
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="correu"
                  label="Correu electrònic"
                  name="correu"
                  autoComplete="email"
                  autoFocus
                  value={correu}
                  onChange={(e) => setCorreu(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="contrasenya"
                  label="Contrasenya"
                  type="password"
                  id="contrasenya"
                  autoComplete="current-password"
                  value={contrasenya}
                  onChange={(e) => setContrasenya(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Registrar-se
                </Button>
                <Box display="flex" justifyContent="center">
                  <Link href="#" variant="body2" onClick={() => router.push('/login')}>
                    {"Ja tens un compte? Inicia Sessió"}
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

export default SignUpPage;
