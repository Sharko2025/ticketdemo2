const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export interface ParsedTicket {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  needs_review: boolean;
}

const DEFAULT_TICKET: ParsedTicket = {
  title: 'Ticket mới',
  description: '',
  priority: 'Medium',
  category: 'Uncategorized',
  needs_review: true,
};

/**
 * Analyzes a Vietnamese support ticket using Gemini 1.5 Flash.
 * Uses few-shot prompting and handles JSON parsing errors gracefully.
 */
export async function parseTicketFromText(text: string): Promise<ParsedTicket> {
  if (!text) return DEFAULT_TICKET;

  const prompt = `
Bạn là một trợ lý IT support chuyên nghiệp. Nhiệm vụ của bạn là phân loại các yêu cầu hỗ trợ (ticket) bằng Tiếng Việt sang định dạng JSON.

Định dạng JSON yêu cầu:
{
  "title": "Tiêu đề ngắn gọn",
  "description": "Mô tả chi tiết vấn đề",
  "priority": "Low" | "Medium" | "High" | "Critical",
  "category": "Loại vấn đề (ví dụ: Network, Hardware, Software, Account...)",
  "needs_review": false
}

Nếu nội dung không rõ ràng hoặc có dấu hiệu bất thường, hãy đặt "needs_review": true.

Ví dụ:
1. Input: "Mạng chậm quá không làm được gì"
   Output: {"title": "Mạng chậm", "description": "Người dùng báo cáo tốc độ mạng chậm, không thể làm việc.", "priority": "Medium", "category": "Network", "needs_review": false}

2. Input: "Hỏng bàn phím rồi"
   Output: {"title": "Hỏng bàn phím", "description": "Bàn phím của người dùng bị hỏng.", "priority": "Low", "category": "Hardware", "needs_review": false}

3. Input: "Sập server kế toán rồi cứu với"
   Output: {"title": "Sập server kế toán", "description": "Server kế toán ngừng hoạt động, cần xử lý gấp.", "priority": "Critical", "category": "Software/Server", "needs_review": false}

Input mới: "${text}"
Output (chỉ trả về JSON):`;

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('Empty response from Gemini');
    }

    try {
      const parsed = JSON.parse(content);
      return {
        ...DEFAULT_TICKET,
        ...parsed,
        needs_review: parsed.needs_review ?? false,
      };
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON:', content, parseError);
      return {
        ...DEFAULT_TICKET,
        description: text,
        needs_review: true,
      };
    }
  } catch (error) {
    console.error('Gemini API call failed:', error);
    return {
      ...DEFAULT_TICKET,
      description: text,
      needs_review: true,
    };
  }
}
