import { Box, Typography, Card, CardActionArea, CardContent, IconButton, Tooltip } from '@mui/material';
import { Eye, Trash2, Download, FileText, FileSpreadsheet, FilePieChart, FileImage, File } from 'lucide-react';

interface UploadedDocument {
    id: string;
    name: string;
    size: string;
    type: string;
    url?: string;
}

interface DocumentCardProps {
    doc: UploadedDocument;
    onView: (doc: UploadedDocument) => void;
    onDelete: (id: string) => void;
    onDownload: (doc: UploadedDocument) => void;
}

const getFileDetails = (name: string, type: string) => {
    const extension = name.split('.').pop()?.toLowerCase();

    // PDF
    if (type === 'application/pdf' || extension === 'pdf') {
        return {
            icon: <FileText size={32} color="#ef4444" />,
            label: 'PDF',
            color: '#ef4444',
            bgColor: '#fef2f2',
            shortName: 'PDF'
        };
    }
    // Word
    if (extension === 'doc' || extension === 'docx' || type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return {
            icon: <FileText size={32} color="#2563eb" />,
            label: 'DOC',
            color: '#2563eb',
            bgColor: '#eff6ff',
            shortName: 'W'
        };
    }
    // Excel
    if (extension === 'xls' || extension === 'xlsx' || type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return {
            icon: <FileSpreadsheet size={32} color="#16a34a" />,
            label: 'XLS',
            color: '#16a34a',
            bgColor: '#f0fdf4',
            shortName: 'X'
        };
    }
    // PowerPoint
    if (extension === 'ppt' || extension === 'pptx' || type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        return {
            icon: <FilePieChart size={32} color="#ea580c" />,
            label: 'PPT',
            color: '#ea580c',
            bgColor: '#fff7ed',
            shortName: 'P'
        };
    }
    // Image
    if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
        return {
            icon: <FileImage size={32} color="#3b82f6" />,
            label: 'IMG',
            color: '#3b82f6',
            bgColor: '#eff6ff',
            shortName: 'IMG'
        };
    }

    return {
        icon: <File size={32} color="#64748b" />,
        label: 'FILE',
        color: '#64748b',
        bgColor: '#f8fafc',
        shortName: 'DOC'
    };
};

export function DocumentCard({ doc, onView, onDelete, onDownload }: DocumentCardProps) {
    const details = getFileDetails(doc.name, doc.type);
    const isImage = doc.type.startsWith('image/') && doc.url;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    '& .card-actions': {
                        opacity: 1,
                        transform: 'translateY(0)'
                    },
                    '& .preview-area': {
                        bgcolor: isImage ? 'rgba(0,0,0,0.05)' : details.bgColor
                    }
                }
            }}
        >
            <CardActionArea
                onClick={() => onView(doc)}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
                {/* Preview Area */}
                <Box
                    className="preview-area"
                    sx={{
                        height: 100,
                        bgcolor: details.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'background-color 0.3s'
                    }}
                >
                    {isImage ? (
                        <Box
                            component="img"
                            src={doc.url}
                            alt={doc.name}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        details.icon
                    )}

                    {/* File Type Badge/Ribbon */}
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                    }}>
                        <Box sx={{
                            bgcolor: details.color,
                            color: 'white',
                            fontSize: '0.6rem',
                            fontWeight: 800,
                            px: 0.8,
                            py: 0.4,
                            borderBottomLeftRadius: 6,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                            {details.shortName}
                        </Box>
                    </Box>

                    {/* Actions Overlay */}
                    <Box
                        className="card-actions"
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                            py: 1,
                            px: 1,
                            opacity: 0,
                            transform: 'translateY(100%)',
                            transition: 'all 0.2s ease',
                            zIndex: 2
                        }}
                    >
                        <Tooltip title="View">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onView(doc);
                                }}
                                sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f1f5f9' }, p: 0.5 }}
                            >
                                <Eye size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                            <IconButton
                                size="small"
                                color="success"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDownload(doc);
                                }}
                                sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f0fdf4' }, p: 0.5 }}
                            >
                                <Download size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(doc.id);
                                }}
                                sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#fef2f2' }, p: 0.5 }}
                            >
                                <Trash2 size={16} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Document Details */}
                <CardContent sx={{ p: 1.5, pt: 1, '&:last-child': { pb: 1.5 } }}>
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 700,
                            color: '#1e293b',
                            lineHeight: 1.3,
                            mb: 0.25,
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {doc.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, display: 'block', fontSize: '0.65rem' }}>
                        {doc.size}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
