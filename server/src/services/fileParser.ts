import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';
import * as cheerio from 'cheerio';

// PDF parser - dynamic import to handle ES module
let pdfParse: any = null;

async function getPdfParser() {
  if (!pdfParse) {
    pdfParse = (await import('pdf-parse')).default;
  }
  return pdfParse;
}

export async function parseFile(filePath: string, format: string): Promise<string> {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  switch (format) {
    case 'csv':
      return parseCSV(absolutePath);
    case 'excel':
      return parseExcel(absolutePath);
    case 'pdf':
      return await parsePDF(absolutePath);
    case 'html':
      return parseHTML(absolutePath);
    case 'markdown':
      return parseMarkdown(absolutePath);
    case 'docx':
      return parseDocx(absolutePath);
    default:
      throw new Error(`Unsupported file format: ${format}`);
  }
}

function parseCSV(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    return 'Empty CSV file';
  }

  // Parse headers and sample data
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const dataRows = lines.slice(1, Math.min(lines.length, 51)); // First 50 rows

  let result = `CSV File with ${lines.length - 1} rows and ${headers.length} columns.\n\n`;
  result += `Columns: ${headers.join(', ')}\n\n`;
  result += `Sample data (first ${dataRows.length} rows):\n`;

  dataRows.forEach((row, index) => {
    const values = row.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    result += `Row ${index + 1}: ${values.join(' | ')}\n`;
  });

  return result;
}

function parseExcel(filePath: string): string {
  const workbook = xlsx.readFile(filePath);
  let result = `Excel file with ${workbook.SheetNames.length} sheet(s).\n\n`;

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

    result += `Sheet: ${sheetName}\n`;
    result += `Rows: ${data.length}\n`;

    if (data.length > 0) {
      const headers = data[0] as string[];
      result += `Columns: ${headers.join(', ')}\n\n`;

      // Sample first 50 rows
      const sampleRows = data.slice(1, Math.min(data.length, 51));
      result += `Sample data (first ${sampleRows.length} rows):\n`;

      sampleRows.forEach((row, index) => {
        result += `Row ${index + 1}: ${row.join(' | ')}\n`;
      });
    }
    result += '\n';
  });

  return result;
}

async function parsePDF(filePath: string): Promise<string> {
  const parser = await getPdfParser();
  const dataBuffer = fs.readFileSync(filePath);
  const data = await parser(dataBuffer);

  let result = `PDF Document with ${data.numpages} page(s).\n\n`;
  result += `Content:\n${data.text}`;

  // Limit content length
  if (result.length > 50000) {
    result = result.substring(0, 50000) + '\n\n[Content truncated...]';
  }

  return result;
}

function parseHTML(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(content);

  // Remove script and style tags
  $('script, style').remove();

  // Extract title
  const title = $('title').text() || 'No title';

  // Extract text content
  const textContent = $('body').text().replace(/\s+/g, ' ').trim();

  // Extract tables
  const tables: string[] = [];
  $('table').each((i, table) => {
    const rows: string[][] = [];
    $(table).find('tr').each((_, tr) => {
      const cells: string[] = [];
      $(tr).find('th, td').each((_, cell) => {
        cells.push($(cell).text().trim());
      });
      if (cells.length > 0) {
        rows.push(cells);
      }
    });
    if (rows.length > 0) {
      tables.push(rows.map(row => row.join(' | ')).join('\n'));
    }
  });

  let result = `HTML Document: ${title}\n\n`;
  result += `Text Content:\n${textContent}\n\n`;

  if (tables.length > 0) {
    result += `Tables found: ${tables.length}\n`;
    tables.forEach((table, i) => {
      result += `\nTable ${i + 1}:\n${table}\n`;
    });
  }

  // Limit content length
  if (result.length > 50000) {
    result = result.substring(0, 50000) + '\n\n[Content truncated...]';
  }

  return result;
}

function parseMarkdown(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  return `Markdown Document:\n\n${content}`;
}

function parseDocx(filePath: string): string {
  // For DOCX, we'll use xlsx library's limited support or treat as binary
  // In production, you'd want to use mammoth or similar library
  try {
    const content = fs.readFileSync(filePath);
    // Basic extraction - in production use mammoth library
    const text = content.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ');
    return `DOCX Document:\n\n${text.substring(0, 50000)}`;
  } catch (error) {
    return 'Unable to parse DOCX file. Content extraction failed.';
  }
}

export function getFileFormat(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.csv':
      return 'csv';
    case '.xlsx':
    case '.xls':
      return 'excel';
    case '.pdf':
      return 'pdf';
    case '.html':
    case '.htm':
      return 'html';
    case '.md':
    case '.markdown':
      return 'markdown';
    case '.docx':
    case '.doc':
      return 'docx';
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
}
