import React, { useState, forwardRef } from 'react';
import { FaChalkboardTeacher } from 'react-icons/fa';
import ProgressBar from './ProgressBar';
import './FloatingTeacher.css';

const FloatingTeacher  = forwardRef(({ generatedText, backendUrl, language }, ref) => {
    const [showInstruction, setShowInstruction] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [selection, setSelection] = useState('');
    const [myInterval, setMyInterval] = useState(null);
    const [generating, setGenerating] = useState(false);

    const resetState = () => {
      setExplanation('');
      setShowInstruction(false);
    }

    React.useImperativeHandle(ref, () => ({
      resetState
    }));

    const handleClick = () => {
        if (explanation) {
            setExplanation('');
        } else if (showInstruction) {
            setShowInstruction(false);
            clearInterval(myInterval);
        } else {
            setShowInstruction(true);
            setMyInterval(setInterval(() => {
                setSelection(window.getSelection().toString());
            }, 250));
        }
    };

  const explain = () => {
    setGenerating(true);
    fetch(`${backendUrl}/explanation?selection=${selection}&language=${language}&text=${generatedText}`)
      .then(response => response.text())
      .then(text => {
        setShowInstruction(false);
        setGenerating(false);
        setExplanation(text);
      })
      .catch((error) => {
        setShowInstruction(false);
        setGenerating(false);
        console.error('Error occurred during search:', error);
      });
  }

    const buttonStyle = {
        margin: "0 5px",
        fontSize: "100%"
    }

  return (
    <div className={`floating-teacher`}>
        {showInstruction && !selection && <span className="teacher-text">Select text</span>}
        {showInstruction && selection && !generating && <span className="teacher-text">Explain "{selection}"?<button onClick={explain} style={buttonStyle}>Go</button></span>}
        {showInstruction && generating && <span className="teacher-text"><ProgressBar width={15} time={4} /></span>}
        {explanation && <span className="teacher-text">{explanation}</span>}
        <span className="floating-teacher-symbol" onClick={handleClick}><FaChalkboardTeacher className="teacher-icon" /></span>
    </div>
    
  );
})

export default FloatingTeacher;
