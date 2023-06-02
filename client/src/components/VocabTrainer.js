import React, { useState, forwardRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import ProgressBar from './ProgressBar';
import { FaTrash } from 'react-icons/fa';
import './VocabTrainer.css';

const VocabTrainer = forwardRef(({ topic, generatedText, backendUrl, language, proficiency }, ref) => {
  const [generating, setGenerating] = useState(false);
  const [vocabulary, setVocabulary] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState('');
  const [cookies, setCookie] = useCookies(['translation_language']);

  const resetState = () => {
    setGenerating(false);
    setExporting(false);
    setVocabulary([]);
  }
  React.useImperativeHandle(ref, () => ({
    resetState
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

  const Word = (name) => <li key={name}><FaTrash onClick={()=>removeFromVocab(name)} size={14} /> {name}</li>

  const handleTransLangChange = (event) => {
    setTranslationLanguage(event.target.value);
    setCookie('translation_language', event.target.value, { path: '/interest-learn' });
  };

  return (
    <div>
        {!generating && !vocabulary.length && <button onClick={collect}>Extract vocabulary</button>}
        {generating && <ProgressBar width={15} time={6} />}
        {vocabulary.length > 0 && <div className={`vocab-trainer`}><h3>Vocabulary</h3><ul className=".output">{vocabulary.map(Word)}</ul></div>}
        {vocabulary.length > 0 && <>
            <input
                type="text"
                id="language"
                value={translationLanguage}
                onChange={handleTransLangChange}
                placeholder="Translation language"
            /><br />
            {!exporting && <button onClick={exportList}>Export</button>}
            {exporting && <ProgressBar width={15} time={20} />}
        </>}
    </div>
  );
});

export default VocabTrainer;
