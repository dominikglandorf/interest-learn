import React, { useState, forwardRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import ProgressBar from './ProgressBar';
import { Button, Chip, Typography, Grid, TextField, Box } from '@mui/material';

const VocabTrainer = forwardRef(({ topic, generatedText, backendUrl, language, proficiency }, ref) => {
  const [generating, setGenerating] = useState(false);
  const [vocabulary, setVocabulary] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState('');
  const [cookies, setCookie] = useCookies(['translation_language']);

  const addVocab = (vocab) => {
    if (!vocabulary.includes(vocab)) setVocabulary(vocabulary.concat([vocab]));
  }

  const resetState = () => {
    setGenerating(false);
    setExporting(false);
    setVocabulary([]);
  }
  React.useImperativeHandle(ref, () => ({
    resetState,
    addVocab
  }));

  useEffect(() => {
    if (translationLanguage === "" & cookies.language !== "") {
        setTranslationLanguage(cookies.translation_language);
    }
  }, [translationLanguage, cookies]);

  const collect = () => {
    if (generating) return
    setGenerating(true);
    fetch(`${backendUrl}/vocabulary?text=${generatedText}&language=${language}&&niveau=${proficiency}`)
      .then(response => response.json())
      .then(data => {
        setGenerating(false);
        setVocabulary(data);
      })
      .catch((error) => {
        setGenerating(false);
        console.error('Error occurred during vocabulary generation:', error);
      });
  };

  const exportList = () => {
    if (exporting) return
    setExporting(true);
    fetch(`${backendUrl}/export?vocabulary=${vocabulary.join(',')}&language=${language}&translation_language=${translationLanguage}`)
      .then(response => response.text())
      .then(data => {
        console.log(data)
        setExporting(false);
        const element = document.createElement('a');
        const file = new Blob([data], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `vocabulary_${translationLanguage}_${language}_${topic}.csv`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      })
      .catch((error) => {
        setExporting(false);
        console.error('Error occurred during export list generation:', error);
      });
  };

  const removeFromVocab = (name) => {
    setVocabulary(vocabulary.filter((elem) => elem !== name));
  }

  const Word = (name) => <Chip
  label={name}
  color="success"
  key={name}
  sx={{
    margin: 0.5,
  }}
  onDelete={()=>removeFromVocab(name)}>{}</Chip>

  const handleTransLangChange = (event) => {
    setTranslationLanguage(event.target.value);
    setCookie('translation_language', event.target.value, { path: '/interest-learn' });
  };

  return (
    <Box sx={{marginTop: 3, marginLeft: 2, marginBottom: 3}}>
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h5">
        Vocabulary
      </Typography>
        {vocabulary.length > 0 && <> {vocabulary.map(Word)} </>}
        {!vocabulary.length && !generating && <Button onClick={collect}>Auto-extract</Button>}
        {generating && <ProgressBar width={15} time={6} />}
      </Grid>
      {vocabulary.length > 0 && <>
        <Grid item xs={6}>
        <TextField
        fullWidth
          required
          id="topic"
          label="Translation language"
          variant="outlined"
            type="text"
            onChange={handleTransLangChange}
        />
        </Grid>
        <Grid item xs={6}>
        {!exporting && <Button fullWidth onClick={exportList}>Export</Button>}
        {exporting && <ProgressBar time={vocabulary.length * 1.5} />}
        </Grid>
        </>}
    </Grid>
    </Box>
  );
});

export default VocabTrainer;
