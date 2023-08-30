import React, { useState, forwardRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import ProgressBar from './ProgressBar';
import { Button, Chip, Typography, Grid, TextField, Box, Autocomplete, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getLanguageName, languageNames } from './language';

const VocabTrainer = forwardRef(({ topic, generatedText, backendUrl, language, proficiency, textGenerating, teacherRef }, ref) => {
  const [generating, setGenerating] = useState(false);
  const [vocabulary, setVocabulary] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [checkedSystemLanguage, setCheckedSystemLanguage] = useState(false)
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

  const getLanguage = () => translationLanguage;
  
  React.useImperativeHandle(ref, () => ({
    resetState,
    addVocab,
    getLanguage
  }));

  useEffect(() => {
    if(!checkedSystemLanguage) {
      if(typeof(cookies.translation_language) !== "undefined") {
        setTranslationLanguage(cookies.translation_language);
      } else {
        setTranslationLanguage(getLanguageName(navigator.language))
      }
      setCheckedSystemLanguage(true);
    }
  }, [checkedSystemLanguage, translationLanguage, cookies]);

  const collect = () => {
    if (generating) return
    setGenerating(true);
    fetch(`${backendUrl}/vocabulary?text=${generatedText}&language=${language}&niveau=${proficiency}`)
      .then(response => response.json())
      .then(data => {
        setGenerating(false);
        for (const idx in data) {
          if (!vocabulary.includes(data[idx])) setVocabulary((vocab) => vocab.concat([data[idx]]));
        }
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

  const handleTransLangChange = (event, newValue) => {
    setTranslationLanguage(newValue);
    setCookie('translation_language', newValue, { path: process.env.REACT_APP_BASENAME });
  };

  const deleteVocab = () => setVocabulary([]);

  return (
    <Box sx={{marginTop: 3, marginLeft: 2, marginBottom: 3}}>
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">
        Vocabulary {vocabulary.length > 0 && <IconButton onClick={deleteVocab} aria-label="delete"><DeleteIcon /></IconButton>}
      </Typography>
        {vocabulary.length > 0 && <> {vocabulary.map(Word)} </>}
        {!generating && !textGenerating && <Button onClick={collect}>Auto-extract</Button>}
        {generating && <ProgressBar time={generatedText.length / 200} />}
      </Grid>
      {vocabulary.length > 0 && <>
        <Grid item xs={6}>
        
        <Autocomplete
            required
            fullWidth
            id="language"
            freeSolo
            value={translationLanguage}
            onInputChange={handleTransLangChange}
            options={Object.values(languageNames)}
            onFocus={() => teacherRef.current && teacherRef.current.hide()}
            onBlur={() => teacherRef.current && teacherRef.current.show()}
            renderInput={(params) => <TextField {...params} label="Your language" />}
          />
        </Grid>
        <Grid item xs={6}>
        {!exporting && <Button fullWidth onClick={exportList} disabled={!translationLanguage}>Export</Button>}
        {exporting && <ProgressBar time={vocabulary.length * 1.5} />}
        </Grid>
        </>}
    </Grid>
    </Box>
  );
});

export default VocabTrainer;
