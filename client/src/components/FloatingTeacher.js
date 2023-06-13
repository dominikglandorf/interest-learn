import React, { useState, forwardRef, useEffect } from 'react';
import { SpeedDial, SpeedDialAction, Tooltip, Snackbar, CircularProgress, Popover, Box } from '@mui/material';
import { Info, Add, AccountCircle } from '@mui/icons-material';
import './FloatingTeacher.css';

const FloatingTeacher  = forwardRef(({ generatedText, topic, backendUrl, language, vocabRef, proficiency }, ref) => {
  const [explanation, setExplanation] = useState('');
  const [selection, setSelection] = useState('');
  const [myInterval, setMyInterval] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipAnchorEl, setTooltipAnchorEl] = useState(null);
  const [added, setAdded] = useState('');

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
        1000)
      )
    }

  }, [myInterval]);

  const explain = (event) => {
    event.stopPropagation();
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

  const validSelection = selection !== "" && selection.length < 50 && generatedText.join("").includes(selection)

  const addVocab = (event) => {
    event.stopPropagation();
    if (vocabRef.current) {
      vocabRef.current.addVocab(selection);
      setAdded(selection);
    }
  }

  const handleSpeedDialClick = (event) => {
    if (selection) return
    if (!tooltipOpen) {
        setTimeout(() => {
        setTooltipOpen(false);
      }, 2500);
    }
    setTooltipOpen(true);
    setTooltipAnchorEl(event.currentTarget);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  return (
    <>
      <SpeedDial
        ariaLabel="Vocabulary SpeedDial"
        icon={<AccountCircle />}
        open={validSelection || generating}
        onClick={handleSpeedDialClick}
        onMouseEnter={handleSpeedDialClick}
        direction="up"
        sx={{ position: 'fixed', bottom: 16, right: { xs: 16, md: '47.5%' } }}
      >
        <SpeedDialAction
          key="add"
          tooltipOpen
          tooltipTitle={`Add to vocabulary`}
          icon={<Add />}
          onClick={addVocab}
        />
        <SpeedDialAction
        key="explain"
        tooltipTitle={`Explain "${selection}"`}
        tooltipOpen
          icon={generating ? (
            <CircularProgress  />
          ) : (
            <Info />
          )}
          onClick={explain}
        />
      </SpeedDial>
      {explanation !== '' && <Popover
        open={explanation !== ''}
        onClose={() => setExplanation('')}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      ><Box sx={{ p: 2 }}>{explanation}</Box></Popover>}
      <Tooltip
        open={tooltipOpen}
        title="Select text to receive an explanation or add vocabulary."
        onClose={handleTooltipClose}
        placement="left"
        PopperProps={{
          anchorEl: tooltipAnchorEl,
          modifiers: [
            {
                name: "offset",
                options: {
                    offset: [64, 0],
                },
            },
        ],
        }}

      ><div></div></Tooltip>
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
