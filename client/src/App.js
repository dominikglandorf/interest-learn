import React, { useState } from 'react';
import { Route, Routes, Link } from "react-router-dom"
import Generator from './components/Generator';
import Instruction from './components/Instruction';
import Donate from './components/Donate';
import { CssBaseline, AppBar, Grid, Container, Typography, Toolbar, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { HelpOutline, VolunteerActivism } from '@mui/icons-material';


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

  const toggleInstruction = () => {
    setShowInstruction(!showInstruction)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position='static' color="primary" ><Toolbar  sx={{ padding: '15px' }} >
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
      <Container>
      <Grid container spacing={2}>
        {showInstruction && <Grid item xs={12}><Instruction /></Grid>}
        <Grid item xs={12}>
          <Routes>
            <Route path="/" element={<Generator />} />
            <Route path="/donate" element={<Donate />} />
          </Routes>
        </Grid>
      </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
