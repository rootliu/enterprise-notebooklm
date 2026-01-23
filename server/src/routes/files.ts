import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { parseFile, getFileFormat, formatFileSize } from '../services/fileParser';
import { getGeminiService } from '../services/geminiService';
import type { UploadedFile } from '../types';

const router = Router();

// In-memory file storage (in production, use a database)
const filesStore: Map<string, UploadedFile> = new Map();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls', '.pdf', '.html', '.htm', '.md', '.markdown', '.docx', '.doc'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${ext}`));
    }
  },
});

// POST /api/files/upload - Upload and analyze a file
router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }

    const file = req.file;
    const contextType = (req.body.contextType as 'summary' | 'full') || 'summary';

    // Create initial file record
    const fileId = uuidv4();
    const format = getFileFormat(file.originalname);

    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.originalname,
      format: format as UploadedFile['format'],
      size: formatFileSize(file.size),
      uploadedAt: new Date(),
      summary: '',
      tags: [],
      filePath: file.path,
      contentType: contextType,
      status: 'analyzing',
    };

    filesStore.set(fileId, uploadedFile);

    // Send immediate response with analyzing status
    res.status(202).json({
      success: true,
      data: {
        id: fileId,
        name: uploadedFile.name,
        format: uploadedFile.format,
        size: uploadedFile.size,
        status: 'analyzing',
      },
    });

    // Analyze file in background
    try {
      const content = await parseFile(file.path, format);
      uploadedFile.content = content;

      const gemini = getGeminiService();
      const analysis = await gemini.analyzeFile(content, file.originalname);

      uploadedFile.summary = analysis.summary;
      uploadedFile.tags = analysis.tags;
      uploadedFile.status = 'ready';

      filesStore.set(fileId, uploadedFile);
      console.log(`File ${fileId} analysis completed`);
    } catch (analysisError) {
      console.error('Analysis error:', analysisError);
      uploadedFile.status = 'error';
      uploadedFile.errorMessage = analysisError instanceof Error ? analysisError.message : 'Analysis failed';
      filesStore.set(fileId, uploadedFile);
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    });
  }
});

// GET /api/files - Get all files with optional filtering
router.get('/', (req: Request, res: Response): void => {
  try {
    const { tags, search } = req.query;
    let files = Array.from(filesStore.values());

    // Filter by tags (OR logic)
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : [tags];
      files = files.filter((file) =>
        file.tags.some((tag) => tagList.includes(tag))
      );
    }

    // Filter by search query (filename and summary)
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      files = files.filter(
        (file) =>
          file.name.toLowerCase().includes(searchLower) ||
          file.summary.toLowerCase().includes(searchLower)
      );
    }

    // Sort by upload date (newest first)
    files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    res.json({
      success: true,
      data: files.map((f) => ({
        id: f.id,
        name: f.name,
        format: f.format,
        size: f.size,
        uploadedAt: f.uploadedAt,
        summary: f.summary,
        tags: f.tags,
        status: f.status,
        errorMessage: f.errorMessage,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch files',
    });
  }
});

// GET /api/files/:id - Get single file details
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const file = filesStore.get(id);

    if (!file) {
      res.status(404).json({ success: false, error: 'File not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: file.id,
        name: file.name,
        format: file.format,
        size: file.size,
        uploadedAt: file.uploadedAt,
        summary: file.summary,
        tags: file.tags,
        status: file.status,
        errorMessage: file.errorMessage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch file',
    });
  }
});

// GET /api/files/:id/content - Get file full content
router.get('/:id/content', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const file = filesStore.get(id);

    if (!file) {
      res.status(404).json({ success: false, error: 'File not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        content: file.content || '',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch file content',
    });
  }
});

// DELETE /api/files/:id - Delete a file
router.delete('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const file = filesStore.get(id);

    if (!file) {
      res.status(404).json({ success: false, error: 'File not found' });
      return;
    }

    // Delete physical file
    if (file.filePath && fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    filesStore.delete(id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file',
    });
  }
});

// GET /api/files/tags/all - Get all unique tags
router.get('/tags/all', (req: Request, res: Response): void => {
  try {
    const allTags = new Set<string>();
    filesStore.forEach((file) => {
      file.tags.forEach((tag) => allTags.add(tag));
    });

    res.json({
      success: true,
      data: Array.from(allTags).sort(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tags',
    });
  }
});

// Export filesStore for use in other routes
export { filesStore };
export default router;
