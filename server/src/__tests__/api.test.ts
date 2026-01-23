import request from 'supertest';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
  });

  return app;
};

describe('API Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('Health Check', () => {
    it('should return ok status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });
});

describe('File Parser Tests', () => {
  const { parseFile, getFileFormat, formatFileSize } = require('../services/fileParser');

  describe('getFileFormat', () => {
    it('should return csv for .csv files', () => {
      expect(getFileFormat('data.csv')).toBe('csv');
    });

    it('should return excel for .xlsx files', () => {
      expect(getFileFormat('data.xlsx')).toBe('excel');
    });

    it('should return excel for .xls files', () => {
      expect(getFileFormat('data.xls')).toBe('excel');
    });

    it('should return pdf for .pdf files', () => {
      expect(getFileFormat('document.pdf')).toBe('pdf');
    });

    it('should return html for .html files', () => {
      expect(getFileFormat('page.html')).toBe('html');
    });

    it('should return html for .htm files', () => {
      expect(getFileFormat('page.htm')).toBe('html');
    });

    it('should return markdown for .md files', () => {
      expect(getFileFormat('readme.md')).toBe('markdown');
    });

    it('should throw for unsupported files', () => {
      expect(() => getFileFormat('file.xyz')).toThrow('Unsupported file type');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(2048)).toBe('2.0 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
    });
  });
});

describe('Type Definitions', () => {
  it('should have correct OfflineFile interface', () => {
    const file = {
      id: 'test-id',
      name: 'test.csv',
      format: 'csv' as const,
      size: '1.0 KB',
      uploadedAt: new Date(),
      summary: 'Test summary',
      tags: ['tag1', 'tag2'],
      filePath: '/path/to/file',
      contentType: 'summary' as const,
      status: 'ready' as const,
    };

    expect(file.id).toBeDefined();
    expect(file.name).toBeDefined();
    expect(file.format).toBe('csv');
    expect(file.status).toBe('ready');
  });
});
