import React from 'react';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import Button from '@mui/material/Button'; 
import { useAuth } from './context/authContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const routes = [
    { label: 'Home', path: '/' },
    { label: 'Characters', path: '/characters' },
    { label: 'TeamBuilder', path: '/teams' },
    { label: 'MyTeams', path: '/myteams'}
  ];

  const activeTab = routes.findIndex(route => route.path === router.pathname);
  const { isLoggedIn, logout } = useAuth();
  
  return (
    <div> 
      <AppBar position="static" style={{ backgroundColor: '#1A1A1A' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tabs aria-label="Navigation Tabs" value={activeTab === -1 ? false : activeTab}>
            {routes.map((route, index) => (
              <Tab style={{ color: '#FDB750' }} label={route.label} component={Link} href={route.path} key={index} />
            ))}
          </Tabs>
          {isLoggedIn ? (
          <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <Button color="inherit" onClick={() => router.push('/login')}>Login</Button>
          )}
          </Toolbar>
      </AppBar>
      {children}
    </div>
  );
};

export default Layout;
