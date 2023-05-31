import React, { useState, useEffect } from 'react';
import './ProgressBar.css';

const ProgressBar = ({width, time}) => {
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

    const fillStyle = {
      width: `${progress}%`,
    };

    const barStyle = {
      width: `${width}vw`
    }

    return (
    <div className="progress-bar" style={barStyle}>
        <div className="progress-bar-fill" style={fillStyle}></div>
    </div>
    );
};

export default ProgressBar;
