import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  FormHelperText,
  Alert,
  Divider,
} from '@mui/material';
import type { ProjectDetails, USState, Role, ContractWith, ProjectType } from '../types';
import { validateProjectDetails } from '../services/calculationService';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

const US_STATES: USState[] = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

const ROLES: Role[] = [
  'General Contractor',
  'Subcontractor',
  'Supplier',
  'Equipment Lessor',
];

function getContractWithOptions(role: Role | ''): ContractWith[] {
  if (role === 'General Contractor') {
    return ['Property Owner'];
  }
  if (role === 'Subcontractor') {
    return ['General Contractor (Original Contractor)', 'Subcontractor'];
  }
  if (role === 'Supplier' || role === 'Equipment Lessor') {
    return ['General Contractor (Original Contractor)', 'Subcontractor', 'Supplier'];
  }
  return [];
}

interface ProjectDetailsFormProps {
  onCalculate: (details: ProjectDetails) => void;
  onValidityChange: (isValid: boolean) => void;
  initialValues?: Partial<ProjectDetails>;
  hideSubmitButton?: boolean;
}

export function ProjectDetailsForm({ onCalculate, onValidityChange, initialValues, hideSubmitButton }: ProjectDetailsFormProps) {
  const [projectName, setProjectName] = useState<string>(initialValues?.projectName || '');
  const [state, setState] = useState<USState | ''>(initialValues?.state || '');
  const [role, setRole] = useState<Role | ''>(initialValues?.role || '');
  const [contractWith, setContractWith] = useState<ContractWith | ''>(initialValues?.contractWith || '');
  const [projectType, setProjectType] = useState<ProjectType | ''>(initialValues?.projectType || '');
  const [firstFurnishingDate, setFirstFurnishingDate] = useState<Dayjs | null>(
    initialValues?.firstFurnishingDate ? dayjs(initialValues.firstFurnishingDate) : null
  );
  const [lastFurnishingDate, setLastFurnishingDate] = useState<Dayjs | null>(
    initialValues?.lastFurnishingDate ? dayjs(initialValues.lastFurnishingDate) : null
  );
  const [projectCompletionDate, setProjectCompletionDate] = useState<Dayjs | null>(
    initialValues?.projectCompletionDate ? dayjs(initialValues.projectCompletionDate) : null
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setContractWith('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const details: Partial<ProjectDetails> = {
      projectName,
      state: state as USState,
      role: role as Role,
      contractWith: contractWith as ContractWith,
      projectType: projectType as ProjectType,
      firstFurnishingDate: firstFurnishingDate ? firstFurnishingDate.toDate() : null,
      lastFurnishingDate: lastFurnishingDate ? lastFurnishingDate.toDate() : null,
      projectCompletionDate: projectCompletionDate ? projectCompletionDate.toDate() : null,
    };

    const errors = validateProjectDetails(details);

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    onCalculate(details as ProjectDetails);
  };

  const contractWithOptions = getContractWithOptions(role);
  const isFormValid = Boolean(
    projectName.trim() &&
    state &&
    role &&
    contractWith &&
    projectType &&
    firstFurnishingDate &&
    lastFurnishingDate
  );

  useEffect(() => {
    onValidityChange(isFormValid);
  }, [isFormValid, onValidityChange]);

  return (
    <Card
      elevation={4}
      sx={{
        height: 'fit-content',
        position: { xs: 'relative', md: 'sticky' },
        top: { xs: 0, md: 80 },
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <form id="project-details-form" onSubmit={handleSubmit}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            Project Details
          </Typography>

          {validationErrors.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {validationErrors.map((error, index) => (
                <Typography key={index} variant="body2">{error}</Typography>
              ))}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Project Name"
              value={projectName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
              required
              fullWidth
              aria-required="true"
              inputProps={{
                'aria-label': 'Enter project name',
              }}
              placeholder="e.g., Downtown Office Complex"
            />

            <TextField
              select
              label="Project State"
              value={state}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState(e.target.value as USState)}
              required
              fullWidth
              aria-required="true"
              inputProps={{
                'aria-label': 'Select project state',
              }}
            >
              {US_STATES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Your Role"
              value={role}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRoleChange(e.target.value as Role)}
              required
              fullWidth
              aria-required="true"
              inputProps={{
                'aria-label': 'Select your role',
              }}
            >
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>

            <FormControl fullWidth required disabled={!role}>
              <TextField
                select
                label="Who is your contract with?"
                value={contractWith}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContractWith(e.target.value as ContractWith)}
                required
                disabled={!role}
                aria-required="true"
                inputProps={{
                  'aria-label': 'Select who your contract is with',
                }}
              >
                {contractWithOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <FormHelperText>
                This determines your tier and notice requirements.
              </FormHelperText>
            </FormControl>

            <FormControl component="fieldset" required>
              <FormLabel
                component="legend"
                sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}
              >
                Project Type
              </FormLabel>
              <RadioGroup
                value={projectType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectType(e.target.value as ProjectType)}
                aria-required="true"
                sx={{ gap: 2 }}
              >
                <FormControlLabel
                  value="Private"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Private
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Commercial or residential projects owned by private entities
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="Public"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Public (State / County / City)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Schools, municipal buildings, state highways
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="Federal"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Federal
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Military bases, federal courthouses (Miller Act)
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Project Dates
            </Typography>

            <DatePicker
              label="Date of notice recorded"
              value={firstFurnishingDate}
              onChange={(newValue) => setFirstFurnishingDate(newValue)}
              format="MM/DD/YYYY"
              maxDate={dayjs()}
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                  helperText: 'Date the preliminary notice was recorded or served.',
                  'aria-label': 'Select date of notice recorded'
                }
              }}
            />

            <DatePicker
              label="Date of last performance"
              value={lastFurnishingDate}
              onChange={(newValue) => setLastFurnishingDate(newValue)}
              format="MM/DD/YYYY"
              maxDate={dayjs()}
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                  helperText: 'Date you last provided labor, materials, or services.',
                  'aria-label': 'Select date of last performance'
                }
              }}
            />

            <DatePicker
              label="Date lien filed"
              value={projectCompletionDate}
              onChange={(newValue) => setProjectCompletionDate(newValue)}
              format="MM/DD/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  'aria-label': 'Select date lien filed'
                }
              }}
            />

            {!hideSubmitButton && (
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={!isFormValid}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  backgroundColor: '#3b82f6',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                  },
                }}
                aria-label="Calculate Deadlines"
              >
                Calculate Deadlines
              </Button>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
