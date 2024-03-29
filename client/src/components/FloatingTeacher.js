import React, { useState, forwardRef, useEffect, useRef } from 'react';
import { SpeedDial, SpeedDialAction, Tooltip, Snackbar, CircularProgress, Popover, Box, useMediaQuery } from '@mui/material';
import { Info, Add, AccountCircle } from '@mui/icons-material';
import './FloatingTeacher.css';

const FloatingTeacher  = forwardRef(({ generatedText, topic, backendUrl, language, vocabRef, proficiency, tandemRef, userId }, ref) => {
  const [explanation, setExplanation] = useState('');
  const [selection, setSelection] = useState('');
  const [generatingFor, setGeneratingFor] = useState('');
  const [selectionInterval, setSelectionInterval] = useState(null);
  const [context, setContext] = useState('');
  const [generating, setGenerating] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipAnchorEl, setTooltipAnchorEl] = useState(null);
  const [added, setAdded] = useState('');
  const [selectionPos, setSelectionPos] = useState(0);
  const [hidden, setHidden] = useState(false);

  const anchorRef = useRef();
  
  const hide = () => setHidden(true);
  const show = () => setHidden(false);

  const resetState = () => {
    setExplanation('');
  }

  const showContext = (event) => {
    console.log(event)
  }

  React.useImperativeHandle(ref, () => ({
    resetState,
    showContext,
    hide,
    show
  }));

  useEffect(() => {
    setSelectionInterval(setInterval(() => {
      const currentSelection = document.getSelection();
      const selectedText = currentSelection.toString();

      if (currentSelection.rangeCount>0) {
        const range = currentSelection.getRangeAt(0);
        if (selectedText !== "") {
          const punctuationPattern = /[.!?]/g;
          const preSelectionRange = range.cloneRange();
          preSelectionRange.selectNodeContents(range.commonAncestorContainer);
          const nodeContent = preSelectionRange.cloneContents().textContent;
          const punctuationBefore = [...nodeContent.substring(0, range.startOffset).matchAll(punctuationPattern)];
          const positionOfLastPunctuation = punctuationBefore.length ? punctuationBefore.pop().index : 0;
          const punctuationAfter = [...nodeContent.substring(range.endOffset).matchAll(punctuationPattern)];
          const positionOfNextPunctuation = range.endOffset + (punctuationAfter.length ? punctuationAfter[0].index : 0);
          setContext(nodeContent.substring(positionOfLastPunctuation, positionOfNextPunctuation))
        }

        const rect = range.getBoundingClientRect();
        if (rect.width > 0) {
          setSelectionPos(rect.top / window.innerHeight);
        } else {
          setSelectionPos(0);
        }
      }else {
        setSelectionPos(0);
      }

      setSelection(selectedText);
    },
    1000))
  }, []);

  const explain = (event) => {
    event.stopPropagation();
    setGenerating(true);
    setGeneratingFor(selection);
    fetch(`${backendUrl}/explanation?selection=${selection}&language=${language}&context=${context}&niveau=${proficiency}&translation_language=${vocabRef.current.getLanguage()}${userId ? `&userId=${userId}` : ''}`)
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

  const chatMessages = tandemRef.current ? tandemRef.current.getMessages().join("") : ""
  const validSelection = selection !== "" &&
    selection.length < 75 &&
    (
      generatedText.includes(selection) ||
      chatMessages.includes(selection) ||
      explanation.includes(selection)
    )

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
    if (event.currentTarget) setTooltipAnchorEl(event.currentTarget);
    setTooltipOpen(true);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const largeScreen = !useMediaQuery((theme) => theme.breakpoints.down('md'));
  const speedDial = <SpeedDial
  ariaLabel="Vocabulary SpeedDial"
  icon={<AccountCircle />}
  open={validSelection || generating}
  onClick={handleSpeedDialClick}
  onMouseEnter={handleSpeedDialClick}
  direction={!largeScreen & (selectionPos < 0.5 | explanation !== '') ? "down" : "up"}
  sx={{ position: 'fixed', top: { xs: (explanation !== '' ? "10%" : (selectionPos < 0.5 ? "50%" : "20%")), md: (explanation !== '' ? '30%' : '50%') }, left: { xs: 16, md: '50%' } }}
>
  <SpeedDialAction
    key="add"
    tooltipOpen
    tooltipTitle={`Add to vocabulary`}
    tooltipPlacement="right"
    icon={<Add />}
    onClick={addVocab}
  />
  <SpeedDialAction
    key="explain"
    tooltipTitle={`Explain "${generating ? generatingFor : selection}"`}
    tooltipOpen
    tooltipPlacement="right"
    icon={generating ? (
      <CircularProgress size="1.5rem" />
    ) : (
      <Info />
    )}
    onClick={explain}
  />
</SpeedDial>


  return !hidden && (
    <>
      {explanation && <Popover
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
      ><Box sx={{ p: 2, maxWidth: '1200px' }}>{explanation}</Box>{speedDial}</Popover>}
      {!explanation && speedDial}
      <Tooltip
        open={tooltipOpen}
        title="Select text to receive an explanation or add vocabulary."
        onClose={handleTooltipClose}
        placement="right"
        PopperProps={{
          anchorEl: tooltipAnchorEl,
          modifiers: [
            {
                name: "offset",
                options: {
                    offset: [(largeScreen ? 64 : 64 * (selectionPos < 0.5 ? -1 : 1)), 0],
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
