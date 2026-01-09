import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Divider,
    List,
    ListItem,
    IconButton,
    Paper,
    Button,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    useTheme,
    useMediaQuery,
    Chip,
    Autocomplete,
    Checkbox,
    Grid
} from '@mui/material';
import {
    FileText,
    Upload,
    X,
    User,
    Plus,
    Trash2,
    Building2,
    Globe,
    PlusCircle,
    Edit2,
    Search,
    FolderOpen,
    Download
} from 'lucide-react';
import { DocumentCard } from './DocumentCard';
import type { UploadedDocument, SavedContact, CompanyInfo, ContactRow } from '../types';

interface ContactsAndDocumentsFormProps {
    documents: UploadedDocument[];
    setDocuments: React.Dispatch<React.SetStateAction<UploadedDocument[]>>;
    savedCustomerContacts: SavedContact[];
    setSavedCustomerContacts: React.Dispatch<React.SetStateAction<SavedContact[]>>;
    savedProjectContacts: SavedContact[];
    setSavedProjectContacts: React.Dispatch<React.SetStateAction<SavedContact[]>>;
}

interface ExistingProjectContact {
    id: string;
    name: string;
    role: string;
    company: string;
    type: string;
}

type ContactType = 'customer' | 'project';

export function ContactsAndDocumentsForm({
    documents,
    setDocuments,
    savedCustomerContacts,
    setSavedCustomerContacts,
    savedProjectContacts,
    setSavedProjectContacts
}: ContactsAndDocumentsFormProps) {
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'));
    const [selectedCustomer, setSelectedCustomer] = useState<string>('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingContactId, setEditingContactId] = useState<string | null>(null);
    const [activeContactType, setActiveContactType] = useState<ContactType>('customer');
    const [isExpanded, setIsExpanded] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'info' | 'warning' | 'error';
        doc?: UploadedDocument;
    }>({
        open: false,
        message: '',
        severity: 'info'
    });
    const DOC_LIMIT = 6;

    // Multi-select with Search for Project Contacts
    const [selectedProjectItems, setSelectedProjectItems] = useState<ExistingProjectContact[]>([]);

    // Mock Data for Existing Project Contacts
    const existingProjectContacts: ExistingProjectContact[] = [
        { id: 'epc-1', name: 'Mark Wilson', role: 'Superintendent', company: 'BuildIt Solutions', type: 'General Contractor' },
        { id: 'epc-2', name: 'Sarah Miller', role: 'Site Lead', company: 'BuildIt Solutions', type: 'General Contractor' },
        { id: 'epc-3', name: 'Robert Chen', role: 'Safety Inspector', company: 'SecureCheck Inc', type: 'Subcontractor' },
        { id: 'epc-4', name: 'Alice Wong', role: 'Architect', company: 'DesignCraft', type: 'Architect' },
        { id: 'epc-5', name: 'David Smith', role: 'Owner Rep', company: 'Asset Group', type: 'Owner' }
    ];

    // Effect to pre-select existing contacts found in the initial data
    useEffect(() => {
        const sarah = existingProjectContacts.find(c => c.id === 'epc-2');
        if (sarah) {
            setSelectedProjectItems([sarah]);
        }
    }, []);

    // Cleanup generated Object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            documents.forEach(doc => {
                if (doc.url && doc.url.startsWith('blob:')) {
                    URL.revokeObjectURL(doc.url);
                }
            });
        };
    }, []);

    // Effect to sync selected existing contacts to the saved list
    useEffect(() => {
        syncExistingToSaved(selectedProjectItems);
    }, [selectedProjectItems]);

    const syncExistingToSaved = (selected: ExistingProjectContact[]) => {
        setSavedProjectContacts(prev => {
            // Keep manually created contacts + sync selected ones
            const manualContacts = prev.filter(c => !c.id.startsWith('epc-'));
            const newlySelected = selected.map(s => ({
                id: s.id,
                companyId: 'existing',
                companyName: s.company,
                title: 'Professional',
                role: s.role,
                firstName: s.name.split(' ')[0],
                lastName: s.name.split(' ').slice(1).join(' '),
                email: `${s.name.toLowerCase().replace(' ', '.')}@example.com`,
                phone: '(555) 000-0000',
                fullCompanyInfo: {
                    name: s.company,
                    website: '',
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    phone: '',
                    fax: ''
                },
                fullContactRows: []
            }));
            return [...manualContacts, ...newlySelected];
        });
    };

    const projectRoleOptions = ['Superintendent', 'Site Lead', 'Safety Inspector', 'Quality Control', 'Foreman', 'Project Manager', 'Other'];

    // Dialog State
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
        name: '',
        website: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        fax: ''
    });

    const [contactRows, setContactRows] = useState<ContactRow[]>([
        { id: '1', title: '', firstName: '', lastName: '', email: '', directPhone: '', cell: '', role: '' }
    ]);

    // Mock Data
    const existingCustomers = [
        { id: '1', name: 'ABC Construction' },
        { id: '2', name: 'BuildIt Solutions' },
        { id: '3', name: 'Cornerstone Developers' }
    ];

    const stateOptions = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    const titleOptions = ['CEO', 'CFO', 'Credit Manger', 'Project Manager', 'Corporate Counsel', 'A/R Manager', 'Other'];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newDocs: UploadedDocument[] = Array.from(e.target.files).map(file => {
                return {
                    id: Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    size: file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : `${(file.size / 1024).toFixed(1)} KB`,
                    type: file.type,
                    url: URL.createObjectURL(file), // Generate URL for ALL files to support download
                };
            });
            setDocuments([...documents, ...newDocs]);
        }
    };

    const handleOpenCreateDialog = (type: ContactType) => {
        setEditingContactId(null);
        setActiveContactType(type);
        setCompanyInfo({
            name: '',
            website: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            phone: '',
            fax: ''
        });
        setContactRows([
            { id: '1', title: '', firstName: '', lastName: '', email: '', directPhone: '', cell: '', role: '' }
        ]);
        setIsCreateDialogOpen(true);
    };

    const handleEditContact = (contact: SavedContact, type: ContactType) => {
        setEditingContactId(contact.id);
        setActiveContactType(type);
        setCompanyInfo(contact.fullCompanyInfo);
        setContactRows(contact.fullContactRows);
        setIsCreateDialogOpen(true);
    };

    const handleDeleteContact = (id: string, type: ContactType) => {
        if (type === 'customer') {
            setSavedCustomerContacts(prev => prev.filter(c => c.id !== id));
        } else {
            setSavedProjectContacts(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleSaveContact = () => {
        const newContacts: SavedContact[] = contactRows.map(row => ({
            id: editingContactId ? editingContactId : Math.random().toString(36).substr(2, 9),
            companyId: Math.random().toString(36).substr(2, 5),
            companyName: companyInfo.name,
            title: row.title,
            role: row.role,
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            phone: row.directPhone || row.cell,
            fullCompanyInfo: companyInfo,
            fullContactRows: contactRows
        }));

        if (activeContactType === 'customer') {
            if (editingContactId) {
                setSavedCustomerContacts(prev => [...prev.filter(c => c.id !== editingContactId), ...newContacts]);
            } else {
                setSavedCustomerContacts(prev => [...prev, ...newContacts]);
            }
        } else {
            if (editingContactId) {
                setSavedProjectContacts(prev => [...prev.filter(c => c.id !== editingContactId), ...newContacts]);
            } else {
                setSavedProjectContacts(prev => [...prev, ...newContacts]);
            }
        }

        setIsCreateDialogOpen(false);
    };

    const removeDocument = (id: string) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    const handleDownload = (doc: UploadedDocument) => {
        if (!doc.url) {
            setNotification({
                open: true,
                message: `Download link missing for ${doc.name}. Try re-uploading.`,
                severity: 'error'
            });
            return;
        }

        try {
            const link = document.createElement('a');
            link.href = doc.url;
            link.setAttribute('download', doc.name);
            link.setAttribute('target', '_blank');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();

            // Use a short timeout to ensure the browser captures the click before removal
            setTimeout(() => {
                if (document.body.contains(link)) {
                    document.body.removeChild(link);
                }
            }, 150);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback for extreme cases
            window.open(doc.url, '_blank');
        }
    };

    const handleViewDocument = (doc: UploadedDocument) => {
        const canPreview = doc.type.startsWith('image/') ||
            doc.type === 'application/pdf' ||
            doc.type.startsWith('text/');

        if (canPreview && doc.url) {
            setPreviewDoc(doc);
        } else {
            setNotification({
                open: true,
                message: `Preview not available for ${doc.name}.`,
                severity: 'info',
                doc: doc
            });
        }
    };

    const addContactRow = () => {
        setContactRows(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            title: '', firstName: '', lastName: '', email: '', directPhone: '', cell: '', role: ''
        }]);
    };

    const removeContactRow = (id: string) => {
        if (contactRows.length > 1) {
            setContactRows(prev => prev.filter(row => row.id !== id));
        }
    };

    const updateContactRow = (id: string, field: keyof ContactRow, value: string) => {
        setContactRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const renderContactTable = (contacts: SavedContact[], type: ContactType) => {
        if (contacts.length === 0) return null;

        return (
            <Box sx={{ mt: 2 }}>
                <Box sx={{
                    display: { xs: 'none', md: 'grid' },
                    gridTemplateColumns: type === 'project' ? '1.5fr 1.5fr 1.5fr 1.2fr 1.5fr 100px' : '1.5fr 1.5fr 1.2fr 1.5fr 100px',
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    bgcolor: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Name</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Company</Typography>
                    {type === 'project' && <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Role</Typography>}
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Phone</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Email</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', textAlign: 'center' }}>Action</Typography>
                </Box>

                <List sx={{ p: 0 }}>
                    {contacts.map((contact) => (
                        <ListItem
                            key={contact.id}
                            sx={{
                                px: 2,
                                py: 2,
                                borderBottom: '1px solid #f1f5f9',
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: type === 'project' ? '1.5fr 1.5fr 1.5fr 1.2fr 1.5fr 100px' : '1.5fr 1.5fr 1.2fr 1.5fr 100px' },
                                gap: { xs: 1, md: 2 },
                                alignItems: 'center',
                                '&:hover': { bgcolor: '#fbfcfd' }
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {contact.firstName} {contact.lastName}
                                <Typography variant="caption" display="block" color="text.secondary">
                                    {contact.title}
                                </Typography>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {contact.companyName}
                            </Typography>
                            {type === 'project' && (
                                <Box>
                                    <Chip label={contact.role || 'Unassigned'} size="small" variant="outlined" color="primary" />
                                </Box>
                            )}
                            <Typography variant="body2" color="text.secondary">
                                {contact.phone}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                                {contact.email}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <IconButton size="small" color="primary" onClick={() => handleEditContact(contact, type)}>
                                    <Edit2 size={16} />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => handleDeleteContact(contact.id, type)}>
                                    <Trash2 size={16} />
                                </IconButton>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Section 1: Customer Contacts */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <User size={24} color="#3b82f6" />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                Customer Contacts
                            </Typography>
                        </Box>
                        <Button
                            startIcon={<Plus size={18} />}
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenCreateDialog('customer')}
                            sx={{ borderRadius: 2 }}
                        >
                            Create Contact
                        </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Select an existing customer or create a new contact record.
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
                        <TextField
                            select
                            label="Select Existing Customer"
                            fullWidth
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {existingCustomers.map((cust) => (
                                <MenuItem key={cust.id} value={cust.id}>
                                    {cust.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {renderContactTable(savedCustomerContacts, 'customer')}
                </Box>

                <Divider />

                {/* Section 2: Project Contacts */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <User size={24} color="#10b981" />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                Project Contacts
                            </Typography>
                        </Box>
                        <Button
                            startIcon={<Plus size={18} />}
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenCreateDialog('project')}
                            sx={{ borderRadius: 2 }}
                        >
                            Create Contact
                        </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Search and select on-site personnel or project managers involved.
                    </Typography>

                    {/* Integrated Searchable Multi-select for Project Contacts */}
                    <Box sx={{ mb: 4 }}>
                        <Autocomplete
                            multiple
                            id="project-contacts-autocomplete"
                            options={existingProjectContacts}
                            disableCloseOnSelect
                            value={selectedProjectItems}
                            onChange={(_, newValue) => setSelectedProjectItems(newValue)}
                            getOptionLabel={(option) => `${option.name} : ${option.role} (${option.company}) [${option.type}]`}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={<Box sx={{ width: 18, height: 18, border: '1px solid #cbd5e1', borderRadius: 0.5 }} />}
                                        checkedIcon={<Box sx={{ width: 18, height: 18, bgcolor: 'primary.main', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} color="white" /></Box>}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {option.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {option.role} • {option.company} • <Chip label={option.type} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                                        </Typography>
                                    </Box>
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Existing Project Contacts"
                                    placeholder="Type name, role, company or contact type..."
                                    size="small"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <Search size={16} color="#94a3b8" style={{ marginLeft: 8 }} />
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => (
                                    <Chip
                                        label={option.name}
                                        {...getTagProps({ index })}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        key={option.id}
                                    />
                                ))
                            }
                            sx={{
                                '& .MuiAutocomplete-inputRoot': {
                                    bgcolor: '#fff',
                                    '&:hover': { bgcolor: '#fbfcfd' }
                                }
                            }}
                        />
                    </Box>

                    {renderContactTable(savedProjectContacts, 'project')}
                </Box>

                <Divider />

                {/* Section 3: Document Upload */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <FileText size={24} color="#6366f1" />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                Project Documents
                            </Typography>
                        </Box>
                        {documents.length > 0 && (
                            <Tooltip title="Download All Documents">
                                <Button
                                    startIcon={<Download size={18} />}
                                    size="small"
                                    onClick={() => documents.forEach(doc => handleDownload(doc))}
                                    sx={{ color: '#6366f1', fontWeight: 600 }}
                                >
                                    Download All
                                </Button>
                            </Tooltip>
                        )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Upload and categorize contracts, invoices, or delivery tickets related to this project.
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 3,
                                borderStyle: 'dashed',
                                borderWidth: 2,
                                borderColor: '#e2e8f0',
                                bgcolor: '#f8fafc',
                                borderRadius: 4,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    borderColor: '#6366f1',
                                    bgcolor: 'rgba(99, 102, 241, 0.02)',
                                    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.1)',
                                    transform: 'translateY(-2px)'
                                },
                            }}
                            component="label"
                        >
                            <input
                                type="file"
                                multiple
                                hidden
                                onChange={handleFileChange}
                            />
                            <Box sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                bgcolor: 'rgba(99, 102, 241, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                transition: 'all 0.3s'
                            }}>
                                <Upload size={28} color="#6366f1" />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                                Drag & drop documents here
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 350, mx: 'auto' }}>
                                Securely upload and store your project contracts, invoices and tickets.
                                Supports PDF, JPG, PNG or DOCX (Max 25MB each).
                            </Typography>
                            <Button
                                component="span"
                                variant="contained"
                                disableElevation
                                sx={{
                                    bgcolor: '#6366f1',
                                    '&:hover': { bgcolor: '#4f46e5' },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 4
                                }}
                            >
                                Browse Files
                            </Button>
                        </Paper>

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
                                <Box sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '50%',
                                    bgcolor: '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FolderOpen size={28} color="#94a3b8" />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ color: '#1e293b', fontWeight: 700, mb: 0.5 }}>
                                        No documents uploaded yet
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 350, mx: 'auto', px: 2 }}>
                                        Upload project contracts, invoices, or delivery tickets to get started.
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Box>
                                <Grid container spacing={2}>
                                    {(isExpanded ? documents : documents.slice(0, DOC_LIMIT)).map((doc) => (
                                        <Grid key={doc.id} size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                                            <DocumentCard
                                                doc={doc}
                                                onView={handleViewDocument}
                                                onDelete={removeDocument}
                                                onDownload={handleDownload}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>

                                {documents.length > DOC_LIMIT && (
                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="text"
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            sx={{
                                                color: '#6366f1',
                                                fontWeight: 600,
                                                '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.04)' }
                                            }}
                                        >
                                            {isExpanded ? 'Show Less' : `View More (${documents.length - DOC_LIMIT} additional)`}
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Create Contact Dialog */}
            <Dialog
                open={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                    {editingContactId ? `Edit ${activeContactType === 'customer' ? 'Customer' : 'Project'} Contact` : `Create New ${activeContactType === 'customer' ? 'Customer' : 'Project'} Contact`}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Building2 size={20} color="#3b82f6" /> Company Information
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                            <TextField
                                label="Company"
                                fullWidth
                                value={companyInfo.name}
                                onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                            />
                            <TextField
                                label="Website"
                                fullWidth
                                placeholder="https://"
                                value={companyInfo.website}
                                onChange={(e) => setCompanyInfo(prev => ({ ...prev, website: e.target.value }))}
                                InputProps={{
                                    startAdornment: <Box sx={{ mr: 1, color: 'text.secondary', display: 'flex' }}><Globe size={18} /></Box>,
                                }}
                            />
                            <TextField
                                label="Address"
                                fullWidth
                                multiline
                                rows={2}
                                value={companyInfo.address}
                                onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
                                sx={{ gridColumn: { md: 'span 2' } }}
                            />
                            <TextField
                                label="City"
                                fullWidth
                                value={companyInfo.city}
                                onChange={(e) => setCompanyInfo(prev => ({ ...prev, city: e.target.value }))}
                            />
                            <TextField
                                select
                                label="State"
                                fullWidth
                                value={companyInfo.state}
                                onChange={(e) => setCompanyInfo(prev => ({ ...prev, state: e.target.value }))}
                            >
                                {stateOptions.map(state => <MenuItem key={state} value={state}>{state}</MenuItem>)}
                            </TextField>
                            <TextField
                                label="Zip"
                                fullWidth
                                value={companyInfo.zip}
                                onChange={(e) => setCompanyInfo(prev => ({ ...prev, zip: e.target.value }))}
                            />
                            <TextField
                                label="Phone"
                                fullWidth
                                value={companyInfo.phone}
                                onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
                            />
                            <TextField
                                label="Fax"
                                fullWidth
                                value={companyInfo.fax}
                                onChange={(e) => setCompanyInfo(prev => ({ ...prev, fax: e.target.value }))}
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <User size={20} color="#10b981" /> Individual Contacts
                            </Typography>
                            <Button
                                startIcon={<PlusCircle size={18} />}
                                onClick={addContactRow}
                                variant="text"
                                color="primary"
                            >
                                Add New Row
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Desktop Header Row */}
                            <Box sx={{
                                display: { xs: 'none', md: 'grid' },
                                gridTemplateColumns: activeContactType === 'project'
                                    ? '120px 1fr 1fr 1fr 1.2fr 1fr 1fr 60px'
                                    : '120px 1fr 1fr 1.5fr 1.2fr 1.2fr 60px',
                                gap: 2,
                                px: 2,
                                py: 1.5,
                                bgcolor: '#f1f5f9',
                                borderRadius: 2,
                                border: '1px solid #e2e8f0'
                            }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Title</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>First Name</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Last Name</Typography>
                                {activeContactType === 'project' && <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Role</Typography>}
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Email</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Direct Phone</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Cell</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', textAlign: 'center' }}>Action</Typography>
                            </Box>

                            {/* Contact Rows */}
                            {contactRows.map((row) => (
                                <Paper
                                    key={row.id}
                                    variant="outlined"
                                    sx={{
                                        p: { xs: 2.5, md: 1.5 },
                                        borderRadius: 2,
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: '1fr',
                                            sm: '1fr 1fr',
                                            md: activeContactType === 'project'
                                                ? '120px 1fr 1fr 1fr 1.2fr 1fr 1fr 60px'
                                                : '120px 1fr 1fr 1.5fr 1.2fr 1.2fr 60px'
                                        },
                                        gap: 2,
                                        alignItems: 'center',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            borderColor: 'primary.light',
                                            bgcolor: 'rgba(59, 130, 246, 0.01)'
                                        }
                                    }}
                                >
                                    <TextField
                                        select
                                        size="small"
                                        label={!isMd ? 'Title' : ''}
                                        value={row.title}
                                        onChange={(e) => updateContactRow(row.id, 'title', e.target.value)}
                                        fullWidth
                                        variant={!isMd ? 'outlined' : 'standard'}
                                    >
                                        {titleOptions.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                    </TextField>
                                    <TextField
                                        size="small"
                                        label={!isMd ? 'First Name' : ''}
                                        placeholder="First Name"
                                        value={row.firstName}
                                        onChange={(e) => updateContactRow(row.id, 'firstName', e.target.value)}
                                        fullWidth
                                        variant={!isMd ? 'outlined' : 'standard'}
                                    />
                                    <TextField
                                        size="small"
                                        label={!isMd ? 'Last Name' : ''}
                                        placeholder="Last Name"
                                        value={row.lastName}
                                        onChange={(e) => updateContactRow(row.id, 'lastName', e.target.value)}
                                        fullWidth
                                        variant={!isMd ? 'outlined' : 'standard'}
                                    />
                                    {activeContactType === 'project' && (
                                        <TextField
                                            select
                                            size="small"
                                            label={!isMd ? 'Project Role' : ''}
                                            value={row.role}
                                            onChange={(e) => updateContactRow(row.id, 'role', e.target.value)}
                                            fullWidth
                                            variant={!isMd ? 'outlined' : 'standard'}
                                        >
                                            {projectRoleOptions.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
                                        </TextField>
                                    )}
                                    <TextField
                                        size="small"
                                        label={!isMd ? 'Email' : ''}
                                        placeholder="email@example.com"
                                        value={row.email}
                                        onChange={(e) => updateContactRow(row.id, 'email', e.target.value)}
                                        fullWidth
                                        variant={!isMd ? 'outlined' : 'standard'}
                                    />
                                    <TextField
                                        size="small"
                                        label={!isMd ? 'Direct Phone' : ''}
                                        placeholder="(000) 000-0000"
                                        value={row.directPhone}
                                        onChange={(e) => updateContactRow(row.id, 'directPhone', e.target.value)}
                                        fullWidth
                                        variant={!isMd ? 'outlined' : 'standard'}
                                    />
                                    <TextField
                                        size="small"
                                        label={!isMd ? 'Cell' : ''}
                                        placeholder="(000) 000-0000"
                                        value={row.cell}
                                        onChange={(e) => updateContactRow(row.id, 'cell', e.target.value)}
                                        fullWidth
                                        variant={!isMd ? 'outlined' : 'standard'}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Tooltip title="Delete Row">
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => removeContactRow(row.id)}
                                                disabled={contactRows.length === 1}
                                                sx={{
                                                    bgcolor: { xs: 'rgba(239, 68, 68, 0.08)', md: 'transparent' },
                                                    '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' }
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc' }}>
                    <Button onClick={() => setIsCreateDialogOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveContact}
                        variant="contained"
                        color="primary"
                        sx={{ px: 4 }}
                    >
                        {editingContactId ? 'Update Contact' : 'Create Contact'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Document Preview Dialog */}
            <Dialog
                open={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: { height: '80vh', borderRadius: 4, overflow: 'hidden' }
                }}
            >
                <DialogTitle sx={{
                    fontWeight: 700,
                    bgcolor: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <FileText size={20} color="#6366f1" />
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                            {previewDoc?.name}
                        </Typography>
                    </Box>
                    <IconButton onClick={() => setPreviewDoc(null)} size="small">
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, bgcolor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {previewDoc?.url ? (
                        previewDoc.type.startsWith('image/') ? (
                            <Box
                                component="img"
                                src={previewDoc.url}
                                alt={previewDoc.name}
                                sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', p: 4 }}
                            />
                        ) : previewDoc.type === 'application/pdf' ? (
                            <iframe
                                src={`${previewDoc.url}#toolbar=0`}
                                title={previewDoc.name}
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                            />
                        ) : (
                            <Box sx={{ textAlign: 'center', p: 4 }}>
                                <FileText size={64} color="#94a3b8" />
                                <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                                    Preview not available for this file type in-browser.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<Upload size={18} />}
                                    onClick={() => handleDownload(previewDoc)}
                                    sx={{ mt: 2 }}
                                >
                                    Download to View
                                </Button>
                            </Box>
                        )
                    ) : (
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <Typography color="error">Document URL not found.</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <Button
                        startIcon={<Download size={18} />}
                        onClick={() => previewDoc && handleDownload(previewDoc)}
                        variant="outlined"
                    >
                        Download
                    </Button>
                    <Button onClick={() => setPreviewDoc(null)} variant="contained" disableElevation sx={{ bgcolor: '#6366f1' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Premium Preview Notification Dialog (Skip Now Style) */}
            <Dialog
                open={notification.open}
                onClose={() => setNotification({ ...notification, open: false })}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1,
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, pb: 1, color: '#0f172a' }}>
                    Preview not available
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1, lineHeight: 1.6 }}>
                        {notification.message}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={() => setNotification({ ...notification, open: false })}
                        sx={{
                            color: '#0f172a',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                        }}
                    >
                        Close
                    </Button>
                    {notification.doc && (
                        <Button
                            variant="contained"
                            disableElevation
                            onClick={() => {
                                if (notification.doc) handleDownload(notification.doc);
                                setNotification({ ...notification, open: false });
                            }}
                            sx={{
                                bgcolor: '#1e293b',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                borderRadius: 2,
                                '&:hover': { bgcolor: '#0f172a' }
                            }}
                        >
                            Download
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}
