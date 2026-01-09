import { Box, Typography, TextField, MenuItem, Divider } from '@mui/material';

interface ProjectLocationFormProps {
    state: string;
}

export function ProjectLocationForm({ state }: ProjectLocationFormProps) {
    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                        Project Location
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Specify the jurisdiction and physical address where the work is being performed.
                    </Typography>
                </Box>


                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    <TextField
                        label="State"
                        value={state}
                        disabled
                        fullWidth
                        variant="filled"
                        sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)' }}
                    />

                    <TextField
                        label="Address Line"
                        fullWidth
                        placeholder="123 Construction Way"
                    />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    <TextField
                        select
                        label="City"
                        fullWidth
                        defaultValue=""
                    >
                        <MenuItem value="austin">Austin</MenuItem>
                        <MenuItem value="dallas">Dallas</MenuItem>
                        <MenuItem value="houston">Houston</MenuItem>
                        <MenuItem value="san_antonio">San Antonio</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </TextField>

                    <TextField
                        select
                        label="County"
                        fullWidth
                        defaultValue=""
                    >
                        <MenuItem value="travis">Travis</MenuItem>
                        <MenuItem value="dallas">Dallas</MenuItem>
                        <MenuItem value="harris">Harris</MenuItem>
                        <MenuItem value="bexar">Bexar</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </TextField>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    <TextField
                        label="Zip Code"
                        fullWidth
                        placeholder="12345"
                    />
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                        Scope of Work
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Provide details about the labor and materials furnished for this project.
                    </Typography>

                    <TextField
                        label="Description of Labor & Materials"
                        multiline
                        rows={6}
                        fullWidth
                        placeholder="Detailed description of materials, services, and/or labor furnished to the project..."
                    />
                </Box>
            </Box>
        </Box>
    );
}
