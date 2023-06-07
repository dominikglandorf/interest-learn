import React, { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import './ProgressBar.css';

const ProgressBar = ({time}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 1;
      });

      return () => {
        window.clearInterval(timer);
      };
    }, time * 10);

    return () => {
      clearInterval(timer);
    };
  }, [time]);

    return (
      <LinearProgress variant="determinate" value={progress} />
    );
};

export default ProgressBar;
