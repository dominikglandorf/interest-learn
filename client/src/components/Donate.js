import { Container, Box, Typography, Button, Link } from '@mui/material';

function Donate() {
    return <Container sx={{marginTop: 2}}>
        <Typography>
            If you would like to support the development, hosting and maintenance of this app, please donate as much as you want to. Your help is very appreciated!
        </Typography>
        <Box textAlign="center" marginTop={2}>
        <Button
            component={Link}
            href="https://www.paypal.com/donate/?hosted_button_id=FY965EKP24778"
            variant="contained">Donate via PayPal</Button>
        </Box>
        
    </Container>

}

export default Donate;
