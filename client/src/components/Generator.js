import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import ProgressBar from './ProgressBar';
import FloatingTeacher from './FloatingTeacher';
import './Generator.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SearchComponent = () => {
  const [cookies, setCookie] = useCookies(['language', 'proficiency']);
  const [language, setLanguage] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [topic, setTopic] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [generating, setGenerating] = useState(false);
  const teacherRef = useRef(null);

  useEffect(() => {
    if (language === "" & cookies.language !== "") {
      setLanguage(cookies.language);
    }
    if (proficiency === "" & cookies.proficiency !== "") {
      setProficiency(cookies.proficiency);
    }
  }, [language, proficiency, cookies]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    setCookie('language', event.target.value, { path: '/interest-learn' });
  };

  const handleProficiencyChange = (event) => {
    setProficiency(event.target.value);
    setCookie('proficiency', event.target.value, { path: '/interest-learn' });
  };

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    
    setGenerating(true);
    fetch(`${backendUrl}/text?language=${language}&niveau=${proficiency}&topic=${topic}`)
      .then(response => response.text())
      .then(text => {
        setGenerating(false);
        setGeneratedText(text);
        if (teacherRef.current) teacherRef.current.resetState();
      })
      .catch((error) => {
        setGenerating(false);
        console.error('Error occurred during search:', error);
      });
      
  };

  const topicStyle = {
    width: '40vw',
    maxWidth: '500px',
    minWidth: '350px',
  };

  const outputStyle = {
    margin: '0 auto',
    maxWidth: '90vw',
    width: '500px',
    fontFamily: 'Hahmlet, serif',
    lineHeight: '1.5',
    fontSize: '125%',
    color: '#000',
    padding: '20px 0',
    textAlign: 'left',
    overflowWrap: 'break-word',
    hyphens: 'auto'
  };

  return (
    <div>
      <div>
      <select id="language" value={language} onChange={handleLanguageChange}>
        <option value="">Select Language</option>
        <option value="English">English</option>
        <option value="Spanish">Spanish</option>
        <option value="Chinese">Mandarin</option>
        <option value="French">French</option>
        <option value="German">German</option>
        <option value="Italian">Italian</option>
        <option value="Japanese">Japanese</option>
        <option value="Russian">Russian</option>
        <option value="Arabic">Arabic</option>
        <option value="Portuguese">Portuguese</option>
        {/* Add more language options as needed */}
    </select>

      </div>
      <div>
        <select id="proficiency" value={proficiency} onChange={handleProficiencyChange}>
          <option value="">Select Proficiency</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          {/* Add more proficiency options as needed */}
        </select>
      </div>
      <div>
        <input
          type="text"
          id="topic"
          value={topic}
          style={topicStyle}
          onChange={handleTopicChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter a topic (in any language)"
        />
      </div>
      {generating ? (
        <ProgressBar width={35} time={16} />
      ) : (
        <button onClick={handleSearch}>Generate</button>
      )}
      <div style={outputStyle}>{generatedText}</div>
      {generatedText && <FloatingTeacher
      ref={teacherRef}
      generatedText={generatedText}
      backendUrl={backendUrl}
      language={language} />}
    </div>
  );
};

export default SearchComponent;