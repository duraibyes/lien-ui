import { useState } from 'react';
import { Box, Card, CardContent, Typography, Chip, Alert, Paper, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { AlertTriangle, Calendar, HardHat, Edit2 } from 'lucide-react';
import type { CalculationResult, DeadlineResult, ProjectDetails } from '../types';
import { ProjectDetailsForm } from './ProjectDetailsForm';

interface ResultsPanelProps {
  result: CalculationResult;
  onUpdate: (details: ProjectDetails) => void;
  viewMode?: 'standard' | 'location-step';
}

export function ResultsPanel({ result, onUpdate, viewMode = 'standard' }: ResultsPanelProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditFormValid, setIsEditFormValid] = useState(false);
  const { deadlines = [], remedies } = result;

  const handleEditClick = () => setIsEditOpen(true);
  const handleCloseEdit = () => setIsEditOpen(false);

  const handleUpdateSubmit = (details: ProjectDetails) => {
    onUpdate(details);
    setIsEditOpen(false);
  };

  if (!deadlines || deadlines.length === 0) {
    return null;
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysRemainingText = (days: number): string => {
    if (days < 0) {
      return `${Math.abs(days)} days overdue`;
    }
    if (days === 0) {
      return 'Due today';
    }
    if (days === 1) {
      return '1 day remaining';
    }
    return `${days} days remaining`;
  };

  const renderDeadlineCard = (deadline: DeadlineResult, isPrimary: boolean) => {
    const bgColor = isPrimary ? 'rgba(16, 185, 129, 0.08)' : 'rgba(59, 130, 246, 0.08)';
    const borderColor = isPrimary ? '#10b981' : '#3b82f6';
    const textColor = isPrimary ? '#059669' : '#2563eb';

    return (
      <Card
        key={deadline.title}
        sx={{
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: 2,
          boxShadow: 'none',
          height: '100%',
        }}
        role="region"
        aria-label={`${deadline.title} information`}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Calendar size={18} color={borderColor} />
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: textColor,
              }}
            >
              {deadline.title}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                color: textColor,
              }}
              aria-label={`${deadline.title}: ${formatDate(deadline.date)}`}
            >
              {formatDate(deadline.date)}
            </Typography>

            <Chip
              label={getDaysRemainingText(deadline.daysRemaining)}
              size="small"
              sx={{
                backgroundColor: '#1f2937',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
              aria-label={getDaysRemainingText(deadline.daysRemaining)}
            />
          </Box>

          <Box
            sx={{
              pt: 2,
              borderTop: `1px solid ${borderColor}`,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                fontSize: '0.75rem',
                color: textColor,
              }}
            >
              Requirement:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6,
                fontSize: '0.875rem',
              }}
            >
              {deadline.requirement}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const allDeadlines = [...deadlines].sort((a, b) => {
    const weights: Record<string, number> = {
      'Lawsuit Filing Deadline': 1,
      'Preliminary Notice': 2,
      "Mechanic's Lien Filing": 3,
      'Miller Act Bond Claim Filing': 4,
      'Payment Bond Claim Filing': 5,
    };
    const weightA = weights[a.title] || 99;
    const weightB = weights[b.title] || 99;
    return weightA - weightB;
  });

  const getGridColumns = () => {
    if (allDeadlines.length === 1) return '1fr';
    return 'repeat(2, 1fr)';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        maxWidth: '100%',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: '#3b82f6', // CTA Blue
          color: '#fff',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
            {result.projectDetails.projectName}
          </Typography>
          <IconButton
            onClick={handleEditClick}
            size="small"
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
            aria-label="Edit project details"
          >
            <Edit2 size={18} />
          </IconButton>
        </Box>

        <Typography variant="subtitle1" sx={{ fontWeight: 500, opacity: 0.95 }}>
          {result.projectDetails.state} • {result.projectDetails.projectType} Project
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
            <HardHat size={18} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Role: {result.projectDetails.role.toUpperCase()} <Box component="span" sx={{ mx: 1, opacity: 0.5 }}>|</Box> Contracted with: {result.projectDetails.contractWith}
            </Typography>
          </Box>

          {viewMode === 'location-step' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
              <Calendar size={18} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Notice: {formatDate(new Date(result.projectDetails.firstFurnishingDate!))} | Performance: {formatDate(new Date(result.projectDetails.lastFurnishingDate!))}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
      <Box>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: 'text.primary',
          }}
        >
          Lien & Bond Claim Deadlines
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'location-step' ? '1fr' : { xs: '1fr', sm: getGridColumns() },
            gap: 2,
          }}
        >
          {allDeadlines.map((deadline) => {
            const isPrimary = deadline.type === 'primary';
            return (
              <Box key={deadline.title}>
                {renderDeadlineCard(deadline, isPrimary)}
              </Box>
            );
          })}
        </Box>
      </Box>

      {viewMode !== 'location-step' && (
        <>
          <Divider sx={{ my: 2 }} />

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: '#fef3c7',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle size={16} color="#f59e0b" />
              </Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                Recommended Remedies
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {remedies.map((remedy) => (
                <Paper
                  key={remedy.order}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                  }}
                  role="article"
                  aria-label={`Action step ${remedy.order}: ${remedy.title}`}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        minWidth: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#dbeafe',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        flexShrink: 0,
                      }}
                      aria-label={`Step ${remedy.order}`}
                    >
                      {remedy.order}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          fontSize: '0.975rem',
                          color: 'text.primary',
                        }}
                      >
                        {remedy.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6, fontSize: '0.875rem' }}
                      >
                        {remedy.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        </>
      )}

      {viewMode !== 'location-step' && (
        <Alert
          severity="warning"
          icon={<AlertTriangle size={24} />}
          sx={{
            backgroundColor: '#fef3c7',
            color: '#92400e',
            border: '1px solid #fbbf24',
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: '#f59e0b',
            },
          }}
          role="alert"
          aria-label="Legal disclaimer"
        >
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.7 }}>
            This tool provides general information based on typical state statutes.
            Lien laws are complex and subject to change. Always consult with a
            construction attorney before filing.
          </Typography>
        </Alert>
      )}

      <Dialog
        open={isEditOpen}
        onClose={handleCloseEdit}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Project Details</DialogTitle>
        <DialogContent dividers>
          <ProjectDetailsForm
            onCalculate={handleUpdateSubmit}
            onValidityChange={setIsEditFormValid}
            initialValues={result.projectDetails}
            hideSubmitButton
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseEdit} size="large" sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const form = document.getElementById('project-details-form') as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            variant="contained"
            size="large"
            disabled={!isEditFormValid}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
}
