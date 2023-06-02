import React, { useState, forwardRef, useEffect, useRef } from 'react';
import { FaChalkboardTeacher } from 'react-icons/fa';
import ProgressBar from './ProgressBar';
import './FloatingTeacher.css';

const FloatingTeacher  = forwardRef(({ generatedText, backendUrl, language }, ref) => {
  const [showInstruction, setShowInstruction] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [selection, setSelection] = useState('');
  const [myInterval, setMyInterval] = useState(null);
  const [generating, setGenerating] = useState(false);
  const handleRef = useRef(null);
  const floatingRef = useRef(null);

  const resetState = () => {
    setExplanation('');
    setShowInstruction(false);
  }
  React.useImperativeHandle(ref, () => ({
    resetState
  }));

  useEffect(() => {
    if (!myInterval) {
      setMyInterval(
        setInterval(() => setSelection(document.getSelection().toString()),
        1000)
      )
    }
    const handleClick = (event) => {
      if (handleRef.current) {
        if (floatingRef.current.contains(event.target)) {
          if (handleRef.current.contains(event.target)) {
            if (explanation | showInstruction) {
              resetState();
            } else {
              setShowInstruction(true);
            }
          } 
        } else {
          resetState();
        }
      }
    };

    // Attach the click event listener when the component mounts
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    }
  }, [myInterval, explanation, showInstruction]);

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

  const validSelection = selection !== "" && selection.length < 50 && generatedText.includes(selection)

  return (
    <div className={`floating-teacher`} ref={floatingRef}>
        {showInstruction && !selection && <span className="teacher-text">Select text.</span>}
        {validSelection && !generating && !explanation && <span className="teacher-text">Explain "{selection}"?<button onClick={explain} style={buttonStyle}>Go</button></span>}
        {generating && <span className="teacher-text"><ProgressBar width={15} time={4} /></span>}
        {explanation && <span className="teacher-text explanation">{explanation}</span>}
        <span className="floating-teacher-symbol" ref={handleRef}><FaChalkboardTeacher className="teacher-icon" /></span>
    </div>
    
  );
})

export default FloatingTeacher;
