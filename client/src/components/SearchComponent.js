import React, { useState } from 'react';

const SearchComponent = () => {
  const [language, setLanguage] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [topic, setTopic] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleProficiencyChange = (event) => {
    setProficiency(event.target.value);
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
    fetch(`http://localhost:3003/text?language=${language}&niveau=${proficiency}&topic=${topic}`)
      .then((response) =>  {
        console.log(response);
        // Update the search result state with the received data
        setGeneratedText(response);
      })
      .catch((error) => {
        console.error('Error occurred during search:', error);
      });
  };

  return (
    <div>
      <div>
      <select id="language" value={language} onChange={handleLanguageChange}>
        <option value="">Select Language</option>
        <option value="English">English</option>
        <option value="Spanish">Spanish</option>
        <option value="Mandarin Chinese">Mandarin Chinese</option>
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
          onChange={handleTopicChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter a topic"
        />
      </div>
      <button onClick={handleSearch}>Generate</button>
      <p>{generatedText}</p>
    </div>
  );
};

export default SearchComponent;
