// pages/profile.tsx
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAuth } from '../components/context/authContext';

const ProfilePage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const router = useRouter();

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Les contransenyes  no coincideixen');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cambiarContrasenya', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al canviar la contrasenya');
      }

      setError(null);
      alert('Contrasenya canviada correctament');
      window.location.reload();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error al canviar la contrasenya:', error);
      setError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jugadors', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el compte');
      }

      alert('Compte eliminat');
      logout();
      router.push('/login'); // Redirige a la página de inicio de sesión
    } catch (error) {
      console.error('Error al eliminar el compte:', error);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <GlobalStyle />
      <Layout>
        <Container maxWidth="sm">
          <Box mt={4}>
            <Typography variant="h4" gutterBottom>
              Perfil
            </Typography>
            <Box component="form" onSubmit={handlePasswordChange} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Canviar Contrasenya
              </Typography>
              {error && <Typography color="error">{error}</Typography>}
              <TextField
                label="Contrasenya Actual"
                type="password"
                fullWidth
                variant="filled"
                margin="normal"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputLabelProps={{
                  style: { color: '#007BFF' },
                }}
                InputProps={{
                  style: { color: '#000', backgroundColor: '#FFF' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FFF',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFF',
                    },
                  },
                }}
              />
              <TextField
                label="Nova Contrasenya"
                type="password"
                fullWidth
                variant="filled"
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputLabelProps={{
                  style: { color: '#007BFF' },
                }}
                InputProps={{
                  style: { color: '#000', backgroundColor: '#FFF' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FFF',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFF',
                    },
                  },
                }}
              />
              <TextField
                label="Confirmar Nova Contrasenya"
                type="password"
                fullWidth
                variant="filled"
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputLabelProps={{
                  style: { color: '#007BFF' },
                }}
                InputProps={{
                  style: { color: '#000', backgroundColor: '#FFF' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FFF',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFF',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Cambiar Contrasenya
              </Button>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleLogout}
              >
                Tancar Sessió
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 4 }}
                onClick={handleDeleteAccount}
              >
                Eliminar Compte
              </Button>
            </Box>
          </Box>
        </Container>
      </Layout>
    </>
  );
};

export default ProfilePage;
