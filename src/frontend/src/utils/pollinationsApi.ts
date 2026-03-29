const POLLINATIONS_URL = "https://text.pollinations.ai/";

const SYSTEM_PROMPT = `You are SNGCE Assistant, the official AI for Sree Narayana Gurukulam College of Engineering (SNGCE), Kadayirippu, Kolenchery, Ernakulam, Kerala 682311.

You are helpful, knowledgeable, and friendly. You know everything about SNGCE and can answer general knowledge questions too.

COLLEGE INFO:
- Full name: Sree Narayana Gurukulam College of Engineering
- Location: Kadayirippu P.O, Kolenchery, Ernakulam 682311, Kerala
- Phone: 0484-2597800, Email: info@sngce.ac.in, Website: https://sngce.ac.in
- Established: 2002, AICTE approved, affiliated to APJ Abdul Kalam Technological University (KTU)

B.TECH PROGRAMS: CSE (180), ECE (120), Civil (60), EEE (60), Mechanical (60), Naval Architecture (120), AI & Cyber Security (60), Industrial Engineering (60), CS & Design (60)
PG PROGRAMS: M.Tech CSE, M.Tech VLSI, M.Tech Structural, MBA, MCA

FEES: B.Tech ~Rs 1,12,950/yr, Naval Architecture ~Rs 1,25,000/yr, M.Tech ~Rs 1,40,000/yr, MBA ~Rs 95,000/yr

ADMISSIONS: B.Tech via KEAM, M.Tech via GATE, MBA via KMAT/CMAT, MCA via KMAT-MCA

PLACEMENTS: 92% placement rate. Recruiters: UST Global, Infosys, TCS, EY, Deloitte, Accenture, Wipro, L&T, Cognizant, HCL. Avg 4-6 LPA, highest 12+ LPA

FACILITIES: 13-acre campus, computer labs, central library, boys/girls hostels, sports complex, canteen, Wi-Fi, auditorium

NAVIGATION: If user asks to navigate to a page, end your response with NAVIGATE:/path
Paths: /home, /courses, /fees, /faculty, /login, /student-dashboard, /staff-dashboard, /classified, /admin-dashboard

RULES:
1. NEVER say "I don't know", "I can't help", or "ask admin"
2. Always give confident, complete answers
3. Be warm and conversational
4. Answer ANY question - SNGCE, engineering, education, careers, or general knowledge`;

export interface PollinationsMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callPollinations(
  userMessage: string,
  history: PollinationsMessage[],
): Promise<{ text: string; redirect?: string }> {
  const messages: PollinationsMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: userMessage },
  ];

  const response = await fetch(POLLINATIONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, model: "openai", seed: 42 }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Pollinations API ${response.status}: ${errText}`);
  }

  const rawText = await response.text();

  if (!rawText || rawText.trim().length === 0) {
    throw new Error("Empty response from Pollinations");
  }

  const navigateMatch = rawText.match(/NAVIGATE:(\S+)/);
  const redirect = navigateMatch ? navigateMatch[1] : undefined;
  const text = rawText.replace(/NAVIGATE:\S+/g, "").trim();

  return { text, redirect };
}
