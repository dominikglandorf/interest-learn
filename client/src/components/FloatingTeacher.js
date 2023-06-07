import React, { useState, forwardRef, useEffect, useRef } from 'react';
import { SpeedDial, SpeedDialAction, Tooltip, Snackbar, CircularProgress, Popover, Box } from '@mui/material';
import { Info, Add, AccountCircle } from '@mui/icons-material';

const FloatingTeacher  = forwardRef(({ generatedText, topic, backendUrl, language, vocabRef, proficiency }, ref) => {
  const [explanation, setExplanation] = useState('');
  const [selection, setSelection] = useState('');
  const [myInterval, setMyInterval] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [added, setAdded] = useState('');

  const handleRef = useRef(null);
  const floatingRef = useRef(null);

  const resetState = () => {
    setExplanation('');
  }
  React.useImperativeHandle(ref, () => ({
    resetState
  }));

  useEffect(() => {
    if (!myInterval) {
      setMyInterval(
        setInterval(() => {
          const currentSelection = document.getSelection();
          setSelection(currentSelection.toString());
          // if (currentSelection.rangeCount > 0) {
          //   console.log(currentSelection.toString())
          //   console.log(currentSelection)
          //   const range = currentSelection.getRangeAt(0);
          //   const rect = range.getBoundingClientRect();
          //   const { top, left, width, height } = rect;
          //   //setAnchorEl({ top, left, width, height });
          // }
        },
        250)
      )
    }

  }, [myInterval]);

  const explain = () => {
    setGenerating(true);
    fetch(`${backendUrl}/explanation?selection=${selection}&language=${language}&topic=${topic}&niveau=${proficiency}`)
      .then(response => response.text())
      .then(text => {
        setGenerating(false);
        setExplanation(text);
        vocabRef.current.addVocab(selection);
      })
      .catch((error) => {
        setGenerating(false);
        console.error('Error occurred during search:', error);
      });
  }

  const validSelection = selection !== "" && selection.length < 50 && generatedText.includes(selection)

  const addVocab = () => {
    if (vocabRef.current) {
      vocabRef.current.addVocab(selection);
      setAdded(selection);
    }
  }

  return (
    <>
      <SpeedDial
        ariaLabel="Vocabulary SpeedDial"
        icon={<Tooltip title="Select vocabulary in the text."><AccountCircle /></Tooltip>}
        open={validSelection || generating}
        direction="up"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <SpeedDialAction
          key="add"
          icon={<Tooltip title="Add to vocabulary"><Add /></Tooltip>}
          onClick={addVocab}
        />
        <SpeedDialAction
        key="explain"
          icon={<Tooltip title={`Explain "${selection}"`} >{generating ? (
            <CircularProgress  />
          ) : (
            <Info />
          )}</Tooltip>}
          onClick={explain}
        />
      </SpeedDial>
      {explanation !== '' && <Popover
        open={explanation !== ''}
        onClose={() => setExplanation('')}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      ><Box sx={{ p: 2 }}>{explanation}</Box></Popover>}
      {added !== '' && <Snackbar
        open={added !== ''}
        autoHideDuration={2000}
        onClose={() => setAdded('')}
        message={`Added ${added} to vocabulary.`}
      />}
    </>
  );
})

export default FloatingTeacher;
