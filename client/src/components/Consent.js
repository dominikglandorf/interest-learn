import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useCookies } from 'react-cookie';

const Consent = ({preferenceConsent, setPreferenceConsent, statisticsConsent, setStatisticsConsent}) => {

    const [consentDialogOpen, setConsentDialogOpen] = useState(false);
    const [cookies, setCookie] = useCookies(['preferenceConsent', 'statisticsConsent']);
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    useEffect(() => {
        if (typeof(cookies.preferenceConsent) === 'undefined' ||
            typeof(cookies.statisticsConsent) === 'undefined') {
                setPreferenceConsent(true)
                setStatisticsConsent(true);
                setConsentDialogOpen(true)
        } else {
            setPreferenceConsent(cookies.preferenceConsent === "true");
            setStatisticsConsent(cookies.statisticsConsent === "true");
        }
    }, [cookies, setPreferenceConsent, setStatisticsConsent]);

    const handlePreferenceChange = (event, value) => {
        setPreferenceConsent(value);
    }

    const handleStatisticsChange = (event, value) => {
        setStatisticsConsent(value);
    }

    const handleAccept = () => {
        setCookie('preferenceConsent', preferenceConsent, { expires: date } );
        setCookie('statisticsConsent', statisticsConsent, { expires: date } );
        setConsentDialogOpen(false);
    };
    
    const handleDecline = () => {
        setCookie('preferenceConsent', false, { expires: date } );
        setCookie('statisticsConsent', false, { expires: date } );
        setConsentDialogOpen(false);
    };

    return  <Dialog open={consentDialogOpen} maxWidth="xs">
    <DialogTitle>Privacy settings</DialogTitle>
    <DialogContent>
      <DialogContentText>
        This application improves the user experience by storing user preferences in the form of cookies on your computer and by creating usage statistics. The stored information does not contain sensitive personal data. Please specify which data processing you agree with.
      </DialogContentText>
      <FormGroup>
        <FormControlLabel control={<Checkbox disabled checked />} label="Necessary cookies" />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Preference cookies" onChange={handlePreferenceChange} />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Usage statistics" onChange={handleStatisticsChange} />
      </FormGroup>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDecline}>Decline all</Button>
      <Button onClick={handleAccept} variant="contained">Accept</Button>
    </DialogActions>
  </Dialog>
};

export default Consent