import { Box, Container, Typography } from '@mui/material';

export function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: 'transparent',
                color: '#6b7280',
                borderTop: '1px solid #e5e7eb',
            }}
        >
            <Container maxWidth="xl">
                <Typography variant="body2" align="center">
                    © {new Date().getFullYear()} Lien Manager. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}