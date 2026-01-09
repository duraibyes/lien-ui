import { useState } from 'react';
import { Box, Typography, Paper, Divider, Grid, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { MapPin, Calendar, ClipboardList, ShieldCheck, Edit2, FileText, FileCheck } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import type { CalculationResult, UploadedDocument, ContractDetails } from '../types';
import { DocumentCard } from './DocumentCard';

interface ReviewAndSubmitFormProps {
    result: CalculationResult | null;
    documents: UploadedDocument[];
    contractDetails: ContractDetails;
    onEdit: (step: number) => void;
}

export function ReviewAndSubmitForm({
    result,
    documents,
    contractDetails,
    onEdit
}: ReviewAndSubmitFormProps) {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [signature, setSignature] = useState('');
    const [signatureDate, setSignatureDate] = useState<Dayjs | null>(dayjs());

    if (!result) return null;

    const { projectDetails } = result;

    const SectionHeader = ({ icon: Icon, title, step }: { icon: any, title: string, step: number }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    p: 1,
                    borderRadius: 1.5,
                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={20} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {title}
                </Typography>
            </Box>
            <Button
                startIcon={<Edit2 size={16} />}
                onClick={() => onEdit(step)}
                sx={{ textTransform: 'none', fontWeight: 600, color: '#6366f1' }}
            >
                Edit
            </Button>
        </Box>
    );

    const DataRow = ({ label, value }: { label: string, value: string | undefined }) => (
        <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
                {value || 'Not provided'}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                        Review & Submit
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Please review all project details before finalizing your calculation and saving the project.
                    </Typography>
                </Box>

                <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 4, bgcolor: '#fff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: '#10b981',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ShieldCheck size={28} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Ready for Submission</Typography>
                            <Typography variant="body2" color="text.secondary">All mandatory fields have been completed.</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {/* Project Details & Dates */}
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <SectionHeader icon={ClipboardList} title="Project Details" step={0} />
                                <Box sx={{ pl: 1 }}>
                                    <DataRow label="Project Name" value={projectDetails.projectName} />
                                    <DataRow label="Project Type" value={projectDetails.projectType} />
                                    <DataRow label="Your Role" value={projectDetails.role} />
                                    <DataRow label="Contract With" value={projectDetails.contractWith} />
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <SectionHeader icon={Calendar} title="Important Dates" step={0} />
                                <Box sx={{ pl: 1 }}>
                                    <DataRow
                                        label="First Performance"
                                        value={projectDetails.firstFurnishingDate ? new Date(projectDetails.firstFurnishingDate).toLocaleDateString() : 'N/A'}
                                    />
                                    <DataRow
                                        label="Last Performance"
                                        value={projectDetails.lastFurnishingDate ? new Date(projectDetails.lastFurnishingDate).toLocaleDateString() : 'N/A'}
                                    />
                                    <DataRow
                                        label="Est. Completion"
                                        value={projectDetails.projectCompletionDate ? new Date(projectDetails.projectCompletionDate).toLocaleDateString() : 'N/A'}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider />

                        {/* Location & Scope */}
                        <Box>
                            <SectionHeader icon={MapPin} title="Location & Scope" step={1} />
                            <Grid container spacing={4} sx={{ pl: 1 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <DataRow label="State" value={projectDetails.state} />
                                    <DataRow label="Full Address" value="123 Construction Way, Austin, TX 78701" />
                                    <DataRow label="Jurisdiction" value="Travis County" />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <DataRow label="Scope of Work" value="Complete renovation of commercial building including electrical, plumbing, and HVAC systems. Installation of new flooring, painting, and fixture upgrades throughout the facility." />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        {/* Contract Details */}
                        <Box>
                            <SectionHeader icon={FileCheck} title="Contract Details" step={2} />
                            <Grid container spacing={4} sx={{ pl: 1 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <DataRow
                                        label="Base Contract Amount"
                                        value={`$${contractDetails.baseContractAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    />
                                    <DataRow
                                        label="Additional Costs"
                                        value={`$${contractDetails.additionalCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    />
                                    <DataRow
                                        label="Revised Cost"
                                        value={`$${(contractDetails.baseContractAmount + contractDetails.additionalCosts).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    />
                                    <DataRow
                                        label="Payments / Credits"
                                        value={`$${contractDetails.paymentsCredits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <DataRow
                                        label="Unpaid Balance"
                                        value={`$${((contractDetails.baseContractAmount + contractDetails.additionalCosts) - contractDetails.paymentsCredits).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    />
                                    <DataRow
                                        label="Job / Project No."
                                        value={contractDetails.jobNo.toString()}
                                    />
                                    <DataRow
                                        label="Waiver Amount"
                                        value={`$${contractDetails.waiverAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    />
                                    <DataRow
                                        label="Receivable Status"
                                        value={contractDetails.receivableStatus}
                                    />
                                    <DataRow
                                        label="Calculation Status"
                                        value={contractDetails.calculationStatus}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        {/* Documents */}
                        <Box>
                            <SectionHeader icon={FileText} title="Project Documents" step={3} />
                            {documents.length === 0 ? (
                                <Box sx={{
                                    textAlign: 'center',
                                    py: 4,
                                    bgcolor: '#f8fafc',
                                    borderRadius: 4,
                                    border: '2px dashed #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1.5
                                }}>
                                    <Typography variant="subtitle1" sx={{ color: '#1e293b', fontWeight: 700, mb: 0.5 }}>
                                        No documents uploaded yet
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Upload project contracts, invoices, or delivery tickets.
                                    </Typography>
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {documents.map((doc) => (
                                        <Grid key={doc.id} size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                                            <DocumentCard
                                                doc={doc}
                                                onView={() => { }}
                                                onDelete={() => { }}
                                                onDownload={() => { }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Box>
                </Paper>

                {/* Terms and Conditions */}
                <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 4, bgcolor: '#fff' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                        Terms and Conditions
                    </Typography>

                    <Box sx={{
                        p: 3,
                        bgcolor: '#f8fafc',
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        mb: 3,
                        maxHeight: 300,
                        overflowY: 'auto'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                            Liability Limitation
                        </Typography>

                        <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 2 }}>
                            By using this service, you acknowledge and agree that Lien Manager provides tools and information for construction lien management purposes only. The information provided is not legal advice and should not be construed as such.
                        </Typography>

                        <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 2 }}>
                            Lien Manager makes no warranties, express or implied, regarding the accuracy, completeness, or reliability of any information, deadlines, or calculations provided through this platform.
                        </Typography>

                        <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 2 }}>
                            You agree to hold Lien Manager harmless from any claims, damages, losses, or expenses arising from your use of this service. It is your responsibility to verify all information and consult with qualified legal counsel for legal matters.
                        </Typography>

                        <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                            The use of this platform does not create an attorney-client relationship. All deadlines and calculations are estimates and should be independently verified.
                        </Typography>
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                sx={{
                                    color: '#757575',
                                    '&.Mui-checked': {
                                        color: '#3b82f6',
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                I have read and agree to the terms and conditions stated above
                            </Typography>
                        }
                        sx={{ mb: 4 }}
                    />

                    <Divider sx={{ mb: 4 }} />

                    {/* Signature Section */}
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                        Customer Signature
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Full Name (Type to Sign)"
                                value={signature}
                                onChange={(e) => setSignature(e.target.value)}
                                placeholder="Enter your full name"
                                helperText="By typing your name, you are providing your electronic signature"
                                InputProps={{
                                    sx: {
                                        height: '56px'
                                    }
                                }}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        fontFamily: 'Brush Script MT, cursive',
                                        fontSize: '1.5rem',
                                        fontWeight: 600,
                                        height: '56px',
                                        padding: '0 14px'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <DatePicker
                                label="Signature Date"
                                value={signatureDate}
                                onChange={(newValue) => setSignatureDate(newValue)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        helperText: "Date of signature",
                                        InputProps: {
                                            sx: {
                                                height: '56px'
                                            }
                                        }
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>

                    {signature && signatureDate && (
                        <Box sx={{
                            mt: 3,
                            p: 2,
                            bgcolor: '#f0fdf4',
                            border: '1px solid #86efac',
                            borderRadius: 2
                        }}>
                            <Typography variant="body2" sx={{ color: '#166534', fontWeight: 600 }}>
                                ✓ Signature captured: {signature} on {signatureDate.format('MM/DD/YYYY')}
                            </Typography>
                        </Box>
                    )}
                </Paper>

                {/* Final Confirmation */}
                <Box sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: 'rgba(245, 158, 11, 0.05)',
                    border: '1px dashed rgba(245, 158, 11, 0.3)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2
                }}>
                    <ShieldCheck color="#f59e0b" size={48} style={{ marginTop: '2px' }} />
                    <Typography variant="body2" color="rgba(146, 64, 14, 0.8)" sx={{ lineHeight: 1.6 }}>
                        <strong>Final Confirmation:</strong> By clicking "Create Project", you confirm that all information is accurate, you have read and agreed to the terms and conditions, and you have provided your electronic signature. This will generate your official payment rights roadmap.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
