import { Box, Typography, TextField, Divider, MenuItem, InputAdornment } from '@mui/material';
import type { ContractDetails } from '../types';

interface ContractDetailsFormProps {
    contractDetails: ContractDetails;
    setContractDetails: React.Dispatch<React.SetStateAction<ContractDetails>>;
}

export function ContractDetailsForm({ contractDetails, setContractDetails }: ContractDetailsFormProps) {
    // Auto-calculations
    const revisedCost = contractDetails.baseContractAmount + contractDetails.additionalCosts;
    const unpaidBalance = revisedCost - contractDetails.paymentsCredits;

    const receivableStatusOptions = [
        'Preliminary Notice', 'Lien', 'Bond', 'Collection', 'Litigation',
        'Bankruptcy', 'Collected', 'Paid', 'Written Off', 'Settled'
    ];

    const calculationStatusOptions = ['In Progress', 'Completed'];

    const handleChange = (field: keyof ContractDetails, value: number | string) => {
        setContractDetails(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Section 1: Contract Details */}
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                        Contract Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Manage the financial aspects and scope of the contract.
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                        <TextField
                            label="Base Contract Amount"
                            type="number"
                            fullWidth
                            value={contractDetails.baseContractAmount}
                            onChange={(e) => handleChange('baseContractAmount', Number(e.target.value))}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Additional Costs"
                            type="number"
                            fullWidth
                            value={contractDetails.additionalCosts}
                            onChange={(e) => handleChange('additionalCosts', Number(e.target.value))}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mt: 3 }}>
                        <TextField
                            label="Revised Cost"
                            fullWidth
                            value={revisedCost.toFixed(2)}
                            InputProps={{
                                readOnly: true,
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)' }}
                        />
                        <TextField
                            label="Payments / Credits"
                            type="number"
                            fullWidth
                            value={contractDetails.paymentsCredits}
                            onChange={(e) => handleChange('paymentsCredits', Number(e.target.value))}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mt: 3 }}>
                        <TextField
                            label="Unpaid Balance"
                            fullWidth
                            value={unpaidBalance.toFixed(2)}
                            InputProps={{
                                readOnly: true,
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)' }}
                        />
                        <TextField
                            label="Your Job / Project No."
                            type="number"
                            fullWidth
                            value={contractDetails.jobNo}
                            onChange={(e) => handleChange('jobNo', Number(e.target.value))}
                            inputProps={{ min: 0 }}
                        />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mt: 3 }}>
                        <TextField
                            label="Waiver Amount"
                            type="number"
                            fullWidth
                            value={contractDetails.waiverAmount}
                            onChange={(e) => handleChange('waiverAmount', Number(e.target.value))}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Box>
                </Box>

                <Divider />

                {/* Section 2: Status Tracking */}
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                        Project Status
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mt: 3 }}>
                        <TextField
                            select
                            label="Receivable Status"
                            fullWidth
                            value={contractDetails.receivableStatus}
                            onChange={(e) => handleChange('receivableStatus', e.target.value)}
                        >
                            {receivableStatusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Deadline Calculation Status"
                            fullWidth
                            value={contractDetails.calculationStatus}
                            onChange={(e) => handleChange('calculationStatus', e.target.value)}
                        >
                            {calculationStatusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
