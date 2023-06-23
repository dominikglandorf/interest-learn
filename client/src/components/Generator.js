import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import ProgressBar from './ProgressBar';
import FloatingTeacher from './FloatingTeacher';
import VocabTrainer from './VocabTrainer';
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Grid, Button, MenuItem, Paper, Typography } from '@mui/material';
import TandemPartner from './TandemPartner';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SearchComponent = () => {
  const [cookies, setCookie] = useCookies(['language', 'proficiency']);
  const [language, setLanguage] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [topic, setTopic] = useState('');
  const [topicGenerated, setTopicGenerated] = useState('');
  const [generatedText, setGeneratedText] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generatingMore, setGeneratingMore] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const teacherRef = useRef(null);
  const vocabRef = useRef(null);
  const tandemRef = useRef(null);

  useEffect(() => {
    if (language === "" & cookies.language !== "") {
      setLanguage(cookies.language);
    }
    if (proficiency === "" & cookies.proficiency !== "") {
      setProficiency(cookies.proficiency);
    }
    // setTopic("Jetlag")
    // setGeneratedText(`Le décalage horaire, communément appelé "jetlag", est l'un des effets secondaires les plus frustrants et difficiles à éviter des voyages internationaux. En règle générale, cela se produit lorsque notre rythme circadien est perturbé en raison d'un long vol à travers les fuseaux horaires. Les symptômes varient en fonction de la gravité, mais les plus courants sont la fatigue, les maux de tête, les nausées et même la dépression. Pour éviter les effets du décalage horaire, il est recommandé de se reposer avant de voyager, de bien s'hydrater tout au long du vol et d'ajuster son horloge corporelle en avançant ou en reculant progressivement ses heures de sommeil avant le voyage.`)
  }, [language, proficiency, cookies]);

  const handleLanguageChange = (event, newValue) => {
    setLanguage(newValue);
    setCookie('language', newValue, { path: '/interest-learn' });
  };

  const handleProficiencyChange = (event) => {
    setProficiency(event.target.value);
    setCookie('proficiency', event.target.value, { path: '/interest-learn' });
  };

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setGenerating(true);
    setTopicGenerated(topic);
    if (tandemRef.current) tandemRef.current.resetState();
    setChatStarted(false);
    fetch(`${backendUrl}/text?language=${language}&niveau=${proficiency}&topic=${topic}`)
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          console.log(response.text)
          setGenerating(false);
          setGeneratedText([response.text]);
          if (teacherRef.current) teacherRef.current.resetState();
        // if (vocabRef.current) vocabRef.current.resetState();
        } else {
          setGenerating(false);
        }
        
      })
      .catch((error) => {
        setGenerating(false);
        console.error('Error occurred during search:', error);
      });
      
  };

  const more = () => {
    setGeneratingMore(true);
    fetch(`${backendUrl}/continuation?text=${generatedText.join('\n\n')}`)
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          console.log(response.text)
          setGeneratingMore(false);
          setGeneratedText([...generatedText, response.text]);
          if (teacherRef.current) teacherRef.current.resetState();
        // if (vocabRef.current) vocabRef.current.resetState();
        } else {
          setGeneratingMore(false);
          console.log(response);
        }
      })
      .catch((error) => {
        setGeneratingMore(false);
        console.error('Error occurred during search:', error);
      });
  }

  const startChat = () => {
    if (tandemRef.current) {
      tandemRef.current.continueConversation()
      setChatStarted(true);
    }
  }


  const top10Languages = [
    'English',
    'German',
    'French',
    'Spanish',
    'Italian',
    'Russian',
    'Chinese',
    'Polish',
    'Turkish',
    'Arabic',
    'Portuguese'
    ];

  return (
    <Grid marginTop={4}>
      <form onSubmit={handleSearch}>
        <Grid alignItems="center" container spacing={2}>
          <Grid item xs={6} md={3}>
            <Autocomplete
              required
              fullWidth
              id="language"
              freeSolo
              value={language}
              onInputChange={handleLanguageChange}
              options={top10Languages}
              renderInput={(params) => <TextField {...params} label="Language to learn" />}
            />
          
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="proficiency-label">Proficiency</InputLabel>
              <Select
                labelId="proficiency-label"
                required
                id="proficiency"
                value={proficiency}
                label="Proficiency"
                onChange={handleProficiencyChange}
              >
                <MenuItem value={"Beginner"}>Beginner</MenuItem>
                <MenuItem value={"Intermediate"}>Intermediate</MenuItem>
                <MenuItem value={"Advanced"}>Advanced</MenuItem>
              </Select>
            </FormControl>
        </Grid>
        <Grid item xs={9} md={3}>
          <TextField
            fullWidth
            required
            value={topic}
            id="topic"
            label="Topic (in any language)"
            variant="outlined"
            onChange={handleTopicChange}
          />
        </Grid>
        <Grid item xs={3} md={3}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={generating || !topic}>
              Generate
          </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {(generating || generatedText.length>0) && <Paper elevation={3} sx={{
            padding: '20px',
            margin: '20px 0',
            lineHeight: '1.7',
            fontSize: '110%',
            fontFamily: 'Hahmlet, serif',
            overflowWrap: 'break-word',
            hyphens: 'auto'}}>
          <Typography 
            variant="h4" gutterBottom>
      {topicGenerated}
    </Typography>
            {generatedText.length>0 && !generating && <>{generatedText.map((block, idx) => 
              <p key={idx}>{block}</p>
            )}</>}
            {(generating || generatingMore) && <ProgressBar time={16} />}
            {generatedText.length>0 && !generatingMore && !generating && <Box sx={{ textAlign: 'right' }}>
              {generatedText.join("").length<3000 && <Button onClick={more}>More</Button>}
              {!chatStarted && <Button onClick={startChat}>Start chat</Button>}
            </Box>}
            </Paper>}

            {generatedText.length>0 &&!generating && <TandemPartner
            ref={tandemRef}
            vocabRef={vocabRef}
            generatedText={generatedText}
            backendUrl={backendUrl}
            language={language}
            proficiency={proficiency}
            topic={topic} />}
          </Grid>
          <Grid item xs={12} md={6}>
          {generatedText.length>0 && <VocabTrainer
            ref={vocabRef}
            topic={topic}
            language={language}
            generatedText={generatedText}
            backendUrl={backendUrl}
            proficiency={proficiency}
            textGenerating={generating} />}
          </Grid>
          
      </Grid>
      
      {generatedText.length>0 && !generating && <FloatingTeacher
      ref={teacherRef}
      vocabRef={vocabRef}
      tandemRef={tandemRef}
      generatedText={generatedText}
      backendUrl={backendUrl}
      language={language}
      proficiency={proficiency}
      topic={topic} />}

    </Grid>
  );
};

export default SearchComponent;
