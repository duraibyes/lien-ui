import { Box, Typography, } from '@mui/material';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  completedStep: number; // Max step reached
  steps: string[];
  onStepClick: (index: number) => void;
}

export function StepIndicator({
  currentStep,
  completedStep,
  steps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1000px',
        mx: 'auto',
        mb: 6,
        position: 'relative',
      }}
    >
      {/* Progress Bar Background */}
      <Box
        sx={{
          position: 'absolute',
          top: '24px',
          left: '0',
          right: '0',
          height: '4px',
          bgcolor: 'grey.200',
          borderRadius: '2px',
          zIndex: 0,
        }}
      />

      {/* Active Progress Bar */}
      <Box
        sx={{
          position: 'absolute',
          top: '24px',
          left: '0',
          height: '4px',
          bgcolor: '#3b82f6',
          borderRadius: '2px',
          zIndex: 0,
          transition: 'width 0.4s ease-in-out',
          width: `${(currentStep / (steps.length - 1)) * 100}%`,
        }}
      />

      {/* Steps Row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {steps.map((label, index) => {
          // Status logic
          const isCompleted = index < currentStep || (index < completedStep && index !== currentStep);
          // Note: "completed" visually usually implies "done". 
          // If I am at step 3, step 0, 1, 2 are "completed".
          // If I go back to step 1: current is 1. Max is 3. 
          // Step 0 is completed. Step 1 is current. Step 2 and 3 are "visited/reachable".
          // The user said: "Completed steps should stay completed while navigating".
          // So if Max is 3, Step 0,1,2,3 should roughly look "active" or "unlocked".

          const isCurrent = index === currentStep;
          const isUnlocked = index <= completedStep;
          const isFuture = index > completedStep;

          return (
            <Box
              key={label}
              onClick={() => isUnlocked ? onStepClick(index) : undefined}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: isUnlocked ? 'pointer' : 'default',
                width: '120px', // Fixed width for alignment
                opacity: isFuture ? 0.5 : 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  opacity: isUnlocked && !isCurrent ? 0.8 : undefined,
                  transform: isUnlocked && !isCurrent ? 'translateY(-2px)' : 'none',
                }
              }}
            >
              {/* Circle Indicator */}
              <Box
                sx={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: isCurrent
                    ? '#3b82f6'
                    : isCompleted
                      ? '#3b82f6'
                      : 'background.paper',
                  border: '3px solid',
                  borderColor: isCurrent
                    ? '#3b82f6'
                    : isCompleted
                      ? '#3b82f6'
                      : 'grey.300',
                  color: isCurrent || isCompleted ? 'common.white' : 'text.secondary',
                  boxShadow: isCurrent
                    ? '0 0 0 4px rgba(59, 130, 246, 0.2)'
                    : isCompleted
                      ? '0 2px 4px rgba(0,0,0,0.1)'
                      : 'none',
                  mb: 1.5,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
              >
                {isCompleted ? (
                  <Check size={24} strokeWidth={3} />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      fontSize: '18px',
                    }}
                  >
                    {index + 1}
                  </Typography>
                )}
              </Box>

              {/* Label */}
              <Typography
                variant="body2"
                align="center"
                sx={{
                  fontWeight: isCurrent ? 700 : 500,
                  fontSize: '0.875rem',
                  color: isCurrent
                    ? 'primary.main'
                    : isUnlocked
                      ? 'text.primary'
                      : 'text.disabled',
                  transition: 'color 0.3s ease',
                  maxWidth: '100%',
                  lineHeight: 1.2,
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
