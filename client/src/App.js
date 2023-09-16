import React, { useState } from 'react';
import { Routes, Route, Link } from "react-router-dom"
import Generator from './components/Generator';
import Instruction from './components/Instruction';
import Donate from './components/Donate';
import Consent from './components/Consent';
import { CssBaseline, AppBar, Grid, Container, Typography, Toolbar, IconButton, Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { HelpOutline, VolunteerActivism, Menu as MenuIcon } from '@mui/icons-material';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#e8f5e9',
      paper: '#f7f7f7',
    },
  },
});

function App() {
  const [showInstruction, setShowInstruction] = useState(false);
  const [preferenceConsent, setPreferenceConsent] = useState(false);
  const [statisticsConsent, setStatisticsConsent] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleInstruction = () => {
    setShowInstruction(!showInstruction)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position='static' color="primary" ><Toolbar  sx={{ padding: '15px' }} >
        {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={()=>setIsMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton> */}
        <Typography variant="h4" component="div"  sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            InterestLearn
          </Link>
        </Typography>
        <IconButton
          size="large"
          color="inherit"
          aria-label="Help"
          onClick={toggleInstruction}
          sx={{ cursor: 'pointer' }}
        >
          <HelpOutline sx={{ fontSize: '32px' }} />
        </IconButton>
        <IconButton
          component={Link}
          to="/donate"
          size="large"
          color="inherit"
          aria-label="Donate"
          >
            <VolunteerActivism sx={{ fontSize: '32px' }} />
          </IconButton>
      </Toolbar></AppBar>

      <Drawer
      anchor="left"
      open={isMenuOpen}
      onClose={() => setIsMenuOpen(false)}>
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={() => setIsMenuOpen(false)}
        onKeyDown={() => setIsMenuOpen(false)}
      >
        <List>
            <ListItem key="imprint" disablePadding>
              <ListItemButton>
                <ListItemIcon>
                <HelpOutline />
                </ListItemIcon>
                <ListItemText primary="Imprint" />
              </ListItemButton>
            </ListItem>
        </List>
        <Divider />
      </Box>
    </Drawer>

      <Consent preferenceConsent={preferenceConsent}
      setPreferenceConsent={setPreferenceConsent}
      statisticsConsent={statisticsConsent}
      setStatisticsConsent={setStatisticsConsent} />
      <Container>
        <Grid container spacing={2}>
          {showInstruction && <Grid item xs={12}><Instruction /></Grid>}
          <Grid item xs={12} sx={{flex: 1}}>
            <Routes>
              <Route path="/" element={<Generator preferenceConsent={preferenceConsent} statisticsConsent={statisticsConsent} />} />
              <Route path="/donate" element={<Donate />} />
            </Routes>
              
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
