import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Button, Avatar, Paper, Typography, TextField } from '@mui/material';
import { diffWordsWithSpace, diffChars } from 'diff';
import './typing.css';

const TandemPartner = forwardRef(({ generatedText, topic, backendUrl, language, vocabRef, proficiency, teacherRef, userId }, ref) => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [newMessage, setNewMessage] = useState('');
    const newMessageInput = useRef();

    const resetState = () => {
        setMessageHistory([]);
        setLoading(false);
        setNewMessage('');
    }

    const getMessages = () => messageHistory.map((message) => message.content)

    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
      };

     const replaceContent = function(array, searchValue, correctedMessage, correctedContent) {
        return array.map(item => {
          if (item.hasOwnProperty('content') && item.content === searchValue) {
            return { ...item, content: correctedMessage, correctedContent: correctedContent };
          }
          return item;
        });
      }

      const HighlightChanges = (userMessage, correctedVersion) => {
        const diff = diffWordsWithSpace(userMessage, correctedVersion);
 
        return (
          <span>
            {diff.map((part, index) => {
              const { added, removed, value } = part;
              
              if (index+1 < diff.length) {
                if (Math.abs(value.length - diff[index + 1].value.length) <= 1) {
                  const charDiffs = diffChars(value, diff[index + 1].value)
                  const minorDiffs = charDiffs.filter(diff => (diff.removed | diff.added)).map(diff => diff.count).reduce((a, b) => a + b, 0)
                  if (minorDiffs>0 & minorDiffs <= 2) {
                      diff[index + 1].value = ""
                      return <>{charDiffs.map((charPart, charIndex) => {
                        const { added, removed, value } = charPart;
                        if (added) {
                          return <span key={`${index}${charIndex}`} style={{ color: 'green' }}>{value}</span>;
                        }
                        if (removed) {
                          return <span key={`${index}${charIndex}`} style={{ color: 'red', textDecoration: 'line-through' }}>{value}</span>;
                        } 
                        return value
                      })}
                      </>
                  }
                }
              }
      
              if (added) {
                return <span key={index} style={{ color: 'green' }}>{value}</span>;
              }
              if (removed) {
                return <span key={index} style={{ color: 'red', textDecoration: 'line-through' }}>{value}</span>;
              }
      
              return value;
            })}
          </span>
        );
      };
    
    const correctMessage = async (message) => {
      const data = {
        message: message,
        language: language,
      }
      if (userId) {
        data.userId = userId;
      }

      try {
        const response = await fetch(`${backendUrl}/correction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          throw new Error('Request failed');
        }
    
        const correctedMessage = await response.text();
        const improvement = HighlightChanges(message, correctedMessage);
        setMessageHistory((messageHistory) => replaceContent(messageHistory, message, correctedMessage, improvement))
      } catch (error) {
        console.error('Error:', error);
      }
    }

    const continueConversation = async function() {
        setLoading(true);
        const history = newMessage ? messageHistory.concat({role: 'user', content: newMessage}) : messageHistory;
        setMessageHistory(history);
        if (newMessage) {
          correctMessage(newMessage);
          setNewMessage('');
        }
        
        const data = {
            text: generatedText,
            language: language,
            messageHistory: history.map(message => ({
              role: message.role, content: message.content
            }))
        }
        if (userId) {
          data.userId = userId;
        }

        setMessageHistory((messageHistory) => messageHistory.concat({role: 'assistant', content: ''}));

        try {
          const response = await fetch(`${backendUrl}/tandem`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          if (response.status !== 200) {
            console.log(await response.json());
            return;
          }
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          
          let content = '';

          
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              setLoading(false);
              break;
            }
            content += decoder.decode(value);
          }

          setMessageHistory((messageHistory) => {
            messageHistory.slice(-1)[0].content = content;
            return messageHistory
          })
        } catch (error) {
          console.error('Error:', error);
          // Handle error here
          setLoading(false);
        }
    }

    React.useImperativeHandle(ref, () => ({
        resetState,
        getMessages,
        continueConversation
    }));

    useEffect(() => {
      if (messageHistory.length > 0) {
        newMessageInput.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, [messageHistory]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            continueConversation();
        }
      };
      
    
    const contextMenu = function(event) {
      event.preventDefault();
    }
  

    return <div style={{marginTop: 2, padding: 0, textAlign: 'center'}}>
        {messageHistory.map((message, index) => (
        <Paper
          key={index}
          ref={index === messageHistory.length - 1 ? newMessageInput : null}
          sx={{
            display: 'flex',
            flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
            padding: 1.5,
            marginBottom: 2,
            width: 0.9,
            marginLeft: message.role === 'user' ? "10%" : 0,
            marginRight: message.role === 'user' ? 0 : "10%",
            textAlign: message.role === 'user' ? 'right' : 'left'
          }}
          onContextMenu={contextMenu}
          elevation={2}
        >
          <Avatar
            sx={{
              backgroundColor: message.role === 'user' ? 'primary.main' : 'warning.main',
            }}
            variant="rounded"
          >
            {message.role === 'user' ? 'U' : 'A'}
          </Avatar>
          <Typography variant="body1" sx={{
              marginLeft: message.role === 'user' ? 0 : 1.5,
              marginRight: message.role === 'user' ? 1.5 : 0,
              lineHeight: 1.7,
            }}>
            {message.hasOwnProperty("correctedContent") ? message.correctedContent : message.content}
          </Typography>
          {loading && index === messageHistory.length - 1 && message.role !== 'user' &&
          <div className="typing">
              <div className="typing__dot"></div>
              <div className="typing__dot"></div>
              <div className="typing__dot"></div>
            </div>}
        </Paper>
      ))}
      
      {messageHistory.length > 0 && <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px',
          marginTop: '16px',
        }}
        elevation={1}
      >
        <TextField
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          fullWidth
          multiline
          maxRows={3}
          onFocus={() => teacherRef.current && teacherRef.current.hide()}
          onBlur={() => teacherRef.current && teacherRef.current.show()}
        />
        <Button
        variant="contained"
        color="primary"
        onClick={continueConversation}
        disabled={loading}
        
        sx={{ marginLeft: '8px' }}>
          Send
        </Button>
      </div>}
    </div>

})

export default TandemPartner;
