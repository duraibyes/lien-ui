import { Box, Typography, Paper } from '@mui/material';
import { Calculator, ArrowRight } from 'lucide-react';

export function EmptyState() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, sm: 8 },
        textAlign: 'center',
        backgroundColor: 'transparent',
        border: '2px dashed #d1d5db',
        borderRadius: 3,
        minHeight: { xs: '300px', sm: '500px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          p: { xs: 3, sm: 4 },
          borderRadius: '50%',
          backgroundColor: '#e0f2fe',
          mb: 4,
          position: 'relative',
        }}
        aria-hidden="true"
      >
        <Calculator size={48} color="#3b82f6" strokeWidth={1.5} />
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            backgroundColor: '#10b981',
            borderRadius: '50%',
            p: 1,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <ArrowRight size={20} color="#ffffff" />
        </Box>
      </Box>

      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: 'text.primary',
        }}
      >
        Ready to Calculate
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          maxWidth: 550,
          mx: 'auto',
          lineHeight: 1.7,
          fontSize: '1.05rem',
          mb: 3,
        }}
      >
        Fill out the project details on the left to see your personalized lien
        deadlines and remedies.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          mx: 'auto',
          mt: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            backgroundColor: '#f9fafb',
            borderRadius: 2,
            border: '1px solid #e5e7eb',
          }}
        >
          <Box
            sx={{
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            1
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
            Enter your project information
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            backgroundColor: '#f9fafb',
            borderRadius: 2,
            border: '1px solid #e5e7eb',
          }}
        >
          <Box
            sx={{
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            2
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
            Get calculated deadlines instantly
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            backgroundColor: '#f9fafb',
            borderRadius: 2,
            border: '1px solid #e5e7eb',
          }}
        >
          <Box
            sx={{
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            3
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
            Follow recommended action steps
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
