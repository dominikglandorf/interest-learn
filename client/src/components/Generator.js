import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useCookies } from 'react-cookie';
import FloatingTeacher from './FloatingTeacher';
import VocabTrainer from './VocabTrainer';
import TandemPartner from './TandemPartner';
import { top15Languages } from './language';
import './typing.css';
import { Grid, Button, MenuItem, Paper, Typography, Alert, Snackbar, Select, FormControl, InputLabel, Box, TextField, Autocomplete } from '@mui/material';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SearchComponent = ({preferenceConsent, statisticsConsent}) => {

  const [cookies, setCookie] = useCookies(['language', 'proficiency']);
  const [language, setLanguage] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [userId, setUserId] = useState(null);
  const [topic, setTopic] = useState('');
  const [topicGenerated, setTopicGenerated] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatingMore, setGeneratingMore] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [showError, setShowError] = useState(false);

  const teacherRef = useRef(null);
  const vocabRef = useRef(null);
  const tandemRef = useRef(null);
  const generateButtonRef = useRef(null);
  const generatedTextRef = useRef(null);
  const topicFieldRef = useRef(null);

  useEffect(() => {
    if (preferenceConsent) {
      if (language === "" & typeof(cookies.language) !== 'undefined') {
        setLanguage(cookies.language);
      }
      if (proficiency === "" & typeof(cookies.proficiency) !== 'undefined') {
        setProficiency(cookies.proficiency);
      }
    }
    console.log(statisticsConsent)
    if (statisticsConsent) {
      if (typeof(cookies.userId) === 'undefined') {
        const userId = uuidv4();
        setUserId(userId);
        setCookie('userId', userId, { path: process.env.REACT_APP_BASENAME });
      } else {
        setUserId(cookies.userId);
      }
    }
  }, [language, proficiency, cookies, generatedTextRef, setCookie, preferenceConsent, statisticsConsent]);

  const handleLanguageChange = (event, newValue) => {
    setLanguage(newValue);
    if (preferenceConsent) {
      setCookie('language', newValue, { path: process.env.REACT_APP_BASENAME });
    }
  };

  const handleProficiencyChange = (event) => {
    setProficiency(event.target.value);
    if (preferenceConsent) {
      setCookie('proficiency', event.target.value, { path: process.env.REACT_APP_BASENAME });
    }
  };

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    
    setTopicGenerated(topic);
    setGeneratedText('');
    setGenerating(true);

    const response = await fetch(`${backendUrl}/text?language=${language}&niveau=${proficiency}&topic=${topic}${userId ? `&userId=${userId}` : ''}`);
    generatedTextRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    if (response.status !== 200) {
      setShowError(true);
      setGenerating(false);
      console.log(await response.json());
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    teacherRef.current?.resetState();
    tandemRef.current?.resetState();

    setChatStarted(false);
    setTopic('');
    topicFieldRef.current?.blur();
    

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setGenerating(false);
        return;
      }
      setGeneratedText((text) => text + decoder.decode(value));
    }
  };

  const more = async () => {
    setGeneratingMore(true);
    setGenerating(true);

    const response = await fetch(`${backendUrl}/continuation?text=${generatedText}${userId ? `&userId=${userId}` : ''}`);
    if (response.status !== 200) {
      setShowError(true);
      console.log(await response.json());
      setGeneratingMore(false);
      setGenerating(false);
      return;
    }
    if (teacherRef.current) teacherRef.current.resetState();
    setGeneratedText((text) => text + "\n\n");
    // generatedTextRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setGeneratingMore(false);
        return;
      }
      setGenerating(false);
      setGeneratedText((text) => text + decoder.decode(value));
    }
  }

  const startChat = () => {
    if (tandemRef.current) {
      tandemRef.current.continueConversation()
      setChatStarted(true);
    }
  }

  const clicked = function(event) {
    event.preventDefault();
    if (teacherRef.current) teacherRef.current.showContext(event);
  }

    
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
              options={top15Languages}
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
            ref={topicFieldRef}
            fullWidth
            required
            value={topic}
            id="topic"
            label="Topic (in any language)"
            variant="outlined"
            onChange={handleTopicChange}
            onFocus={() => teacherRef.current && teacherRef.current.hide()}
            onBlur={() => teacherRef.current && teacherRef.current.show()}
            inputProps={{type: 'search'}}
          />
        </Grid>
        <Grid item xs={3} md={3}>
          <Button
            ref={generateButtonRef}
            type="submit"
            variant="contained"
            fullWidth
            disabled={generating || generatingMore || !topic}>
              {generateButtonRef.current && generateButtonRef.current.getBoundingClientRect().width < 80 ? "Go" : "Generate"}
          </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {(topicGenerated) && <Paper ref={generatedTextRef} elevation={3} sx={{
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
            {generatedText && <p style={{ whiteSpace: "pre-line" }} onContextMenu={clicked}>{generatedText}</p>}
            {((generating && !generatedText) || (generating && generatingMore)) &&
            <span className="typing">
              <span className="typing__dot"></span>
              <span className="typing__dot"></span>
              <span className="typing__dot"></span>
            </span>}
            {generatedText && !generating && <Box sx={{ textAlign: 'right' }}>
              {generatedText.length < 3000 && <Button onClick={more} disabled={generatingMore}>More</Button>}
              {!chatStarted && <Button onClick={startChat} disabled={generatingMore}>Start chat</Button>}
            </Box>}
          </Paper>}

            {generatedText.length > 0 && <TandemPartner
            ref={tandemRef}
            vocabRef={vocabRef}
            generatedText={generatedText}
            backendUrl={backendUrl}
            teacherRef={teacherRef}
            language={language}
            proficiency={proficiency}
            topic={topicGenerated}
            userId={userId} />}
          </Grid>
          <Grid item xs={12} md={6}>
          {generatedText.length > 0 && <VocabTrainer
            ref={vocabRef}
            topic={topicGenerated}
            language={language}
            generatedText={generatedText}
            backendUrl={backendUrl}
            proficiency={proficiency}
            textGenerating={generating}
            teacherRef={teacherRef}
            preferenceConsent={preferenceConsent}
            userId={userId} />}
          </Grid>
          
      </Grid>
      
      {generatedText.length > 0 && <FloatingTeacher
      ref={teacherRef}
      vocabRef={vocabRef}
      tandemRef={tandemRef}
      generatedText={generatedText}
      backendUrl={backendUrl}
      language={language}
      proficiency={proficiency}
      topic={topicGenerated} 
      userId={userId}
      />}

      <Snackbar open={showError} autoHideDuration={5000} onClose={() => setShowError(false)}>
        <Alert severity="error">An error occurred! Please try again.</Alert>
      </Snackbar>
    </Grid>
  );
};

export default SearchComponent;
