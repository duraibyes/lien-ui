import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { ProjectDetailsForm } from '../components/ProjectDetailsForm';
import { ProjectLocationForm } from '../components/ProjectLocationForm';
import { ProjectTasksForm } from '../components/ProjectTasksForm';
import { ReviewAndSubmitForm } from '../components/ReviewAndSubmitForm';
import { ContractDetailsForm } from '../components/ContractDetailsForm';
import { ContactsAndDocumentsForm } from '../components/ContactsAndDocumentsForm';
import { EmptyState } from '../components/EmptyState';
import { ResultsPanel } from '../components/ResultsPanel';
import { StepIndicator } from '../components/StepIndicator';

import type { ProjectDetails, CalculationResult, SavedContact, UploadedDocument, ProjectTask, ContractDetails } from '../types';
import { calculateLienDeadlines } from '../services/calculationService';
import { saveCalculation, clearCalculation, saveProject } from '../services/storageService';
import dayjs from 'dayjs';

export function Calculator() {
    const navigate = useNavigate();
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [step, setStep] = useState<number>(0);
    const [completedStep, setCompletedStep] = useState<number>(0);
    const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);

    // Shared State
    const [documents, setDocuments] = useState<UploadedDocument[]>([
        {
            id: 'doc-1',
            name: 'Main_Contract_ABC.pdf',
            size: '2.4 MB',
            type: 'application/pdf',
            url: URL.createObjectURL(new Blob(['Mock PDF Content'], { type: 'application/pdf' }))
        }
    ]);

    const [savedCustomerContacts, setSavedCustomerContacts] = useState<SavedContact[]>([
        {
            id: 'dummy-cust-1',
            companyId: 'cust-1',
            companyName: 'ABC Construction',
            title: 'Project Manager',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@abc-const.com',
            phone: '(555) 123-4567',
            fullCompanyInfo: {
                name: 'ABC Construction',
                website: 'https://abc-const.com',
                address: '123 Builder St',
                city: 'Austin',
                state: 'Texas',
                zip: '78701',
                phone: '(555) 123-0000',
                fax: '(555) 123-0001'
            },
            fullContactRows: [
                { id: '1', title: 'Project Manager', firstName: 'John', lastName: 'Doe', email: 'john.doe@abc-const.com', directPhone: '(555) 123-4567', cell: '(555) 123-9999' }
            ]
        }
    ]);

    const [savedProjectContacts, setSavedProjectContacts] = useState<SavedContact[]>([
        {
            id: 'dummy-proj-1',
            companyId: 'proj-1',
            companyName: 'BuildIt Solutions',
            title: 'Professional',
            role: 'Site Lead',
            firstName: 'Sarah',
            lastName: 'Miller',
            email: 'sarah.m@buildit.com',
            phone: '(555) 987-6543',
            fullCompanyInfo: {
                name: 'BuildIt Solutions',
                website: 'https://buildit.com',
                address: '456 Site Ave',
                city: 'San Antonio',
                state: 'Texas',
                zip: '78201',
                phone: '(555) 987-0000',
                fax: '(555) 987-0001'
            },
            fullContactRows: [
                { id: '1', title: 'Professional', role: 'Site Lead', firstName: 'Sarah', lastName: 'Miller', email: 'sarah.m@buildit.com', directPhone: '(555) 987-6543', cell: '(555) 987-1111' }
            ]
        }
    ]);

    const [tasks, setTasks] = useState<ProjectTask[]>([
        {
            id: '1',
            action: 'Preliminary Notice Filing',
            dueDate: dayjs().add(7, 'day'),
            dateCompleted: null,
            emailNotification: true,
            comments: 'Ensure all property owner details are verified.'
        },
        {
            id: '2',
            action: 'Site Inspection',
            dueDate: dayjs().add(2, 'day'),
            dateCompleted: dayjs().subtract(1, 'day'),
            emailNotification: false,
            comments: 'Regular weekly inspection.'
        }
    ]);

    const [contractDetails, setContractDetails] = useState<ContractDetails>({
        baseContractAmount: 450000,
        additionalCosts: 25000,
        paymentsCredits: 150000,
        jobNo: 2024001,
        waiverAmount: 0,
        receivableStatus: 'Preliminary Notice',
        calculationStatus: 'In Progress'
    });

    useEffect(() => {
        // Ensure we start fresh every time the calculator is accessed
        clearCalculation();
        setResult(null);
        setStep(0);
        setCompletedStep(0);
    }, []);

    const stepNames = [
        'Project Details',
        'Location & Scope',
        'Contract Details',
        'Contacts & Documents',
        'Tasks & Labor',
        'Review & Submit'
    ];

    const handleCalculate = (details: ProjectDetails) => {
        const calculationResult = calculateLienDeadlines(details);
        setResult(calculationResult);
        saveCalculation(calculationResult);
        // When calculating, we explicitly set step 0 to show results alongside form
        setStep(0);
    };

    const handleNextStep = () => {
        if (step < 5) {
            const nextStep = step + 1;
            setStep(nextStep);
            setCompletedStep(prev => Math.max(prev, nextStep));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            if (result) {
                saveProject(result);
            }
            navigate('/dashboard');
        }
    };

    const handleCancelOrBack = () => {
        if (step > 0) {
            setStep(step - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/dashboard');
        }
    };

    const handleSkipPrompt = () => {
        setIsSkipDialogOpen(true);
    };

    const handleConfirmSkip = () => {
        setIsSkipDialogOpen(false);
        handleNextStep();
    };

    return (
        <Box
            sx={{
                py: 6,
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        textAlign: 'center',
                        mb: 6,
                        px: 2,
                    }}
                    component="header"
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: 'text.primary',
                            fontSize: { xs: '2rem', md: '3rem' },
                        }}
                    >
                        Protect Your Payment Rights.
                    </Typography>
                    <Typography
                        variant="h6"
                        component="p"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 900,
                            mx: 'auto',
                            lineHeight: 1.6,
                            fontWeight: 400,
                        }}
                    >
                        Calculate critical lien deadlines, understand notice requirements,
                        and generate your personalized remedy roadmap for construction projects.
                    </Typography>
                </Box>

                {/* Step Indicator */}
                <StepIndicator
                    currentStep={step}
                    completedStep={completedStep}
                    steps={stepNames}
                    onStepClick={(stepIndex: number) => {
                        setStep(stepIndex);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />

                <Box
                    sx={{
                        display: step === 5 ? 'block' : 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: step === 0 ? '380px 1fr' : '1fr 420px'
                        },
                        gap: 4,
                        alignItems: 'flex-start',
                        maxWidth: step === 5 ? '1000px' : 'none',
                        mx: step === 5 ? 'auto' : '0'
                    }}
                >
                    <Box>
                        {step === 0 ? (
                            <ProjectDetailsForm
                                onCalculate={handleCalculate}
                                initialValues={result?.projectDetails}
                                onValidityChange={() => { }}
                            />
                        ) : step === 1 ? (
                            <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                <ProjectLocationForm state={result?.projectDetails.state || ''} />
                            </Box>
                        ) : step === 2 ? (
                            <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                <ContractDetailsForm
                                    contractDetails={contractDetails}
                                    setContractDetails={setContractDetails}
                                />
                            </Box>
                        ) : step === 3 ? (
                            <Box sx={{ p: 4, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                <ContactsAndDocumentsForm
                                    documents={documents}
                                    setDocuments={setDocuments}
                                    savedCustomerContacts={savedCustomerContacts}
                                    setSavedCustomerContacts={setSavedCustomerContacts}
                                    savedProjectContacts={savedProjectContacts}
                                    setSavedProjectContacts={setSavedProjectContacts}
                                />
                            </Box>
                        ) : step === 4 ? (
                            <Box sx={{ p: 4, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                <ProjectTasksForm
                                    state={result?.projectDetails.state || ''}
                                    tasks={tasks}
                                    setTasks={setTasks}
                                />
                            </Box>
                        ) : (
                            <Box sx={{ p: 4, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                <ReviewAndSubmitForm
                                    result={result}
                                    documents={documents}
                                    contractDetails={contractDetails}
                                    onEdit={(stepIndex: number) => setStep(stepIndex)}
                                />
                            </Box>
                        )}
                    </Box>

                    {step !== 5 && (
                        <Box id="results-section">
                            {result ? (
                                <ResultsPanel
                                    result={result}
                                    onUpdate={handleCalculate}
                                    viewMode={step === 0 ? 'standard' : 'location-step'}
                                />
                            ) : (
                                <EmptyState />
                            )}
                        </Box>
                    )}
                </Box>


                <Box
                    sx={{
                        mt: 8,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: { xs: 2, sm: 3 },
                        pb: 4,
                        px: 2
                    }}
                >
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={handleCancelOrBack}
                        sx={{
                            minWidth: { xs: '100%', sm: 160 },
                            py: 1.5,
                            fontSize: '1.1rem',
                            borderColor: step > 0 ? '#3b82f6' : '#ef4444',
                            color: step > 0 ? '#3b82f6' : '#ef4444',
                            '&:hover': {
                                borderColor: step > 0 ? '#2563eb' : '#dc2626',
                                backgroundColor: step > 0 ? 'rgba(59, 130, 246, 0.04)' : 'rgba(239, 68, 68, 0.04)',
                            },
                        }}
                    >
                        {step > 0 ? 'Go Back' : 'Cancel'}
                    </Button>

                    <Button
                        variant="contained"
                        size="large"
                        type="button"
                        disabled={step === 0 && !result}
                        onClick={() => {
                            if (step === 0) {
                                setStep(1);
                                setCompletedStep(prev => Math.max(prev, 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                                handleNextStep();
                            }
                        }}
                        sx={{
                            minWidth: { xs: '100%', sm: 200 },
                            py: 1.5,
                            fontSize: '1.1rem',
                            backgroundColor: '#3b82f6',
                            '&:hover': {
                                backgroundColor: '#2563eb',
                            },
                        }}
                    >
                        {step < 5 ? 'Save and Continue' : 'Create Project'}
                    </Button>

                    {step > 0 && step < 5 && (
                        <Button
                            variant="text"
                            size="large"
                            onClick={handleSkipPrompt}
                            sx={{
                                minWidth: { xs: '100%', sm: 160 },
                                py: 1.5,
                                fontSize: '1.1rem',
                                color: 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                        >
                            Skip Now
                        </Button>
                    )}
                </Box>

                <Dialog
                    open={isSkipDialogOpen}
                    onClose={() => setIsSkipDialogOpen(false)}
                    aria-labelledby="skip-dialog-title"
                    aria-describedby="skip-dialog-description"
                >
                    <DialogTitle id="skip-dialog-title">
                        {"Skip this step?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="skip-dialog-description">
                            Are you sure you want to skip this section? You can always come back and provide these details later.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                        <Button onClick={() => setIsSkipDialogOpen(false)} color="inherit">
                            No, Stay
                        </Button>
                        <Button onClick={handleConfirmSkip} variant="contained" color="primary" autoFocus>
                            Yes, Skip
                        </Button>
                    </DialogActions>
                </Dialog>

            </Container >
        </Box >
    );
}
