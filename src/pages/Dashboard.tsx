import { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Button, Paper, IconButton, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Plus, Trash2, FolderOpen, Calendar, MapPin, Eye, Pencil, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProjects, deleteProject } from '../services/storageService';
import type { CalculationResult } from '../types';
import dayjs from 'dayjs';

export function Dashboard() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<CalculationResult[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const menuOpen = Boolean(anchorEl);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        const data = getProjects();
        // Sort by calculatedAt desc
        const sorted = data.sort((a, b) =>
            new Date(b.calculatedAt).getTime() - new Date(a.calculatedAt).getTime()
        );
        setProjects(sorted);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedProjectId(projectId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProjectId(null);
    };

    const handleDeleteRequest = () => {
        setDeleteDialogOpen(true);
        setAnchorEl(null); // Close menu but keep selectedProjectId
    };

    const handleConfirmDelete = () => {
        if (selectedProjectId) {
            deleteProject(selectedProjectId);
            loadProjects();
        }
        setDeleteDialogOpen(false);
        setSelectedProjectId(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedProjectId(null);
    };

    const handleView = () => {
        // TODO: Implement View Logic
        console.log('View project', selectedProjectId);
        handleMenuClose();
    };

    const handleEdit = () => {
        // TODO: Implement Edit Logic
        console.log('Edit project', selectedProjectId);
        handleMenuClose();
    };

    return (
        <Box
            sx={{
                py: 6,
                minHeight: '80vh',
                bgcolor: '#f8fafc'
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 3,
                        mb: 6,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                mb: 1
                            }}
                        >
                            Dashboard
                        </Typography>
                        <Typography color="text.secondary">
                            Manage your lien projects
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Plus size={20} />}
                        onClick={() => navigate('/calculator')}
                        sx={{
                            backgroundColor: '#3b82f6',
                            '&:hover': {
                                backgroundColor: '#2563eb',
                            },
                        }}
                    >
                        Create New Project
                    </Button>
                </Box>

                {projects.length === 0 ? (
                    <Box sx={{ mt: 10, textAlign: 'center' }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 8,
                                borderRadius: 4,
                                bgcolor: 'white',
                                border: '1px dashed #e2e8f0',
                                maxWidth: 600,
                                mx: 'auto'
                            }}
                        >
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: '#eff6ff',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3,
                                    color: '#3b82f6'
                                }}
                            >
                                <FolderOpen size={40} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                                No projects yet
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 4 }}>
                                Start by creating your first project to verify lien deadlines.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/calculator')}
                                sx={{
                                    backgroundColor: '#3b82f6',
                                    '&:hover': {
                                        backgroundColor: '#2563eb',
                                    },
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Create New Project
                            </Button>
                        </Paper>
                    </Box>
                ) : (
                    <Box>
                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="projects table">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 600 }}>Project Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Status / Role</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Deadlines</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Last Updated</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {projects.map((project) => (
                                        <TableRow
                                            key={project.id || Math.random()}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                '&:hover': { bgcolor: '#f8fafc' },
                                                cursor: 'pointer'
                                            }}
                                            onClick={(e) => {
                                                if (project.id) handleMenuClick(e, project.id);
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                                    {project.projectDetails.projectName || 'Untitled Project'}
                                                </Typography>

                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={project.projectDetails.role}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#eff6ff',
                                                        color: '#1e40af',
                                                        fontWeight: 500,
                                                        borderRadius: '6px'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <MapPin size={16} className="text-gray-400" />
                                                    <Typography variant="body2">{project.projectDetails.state}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {project.deadlines?.length || 0} Deadlines
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                                    <Calendar size={16} />
                                                    <Typography variant="body2">
                                                        {dayjs(project.calculatedAt).format('MMM D, YYYY')}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        if (project.id) handleMenuClick(e, project.id);
                                                    }}
                                                >
                                                    <MoreVertical size={20} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Menu
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={handleMenuClose}
                            PaperProps={{
                                elevation: 2,
                                sx: {
                                    minWidth: 180,
                                    mt: 1,
                                    borderRadius: 2,
                                    '& .MuiMenuItem-root': {
                                        px: 2,
                                        py: 1.5,
                                        gap: 1.5,
                                    }
                                }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleView}>
                                <Eye size={18} className="text-gray-500" />
                                <Typography variant="body2">View Details</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleEdit}>
                                <Pencil size={18} className="text-gray-500" />
                                <Typography variant="body2">Edit Project</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleDeleteRequest} sx={{ color: '#ef4444' }}>
                                <Trash2 size={18} />
                                <Typography variant="body2">Delete Project</Typography>
                            </MenuItem>
                        </Menu>

                        <Dialog
                            open={deleteDialogOpen}
                            onClose={handleCancelDelete}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Are you sure you want to delete this project?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    This action cannot be undone. All data associated with this project will be permanently removed.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                                <Button onClick={handleCancelDelete} color="inherit">
                                    Cancel
                                </Button>
                                <Button onClick={handleConfirmDelete} variant="contained" color="error" autoFocus>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
