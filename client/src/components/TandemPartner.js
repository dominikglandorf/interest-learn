import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { CircularProgress, Button, Avatar, Paper, Typography, TextField } from '@mui/material';

const TandemPartner = forwardRef(({ generatedText, topic, backendUrl, language, vocabRef, proficiency, teacherRef }, ref) => {
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

    const continueConversation = async function() {
        setLoading(true);

        const history = newMessage ? messageHistory.concat({role: 'user', content: newMessage}) : messageHistory;
        setNewMessage('');
        setMessageHistory(history);

        const data = {
            text: generatedText.join(" "),
            language: language,
            messageHistory: history,
        }
        
        try {
            const response = await fetch(`${backendUrl}/tandem`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
        
            if (!response.ok) {
              throw new Error('Request failed');
            }
        
            const messageContent = await response.text();
            setMessageHistory(history.concat({role: 'assistant', content: messageContent}))

            setLoading(false);
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
            {message.content}
          </Typography>
        </Paper>
      ))}
      
      {loading && <CircularProgress color="success" />}
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
