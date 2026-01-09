import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#ffffff',
        color: '#6b7280',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            cursor: 'pointer',
          }}
          onClick={() => navigate('/dashboard')}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/dashboard');
            }
          }}
          aria-label="Navigate to dashboard"
        >
          <Box
            component="img"
            src="/assets/logo-dark.png"
            alt="Lien Manager Logo"
            sx={{
              width: { xs: 32, sm: 40 },
            }}
          />
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.5px',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            LIEN MANAGER
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
