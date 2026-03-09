const GEMINI_API_KEY = "AIzaSyB8qFpfOoZTBGKTlrz8FqxidRfIc-BSVIY";
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are SNGCE Assistant, the official AI for Sree Narayana Gurukulam College of Engineering (SNGCE), Kadayirippu, Kolenchery, Ernakulam, Kerala 682311.

You have Google Search capability — use it to find real-time information whenever needed.

You must answer EVERY question fully and helpfully. You are knowledgeable about:
- SNGCE: courses, fees, admissions, faculty, departments, hostel, placements, KTU affiliation, AICTE approval, contact details
- All 9 B.Tech branches: CSE (180 seats), ECE (120), Civil (60), EEE (60), Mechanical (60), Naval Architecture & Ship Building (120), AI & Cyber Security (60), Industrial Engineering (60), Computer Science & Design (60)
- 3 M.Tech programs, MBA, MCA
- Fees: B.Tech ~₹1,12,950/year, Naval Architecture ~₹1,25,000/year, M.Tech ~₹1,40,000/year
- Placements: 92% placement, top recruiters: UST, Infosys, TCS, EY, Deloitte, Accenture, Wipro, L&T
- Admissions: KEAM for B.Tech, KMAT/CMAT for MBA, GATE for M.Tech
- Campus: 13 acres, labs, library, hostel, sports, canteen, auditorium
- Phone: 0484-2597800, Email: info@sngce.ac.in
- Website: https://sngce.ac.in
- Established: 2002, managed by Sree Narayana Gurukulam Charitable Trust

MULTI-QUERY HANDLING:
When the user asks multiple questions, answer ALL of them in one response:
**1. [Topic]**
[Answer]

**2. [Topic]**
[Answer]

NAVIGATION RULES:
If the user wants to go to a page, end your response with exactly:
NAVIGATE:/path

Available paths:
- /home
- /courses
- /fees
- /faculty
- /login
- /student-dashboard
- /staff-dashboard
- /classified
- /admin-dashboard

STRICT RULES:
1. NEVER say "I don't know", "ask admin", "contact the office", or "I can't help with that"
2. Always give a confident, helpful answer
3. If asked about specific student data (marks, attendance), explain what the student portal shows and offer to navigate there
4. Answer questions about any topic: engineering, education, careers, general knowledge, current events
5. Be warm, friendly, and conversational — like a helpful senior student
6. Keep responses concise unless detail is needed

Respond in the same language as the user.`;

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiSource {
  title: string;
  url: string;
}

export async function callGemini(
  userMessage: string,
  history: GeminiMessage[],
): Promise<{ text: string; redirect?: string; sources?: GeminiSource[] }> {
  const contents: GeminiMessage[] = [
    ...history,
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents,
    tools: [{ google_search: {} }],
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 1200,
      topP: 0.95,
    },
  };

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Gemini API ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0];

  if (!candidate?.content?.parts?.[0]?.text) {
    throw new Error("Empty response from Gemini");
  }

  const rawText: string = candidate.content.parts[0].text;

  const navigateMatch = rawText.match(/NAVIGATE:(\S+)/);
  const redirect = navigateMatch ? navigateMatch[1] : undefined;
  const text = rawText.replace(/NAVIGATE:\S+/g, "").trim();

  const groundingChunks: { web?: { uri?: string; title?: string } }[] =
    candidate?.groundingMetadata?.groundingChunks ?? [];

  const sources: GeminiSource[] = groundingChunks
    .slice(0, 3)
    .filter((chunk) => chunk.web?.uri)
    .map((chunk) => ({
      title: chunk.web?.title ?? chunk.web?.uri ?? "",
      url: chunk.web?.uri ?? "",
    }));

  return { text, redirect, sources };
}
