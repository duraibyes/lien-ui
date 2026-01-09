import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { Plus, Edit2, Trash2, Calendar, Bell, BellOff } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';
import type { ProjectTask } from '../types';

interface ProjectTasksFormProps {
    state: string;
    tasks: ProjectTask[];
    setTasks: (tasks: ProjectTask[]) => void;
}

export function ProjectTasksForm({ state: _state, tasks, setTasks }: ProjectTasksFormProps) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);

    // Form State for Dialog
    const [formAction, setFormAction] = useState('');
    const [formDueDate, setFormDueDate] = useState<Dayjs | null>(null);
    const [formDateCompleted, setFormDateCompleted] = useState<Dayjs | null>(null);
    const [formEmailNotification, setFormEmailNotification] = useState(true);
    const [formComments, setFormComments] = useState('');

    const actionTypes = [
        'Preliminary Notice Filing',
        'Mechanics Lien Filing',
        'Notice of Intent',
        'Bond Claim Filing',
        'Lien Release request',
        'Site Inspection',
        'Material Delivery Verification',
        'Payment Application Submission',
        'Other'
    ];

    const handleOpenDialog = (task?: ProjectTask) => {
        if (task) {
            setEditingTask(task);
            setFormAction(task.action);
            setFormDueDate(task.dueDate);
            setFormDateCompleted(task.dateCompleted);
            setFormEmailNotification(task.emailNotification);
            setFormComments(task.comments);
        } else {
            setEditingTask(null);
            setFormAction('');
            setFormDueDate(null);
            setFormDateCompleted(null);
            setFormEmailNotification(true);
            setFormComments('');
        }
        setIsDialogOpen(true);
    };

    const handleSaveTask = () => {
        if (!formAction) return;

        const taskData: ProjectTask = {
            id: editingTask ? editingTask.id : Math.random().toString(36).substr(2, 9),
            action: formAction,
            dueDate: formDueDate,
            dateCompleted: formDateCompleted,
            emailNotification: formEmailNotification,
            comments: formComments
        };

        if (editingTask) {
            setTasks(tasks.map(t => t.id === editingTask.id ? taskData : t));
        } else {
            setTasks([...tasks, taskData]);
        }
        setIsDialogOpen(false);
    };

    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const formatDate = (date: Dayjs | null) => {
        return date ? date.format('MM/DD/YYYY') : '-';
    };

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Tasks List Section */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                Project Tasks
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<Plus size={18} />}
                            onClick={() => handleOpenDialog()}
                            sx={{
                                bgcolor: '#6366f1',
                                '&:hover': { bgcolor: '#4f46e5' },
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2
                            }}
                        >
                            Add New Task
                        </Button>
                    </Box>

                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Action</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Due Date</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Date Completed</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Email Notification</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Comments</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                            No tasks created yet. Click "Add New Task" to begin.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tasks.map((task) => (
                                        <TableRow key={task.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{task.action}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Calendar size={14} color="#64748b" />
                                                    {formatDate(task.dueDate)}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: task.dateCompleted ? '#10b981' : 'text.secondary', fontWeight: task.dateCompleted ? 600 : 400 }}>
                                                    {formatDate(task.dateCompleted)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {task.emailNotification ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#10b981' }}>
                                                            <Bell size={14} />
                                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>ON</Typography>
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8' }}>
                                                            <BellOff size={14} />
                                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>OFF</Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 200 }}>
                                                <Tooltip title={task.comments}>
                                                    <Typography variant="body2" sx={{
                                                        color: 'text.secondary',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {task.comments || '-'}
                                                    </Typography>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                                    <IconButton size="small" onClick={() => handleOpenDialog(task)} sx={{ color: '#6366f1' }}>
                                                        <Edit2 size={16} />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => handleDeleteTask(task.id)} sx={{ color: '#ef4444' }}>
                                                        <Trash2 size={16} />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            {/* Task Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                        <TextField
                            select
                            label="Action Type"
                            fullWidth
                            value={formAction}
                            onChange={(e) => setFormAction(e.target.value)}
                            required
                        >
                            {actionTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </TextField>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <DatePicker
                                label="Due Date"
                                value={formDueDate}
                                onChange={(val) => setFormDueDate(val)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                            <DatePicker
                                label="Date Completed"
                                value={formDateCompleted}
                                onChange={(val) => setFormDateCompleted(val)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Box>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formEmailNotification}
                                    onChange={(e) => setFormEmailNotification(e.target.checked)}
                                    sx={{
                                        color: '#757575',
                                        '&.Mui-checked': {
                                            color: '#3b82f6',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Enable Email Notifications</Typography>
                                    <Typography variant="caption" color="text.secondary">Send reminders before the due date</Typography>
                                </Box>
                            }
                        />

                        <TextField
                            label="Comments"
                            multiline
                            rows={3}
                            fullWidth
                            value={formComments}
                            onChange={(e) => setFormComments(e.target.value)}
                            placeholder="Add any specific notes or instructions..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1 }}>
                    <Button onClick={() => setIsDialogOpen(false)} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={handleSaveTask}
                        disabled={!formAction}
                        sx={{
                            bgcolor: '#3b82f6',
                            '&:hover': { bgcolor: '#2563eb' },
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 4,
                            borderRadius: 2
                        }}
                    >
                        {editingTask ? 'Update Task' : 'Add Task'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
