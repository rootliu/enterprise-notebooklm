import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AnalysisResult } from '../types';

// Management tags reference for prompt
const MANAGEMENT_TAGS = `
财务管理: 财务、预算、成本、收入、利润、现金流、资产、负债、投资、ROI
运营管理: 运营、流程、效率、质量、库存、供应链、生产、物流、KPI、绩效
市场营销: 市场、营销、销售、客户、品牌、推广、渠道、定价、竞争、增长
人力资源: 人力、招聘、培训、绩效、薪酬、组织、团队、领导力、文化、员工
战略管理: 战略、规划、目标、风险、机会、竞争、创新、转型、合作、并购
数据分析: 数据、分析、报表、趋势、预测、对比、统计、指标、仪表盘、可视化
`;

// Hardcoded Gemini API Key - DO NOT CHANGE
const GEMINI_API_KEY = 'AIzaSyCt7PZfa7OH2PkNoMGQQ6PQGwVybqlK3EE';

// Model configuration - DO NOT CHANGE
// Must use Gemini 3 Pro model as specified in requirements
const GEMINI_MODEL = 'gemini-3-pro-preview';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // Use Gemini 3 Pro model - DO NOT CHANGE
    this.model = this.genAI.getGenerativeModel({ model: GEMINI_MODEL });
  }

  async analyzeFile(content: string, filename: string): Promise<AnalysisResult> {
    const prompt = `你是一个专业的文档分析助手。请分析以下文件内容，并提供：

1. **摘要 (Summary)**: 用中文写一段100-200字的摘要，概括文件的主要内容、关键数据和重要发现。

2. **标签 (Tags)**: 从以下管理学常用标签中选择最相关的标签（最多10个）：
${MANAGEMENT_TAGS}

请以JSON格式返回结果，格式如下：
{
  "summary": "文件摘要内容...",
  "tags": ["标签1", "标签2", "标签3"]
}

文件名: ${filename}

文件内容:
${content.substring(0, 30000)}

请只返回JSON，不要包含其他文字或markdown代码块标记。`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        summary: parsed.summary || '无法生成摘要',
        tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 10) : [],
      };
    } catch (error) {
      console.error('Gemini analysis error:', error);
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async chat(message: string, contextItems: { content: string; filename: string }[]): Promise<string> {
    let contextPrompt = '';

    if (contextItems.length > 0) {
      contextPrompt = '以下是相关的文件内容作为上下文参考：\n\n';
      contextItems.forEach((item, index) => {
        contextPrompt += `--- 文件 ${index + 1}: ${item.filename} ---\n`;
        contextPrompt += item.content.substring(0, 10000) + '\n\n';
      });
    }

    const prompt = `你是一个专业的企业数据分析助手。请基于提供的上下文信息回答用户的问题。
如果上下文中没有相关信息，请如实说明。
请用中文回答，保持专业、准确、有条理。

${contextPrompt}

用户问题: ${message}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini chat error:', error);
      throw new Error(`AI chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateSessionSummary(messages: { role: string; content: string }[]): Promise<AnalysisResult> {
    const conversationText = messages
      .map((m) => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`)
      .join('\n\n');

    const prompt = `请分析以下对话内容，并提供：

1. **摘要 (Summary)**: 用中文写一段100-200字的摘要，概括对话的主题和关键结论。

2. **标签 (Tags)**: 从以下管理学常用标签中选择最相关的标签（最多10个）：
${MANAGEMENT_TAGS}

请以JSON格式返回结果：
{
  "summary": "对话摘要...",
  "tags": ["标签1", "标签2"]
}

对话内容:
${conversationText.substring(0, 20000)}

请只返回JSON，不要包含其他文字。`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        summary: parsed.summary || '对话摘要',
        tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 10) : [],
      };
    } catch (error) {
      console.error('Session summary error:', error);
      return {
        summary: '对话会话',
        tags: ['对话', '分析'],
      };
    }
  }
}

// Singleton instance
let geminiService: GeminiService | null = null;

export function getGeminiService(): GeminiService {
  if (!geminiService) {
    geminiService = new GeminiService();
  }
  return geminiService;
}
