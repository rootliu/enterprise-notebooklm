import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getGeminiService } from '../services/geminiService';
import { filesStore } from './files';
import type { ChatMessage } from '../types';

const router = Router();

// POST /api/chat - Send a message and get AI response
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, contextFileIds, contextType } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, error: 'Message is required' });
      return;
    }

    // Gather context from files
    const contextItems: { content: string; filename: string }[] = [];

    if (Array.isArray(contextFileIds)) {
      for (const fileId of contextFileIds) {
        const file = filesStore.get(fileId);
        if (file) {
          const content = contextType === 'full' ? (file.content || file.summary) : file.summary;
          contextItems.push({
            content,
            filename: file.name,
          });
        }
      }
    }

    // Call Gemini
    const gemini = getGeminiService();
    const response = await gemini.chat(message, contextItems);

    const chatMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      contextFiles: contextFileIds,
    };

    res.json({
      success: true,
      data: chatMessage,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Chat failed',
    });
  }
});

// POST /api/chat/export - Export conversation to file
router.post('/export', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, format, sessionName } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ success: false, error: 'Messages are required' });
      return;
    }

    if (!['markdown', 'docx'].includes(format)) {
      res.status(400).json({ success: false, error: 'Invalid format. Use "markdown" or "docx"' });
      return;
    }

    // Generate markdown content
    const timestamp = new Date().toLocaleString('zh-CN');
    let markdownContent = `# ${sessionName || '对话记录'}\n\n`;
    markdownContent += `导出时间: ${timestamp}\n\n---\n\n`;

    messages.forEach((msg: ChatMessage) => {
      const role = msg.role === 'user' ? '**用户**' : '**AI助手**';
      markdownContent += `${role}:\n\n${msg.content}\n\n---\n\n`;
    });

    if (format === 'markdown') {
      // Return markdown content
      res.json({
        success: true,
        data: {
          content: markdownContent,
          filename: `${sessionName || 'conversation'}_${Date.now()}.md`,
          mimeType: 'text/markdown',
        },
      });
    } else {
      // For DOCX, we'll return markdown and let frontend handle conversion
      // In production, use a library like docx to generate proper DOCX
      res.json({
        success: true,
        data: {
          content: markdownContent,
          filename: `${sessionName || 'conversation'}_${Date.now()}.docx`,
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    });
  }
});

export default router;
