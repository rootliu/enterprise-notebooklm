import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { getGeminiService } from '../services/geminiService';
import { filesStore } from './files';
import type { Session, UploadedFile } from '../types';

const router = Router();

// In-memory session storage
const sessionsStore: Map<string, Session> = new Map();

// POST /api/sessions - Save current session
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, messages, contextFileIds } = req.body;

    if (!name || !Array.isArray(messages)) {
      res.status(400).json({ success: false, error: 'Name and messages are required' });
      return;
    }

    const sessionId = uuidv4();
    const now = new Date();

    // Generate session summary using AI
    const gemini = getGeminiService();
    const analysis = await gemini.generateSessionSummary(messages);

    // Create markdown content for the session
    const timestamp = now.toLocaleString('zh-CN');
    let markdownContent = `# ${name}\n\n`;
    markdownContent += `创建时间: ${timestamp}\n\n`;
    markdownContent += `## 摘要\n\n${analysis.summary}\n\n`;
    markdownContent += `## 标签\n\n${analysis.tags.join(', ')}\n\n`;
    markdownContent += `---\n\n## 对话内容\n\n`;

    messages.forEach((msg: any) => {
      const role = msg.role === 'user' ? '**用户**' : '**AI助手**';
      markdownContent += `${role}:\n\n${msg.content}\n\n---\n\n`;
    });

    // Save markdown file
    const uploadsDir = path.join(__dirname, '../../uploads');
    const filename = `session_${sessionId}.md`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, markdownContent, 'utf-8');

    // Create file record for the session
    const fileId = uuidv4();
    const sessionFile: UploadedFile = {
      id: fileId,
      name: `${name}.md`,
      format: 'markdown',
      size: `${(markdownContent.length / 1024).toFixed(1)} KB`,
      uploadedAt: now,
      summary: analysis.summary,
      tags: analysis.tags,
      filePath,
      contentType: 'summary',
      status: 'ready',
      content: markdownContent,
    };
    filesStore.set(fileId, sessionFile);

    // Create session record
    const session: Session = {
      id: sessionId,
      name,
      createdAt: now,
      updatedAt: now,
      messages,
      contextFileIds: contextFileIds || [],
    };
    sessionsStore.set(sessionId, session);

    res.json({
      success: true,
      data: {
        sessionId,
        fileId,
        name: sessionFile.name,
        summary: analysis.summary,
        tags: analysis.tags,
      },
    });
  } catch (error) {
    console.error('Save session error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save session',
    });
  }
});

// GET /api/sessions - Get all sessions
router.get('/', (req: Request, res: Response): void => {
  try {
    const sessions = Array.from(sessionsStore.values());

    // Sort by update date (newest first)
    sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    res.json({
      success: true,
      data: sessions.map((s) => ({
        id: s.id,
        name: s.name,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        messageCount: s.messages.length,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch sessions',
    });
  }
});

// GET /api/sessions/:id - Get session details
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const session = sessionsStore.get(id);

    if (!session) {
      res.status(404).json({ success: false, error: 'Session not found' });
      return;
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch session',
    });
  }
});

// DELETE /api/sessions/:id - Delete a session
router.delete('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const session = sessionsStore.get(id);

    if (!session) {
      res.status(404).json({ success: false, error: 'Session not found' });
      return;
    }

    sessionsStore.delete(id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete session',
    });
  }
});

export default router;
