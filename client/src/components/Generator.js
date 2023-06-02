import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import ProgressBar from './ProgressBar';
import FloatingTeacher from './FloatingTeacher';
import VocabTrainer from './VocabTrainer';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import './Generator.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SearchComponent = () => {
  const [cookies, setCookie] = useCookies(['language', 'proficiency']);
  const [language, setLanguage] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [topic, setTopic] = useState('');
  const [topicGenerated, setTopicGenerated] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false); 
  const teacherRef = useRef(null);
  const vocabRef = useRef(null);

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
        setTopicGenerated(topic);
        setGeneratedText(text);
        if (teacherRef.current) teacherRef.current.resetState();
        if (vocabRef.current) vocabRef.current.resetState();
      })
      .catch((error) => {
        setGenerating(false);
        console.error('Error occurred during search:', error);
      });
      
  };

  const topicStyle = {
    width: '450px',
    maxWidth: '85vw',
  };

  const toggleInstruction = () => {
    setShowInstruction(!showInstruction)
  }

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
      {generatedText && <div className="output"><h2>{topicGenerated}</h2>{generatedText}</div>}
      {generatedText && <FloatingTeacher
      ref={teacherRef}
      generatedText={generatedText}
      backendUrl={backendUrl}
      language={language} />}
      {generatedText && <VocabTrainer
      ref={vocabRef}
      topic={topic}
      language={language}
      generatedText={generatedText}
      backendUrl={backendUrl}
      proficiency={proficiency} />}
      {<div className="how-to" onClick={toggleInstruction}><p className="how-to-opener">How to use this? {showInstruction ? <FaCaretUp /> : <FaCaretDown/>}</p>
      {showInstruction && <>
      <p>This app is made for language learning that is actually helpful for your communication. It helps you to acquire vocabulary for the topics that you wish to speak about with your peers.</p>
      <ol><li>Select the language you learn and your current level.</li>
      <li>Enter a topic that you are interested in or that you would like to learn more about.</li>
      <li>Click on "Generate" and wait approximately 15 seconds for your personalized text to be generated.</li>
      <li>Select words or phrases in the generated text that you would like to have explained and wait approximately 5 seconds for the explanation.</li>
      <li>Generate a vocabulary list with important words by clicking on the button below the text.</li>
      <li>Enter your mother tongue and click on "Export" to generate a simple text file containing the vocabulary and a translation to your langue.</li>
      <li>Import the text file to your favorite flashcard learning platform such as Anki to regularly study and retain the words.</li></ol>
      Language learners who can already read the language and have some basic vocabulary but struggle to understand media designed for a native audience benefit the most. It is highly recommended to actively engage in conversations with a tandem partner at this level of learning.
      </>}
      </div>}
      
    </div>

  );
};

export default SearchComponent;
