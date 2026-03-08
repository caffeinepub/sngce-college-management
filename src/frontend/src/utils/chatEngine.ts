/**
 * SNGCE Chat Engine
 * Comprehensive, human-like response system for the SNGCE College Assistant.
 * Handles navigation, college info, student queries, general conversation, and more.
 */

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface BotResponse {
  text: string;
  redirect?: string;
}

// ── Utilities ──────────────────────────────────────────────────────────────

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function contains(msg: string, ...terms: string[]): boolean {
  return terms.some((t) => msg.includes(t));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Knowledge Base ─────────────────────────────────────────────────────────

const COLLEGE_INFO = {
  name: "Sree Narayana Gurukulam College of Engineering",
  shortName: "SNGCE",
  established: 1999,
  location: "Kadayirippu P.O., Koothattukulam, Ernakulam, Kerala 686 670",
  phone: "+91 485 2234567",
  email: "info@sngce.ac.in",
  website: "www.sngce.ac.in",
  affiliation: "APJ Abdul Kalam Technological University (KTU)",
  approval: "AICTE",
  students: "3000+",
  faculty: "150+",
  departments: 8,
  principal:
    "The college is headed by a distinguished principal with decades of academic experience.",
};

const COURSES_INFO = `
**B.Tech Programs (4-year):**
- Computer Science & Engineering (CSE)
- Electronics & Communication Engineering (ECE)
- Electrical & Electronics Engineering (EEE)
- Mechanical Engineering (ME)
- Civil Engineering (CE)
- Information Technology (IT)

**M.Tech Programs (2-year):**
- Computer Science & Engineering
- VLSI & Embedded Systems
- Structural Engineering

**MBA Program (2-year):**
- Business Administration
`;

const FEES_INFO = `
**B.Tech (per year):**
- General Category: ₹75,000 – ₹90,000
- Management Quota: ₹1,00,000 – ₹1,10,000

**M.Tech (per year):**
- ₹65,000 – ₹80,000

**MBA (per year):**
- ₹70,000 – ₹85,000

**Hostel (per year):**
- ₹55,000 – ₹65,000 (including food)

**Scholarships Available:**
- Government merit scholarships
- SC/ST fee concessions
- Management scholarships for toppers
`;

const ADMISSION_INFO = `
**B.Tech Admission:**
- Through KEAM (Kerala Engineering Architecture Medical) entrance exam
- Application: usually March–April
- Results & allotment: May–June

**M.Tech Admission:**
- GATE score based
- University-level allotment through KTU

**MBA Admission:**
- Through KMAT / CMAT scores
- Application: usually February–March

All admissions are through the centralized Kerala Engineering Admissions (KEA) process.
`;

const FACULTY_INFO =
  "SNGCE has 150+ faculty members across 8 departments. Each department is headed by experienced professors with Ph.D. qualifications. Faculty are actively involved in research, publications, and industry collaborations. You can browse the complete faculty directory for names, qualifications, subjects taught, and department details.";

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Applied Sciences & Humanities",
  "Management Studies (MBA)",
];

const FACILITIES = `
**Campus Facilities:**
- Well-equipped laboratories for all departments
- Central library with 50,000+ books and digital resources
- High-speed Wi-Fi campus
- Sports complex with cricket ground, basketball & volleyball courts
- Hostel for boys and girls separately
- Cafeteria with hygienic food
- Auditorium and seminar halls
- Innovation & entrepreneurship cell
- Placement cell with active industry connections
`;

const PLACEMENT_INFO =
  "SNGCE has a dedicated Placement & Training Cell. Top companies like TCS, Infosys, Wipro, Cognizant, and many more recruit from campus. The college organizes soft skills training, aptitude workshops, and mock interviews throughout the year. Average placement rate is above 80% for eligible students.";

const CONTACT_INFO = `You can reach SNGCE at:
- **Address:** Kadayirippu P.O., Koothattukulam, Ernakulam, Kerala 686 670
- **Phone:** +91 485 2234567
- **Email:** info@sngce.ac.in
- **Website:** www.sngce.ac.in`;

// ── Response Categories ─────────────────────────────────────────────────────

const greetingResponses = [
  "Hey there! 👋 I'm SNGCE Assistant, your college guide. How can I help you today?",
  "Hi! Welcome to SNGCE's virtual assistant. What would you like to know?",
  "Hello! Great to see you here. I'm here to help you with anything about SNGCE. What's on your mind?",
  "Hey! I'm your SNGCE guide. Whether it's courses, fees, faculty, or just finding your way around — I've got you! What do you need?",
  "Hi there! 😊 I'm SNGCE Assistant. Feel free to ask me anything about the college!",
];

const howAreYouResponses = [
  "I'm doing great, thanks for asking! I'm always ready to help you navigate SNGCE. What can I do for you?",
  "All good here! I'm an AI assistant, so I'm always at 100% 😄 How can I help you today?",
  "Fantastic, thanks! Running on good vibes and college knowledge. What would you like to know?",
];

const thankYouResponses = [
  "You're very welcome! 😊 Don't hesitate to ask if you have more questions.",
  "Happy to help! That's what I'm here for. Anything else you'd like to know?",
  "Anytime! Feel free to come back if you need anything else.",
  "Of course! Always glad to assist. Is there anything else I can help you with?",
];

const goodbyeResponses = [
  "Goodbye! It was great chatting with you. Good luck with everything! 👋",
  "Take care! Feel free to come back anytime you have questions. Bye for now! 😊",
  "See you around! Don't hesitate to reach out whenever you need help. Goodbye!",
];

const unknownResponses = [
  "Great question! Let me think about that. SNGCE is a KTU-affiliated engineering college in Kerala — whatever you need to know about courses, career, campus, education, or anything else, I'm here for it. Could you give me a bit more context so I can give you a precise answer?",
  "Interesting! I want to make sure I give you the most useful answer. Are you asking about SNGCE specifically, or is this a general education/engineering question? Either way, I've got you covered!",
  "I'm on it! That's a broad topic — could you tell me a bit more so I can tailor the answer? Or if you want, I can give you a general overview right now.",
  "Let me help you with that! To give you the best answer, could you share a little more detail about what you're looking for? I can cover anything from SNGCE info to engineering topics to career advice.",
];

// ── Main Response Engine ────────────────────────────────────────────────────

export function generateResponse(
  message: string,
  history: ChatMessage[],
): BotResponse {
  const msg = normalize(message);
  const historyLength = history.length;

  // ── Greetings ──
  if (
    contains(
      msg,
      "hello",
      "hi ",
      "hey",
      "howdy",
      "sup ",
      "what's up",
      "whats up",
      "good morning",
      "good evening",
      "good afternoon",
    ) &&
    msg.length < 40
  ) {
    return { text: pick(greetingResponses) };
  }

  // ── How are you ──
  if (
    contains(
      msg,
      "how are you",
      "how r u",
      "how do you do",
      "you doing",
      "hows it going",
    )
  ) {
    return { text: pick(howAreYouResponses) };
  }

  // ── Bot identity ──
  if (
    contains(
      msg,
      "who are you",
      "what are you",
      "your name",
      "what is your name",
      "tell me about yourself",
      "introduce yourself",
    )
  ) {
    return {
      text: "I'm **SNGCE Assistant** — your friendly college guide! I can help you with info about courses, fees, faculty, admissions, and help you navigate the student or staff portal. What would you like to know?",
    };
  }

  // ── Thanks ──
  if (
    contains(
      msg,
      "thank you",
      "thanks",
      "thank u",
      "thx",
      "ty ",
      "appreciate",
      "helpful",
    )
  ) {
    return { text: pick(thankYouResponses) };
  }

  // ── Goodbye ──
  if (contains(msg, "bye", "goodbye", "see you", "later", "take care", "cya")) {
    return { text: pick(goodbyeResponses) };
  }

  // ── Navigation: Home ──
  if (
    contains(
      msg,
      "go home",
      "go back",
      "main page",
      "home page",
      "back to home",
      "homepage",
    )
  ) {
    return {
      text: "Sure! Taking you to the home page now. 🏠",
      redirect: "/home",
    };
  }

  // ── Navigation: Courses ──
  if (
    contains(
      msg,
      "show courses",
      "see courses",
      "take me to courses",
      "go to courses",
      "open courses",
      "show programs",
      "go to programs",
      "navigate to course",
    )
  ) {
    return {
      text: "Sure! Let me take you to the Courses page where you can explore all our B.Tech, M.Tech and MBA programs. 📚",
      redirect: "/courses",
    };
  }

  // ── Navigation: Fees ──
  if (
    contains(
      msg,
      "show fees",
      "go to fees",
      "open fees",
      "see fees",
      "navigate to fees",
      "fee page",
      "show fee structure",
    )
  ) {
    return {
      text: "Of course! Taking you to the Fee Structure page right now. 💰",
      redirect: "/fees",
    };
  }

  // ── Navigation: Faculty ──
  if (
    contains(
      msg,
      "show faculty",
      "go to faculty",
      "open faculty",
      "see faculty",
      "navigate to faculty",
      "show teachers",
      "show professors",
    )
  ) {
    return {
      text: "Sure thing! Let me take you to the Faculty Directory. 👨‍🏫",
      redirect: "/faculty",
    };
  }

  // ── Navigation: Login ──
  if (
    contains(
      msg,
      "login page",
      "sign in page",
      "go to login",
      "open login",
      "student portal link",
      "go to portal",
    )
  ) {
    return {
      text: "Taking you to the login page! You can sign in as a student or staff member there.",
      redirect: "/login",
    };
  }

  // ── Navigation: Staff ──
  if (
    contains(
      msg,
      "staff login",
      "staff portal",
      "staff sign in",
      "go to staff",
      "open staff portal",
    )
  ) {
    return {
      text: "Heading to the staff portal now! Staff can manage student academic records from there. 🔐",
      redirect: "/login",
    };
  }

  // ── Navigation: Student Dashboard ──
  if (
    contains(
      msg,
      "my dashboard",
      "student dashboard",
      "my attendance",
      "check attendance",
      "see my marks",
      "my results",
      "my timetable",
      "my fees due",
    )
  ) {
    return {
      text: "Your academic details like attendance, marks, exam timetable, and fee dues are all in your student dashboard. Please log in first to access them!",
      redirect: "/login",
    };
  }

  // ── About SNGCE ──
  if (
    contains(
      msg,
      "about sngce",
      "about the college",
      "tell me about",
      "what is sngce",
      "history of",
      "when was",
      "established",
      "founded",
      "about this college",
      "college info",
      "college information",
    )
  ) {
    return {
      text: `**${COLLEGE_INFO.name} (SNGCE)** was established in **${COLLEGE_INFO.established}** in ${COLLEGE_INFO.location}. It's affiliated to **${COLLEGE_INFO.affiliation}** and approved by **${COLLEGE_INFO.approval}**.\n\nWith **${COLLEGE_INFO.students} students** and **${COLLEGE_INFO.faculty} faculty** across **${COLLEGE_INFO.departments} departments**, SNGCE is one of Kerala's leading engineering institutions. 🎓`,
    };
  }

  // ── Courses info (not navigation) ──
  if (
    contains(
      msg,
      "course",
      "program",
      "branch",
      "btech",
      "b.tech",
      "mtech",
      "m.tech",
      "mba",
      "engineering branch",
      "what courses",
      "which course",
      "available course",
    )
  ) {
    return {
      text: `Great question! SNGCE offers a wide range of programs:\n${COURSES_INFO}\nWant me to take you to the full Courses page for more details?`,
    };
  }

  // ── Fees info (not navigation) ──
  if (
    contains(
      msg,
      "fee",
      "fees",
      "how much",
      "cost",
      "tuition",
      "scholarship",
      "fee structure",
      "annual fee",
      "semester fee",
    )
  ) {
    return {
      text: `Sure, here's a quick overview of fees at SNGCE:\n${FEES_INFO}\nFor the full detailed breakdown, I can take you to the Fees page. Just ask!`,
    };
  }

  // ── Faculty info (not navigation) ──
  if (
    contains(
      msg,
      "faculty",
      "teacher",
      "professor",
      "lecturer",
      "staff",
      "hod",
      "head of department",
      "who teaches",
    )
  ) {
    return {
      text: `${FACULTY_INFO}\n\nWant me to take you to the Faculty Directory where you can see everyone listed by department?`,
    };
  }

  // ── Admission ──
  if (
    contains(
      msg,
      "admission",
      "apply",
      "application",
      "keam",
      "entrance",
      "how to join",
      "eligibility",
      "how to get admission",
      "joining",
    )
  ) {
    return {
      text: `Here's how admissions work at SNGCE:\n${ADMISSION_INFO}\nFeel free to ask more or contact us at info@sngce.ac.in for guidance!`,
    };
  }

  // ── Departments ──
  if (contains(msg, "department", "which department", "list of department")) {
    return {
      text: `SNGCE has **${COLLEGE_INFO.departments} departments**:\n${DEPARTMENTS.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nEach department has well-qualified faculty and modern lab facilities. 🏛️`,
    };
  }

  // ── Hostel ──
  if (
    contains(
      msg,
      "hostel",
      "accommodation",
      "dormitory",
      "stay on campus",
      "housing",
    )
  ) {
    return {
      text: "SNGCE has separate hostels for boys and girls on campus. Hostel fees are approximately **₹55,000–₹65,000 per year**, including food. The hostels are well-maintained with all basic amenities. For admission to the hostel, contact the hostel warden during college admission time.",
    };
  }

  // ── Facilities ──
  if (
    contains(
      msg,
      "facilit",
      "infrastructure",
      "lab",
      "library",
      "sports",
      "canteen",
      "cafeteria",
      "wifi",
      "campus",
    )
  ) {
    return {
      text: `SNGCE has excellent campus facilities! Here's an overview:\n${FACILITIES}`,
    };
  }

  // ── Placement ──
  if (
    contains(
      msg,
      "placement",
      "job",
      "recruit",
      "company",
      "career",
      "internship",
      "campus hire",
    )
  ) {
    return {
      text: PLACEMENT_INFO,
    };
  }

  // ── Contact ──
  if (
    contains(
      msg,
      "contact",
      "address",
      "phone",
      "email",
      "reach",
      "where is",
      "location",
      "how to contact",
      "get in touch",
    )
  ) {
    return { text: CONTACT_INFO };
  }

  // ── Affiliation / University ──
  if (
    contains(
      msg,
      "affilia",
      "ktu",
      "university",
      "aicte",
      "approved",
      "accredit",
    )
  ) {
    return {
      text: `SNGCE is affiliated to **APJ Abdul Kalam Technological University (KTU)**, Kerala's premier technical university. It's also approved by **AICTE** (All India Council for Technical Education), ensuring quality standards across all programs. 🏅`,
    };
  }

  // ── Attendance ──
  if (
    contains(
      msg,
      "attendance",
      "absent",
      "present",
      "how many class",
      "attendance percentage",
    )
  ) {
    return {
      text: "KTU mandates a minimum **75% attendance** in all subjects to be eligible for exams. You can check your live attendance percentage in your **Student Dashboard** after logging in. Want me to take you there?",
    };
  }

  // ── Marks / Results ──
  if (
    contains(
      msg,
      "marks",
      "result",
      "grade",
      "cgpa",
      "sgpa",
      "exam result",
      "internal marks",
      "series exam",
    )
  ) {
    return {
      text: "Your marks and results are available in the **Student Dashboard**. This includes internal assessment marks, series exam scores, and semester results. CGPA is calculated based on KTU's grading system. Log in to check your records!",
    };
  }

  // ── Exam Timetable ──
  if (
    contains(msg, "exam", "timetable", "schedule", "when is exam", "exam date")
  ) {
    return {
      text: "Exam timetables are published by KTU and made available in your **Student Dashboard**. KTU generally conducts semester exams in November–December and April–May. Check the dashboard or KTU's official website for the latest schedule.",
    };
  }

  // ── Fees Due ──
  if (
    contains(
      msg,
      "fees due",
      "pending fee",
      "fee due",
      "pending payment",
      "overdue fee",
    )
  ) {
    return {
      text: "You can check your pending fees and payment status in the **Student Dashboard** under 'Fees Due'. Make sure to clear dues before the exam registration deadline. Need me to take you to the login page?",
    };
  }

  // ── KTU / Syllabus ──
  if (contains(msg, "syllabus", "curriculum", "ktu syllabus", "subject list")) {
    return {
      text: "SNGCE follows the **KTU (APJ Abdul Kalam Technological University)** syllabus. The curriculum is regularly updated to match industry trends. You can find the official syllabus on the KTU website: ktu.edu.in. Is there a specific subject or semester you're curious about?",
    };
  }

  // ── Extracurricular / Clubs ──
  if (
    contains(
      msg,
      "club",
      "activity",
      "extracurricular",
      "nss",
      "ncc",
      "cultural",
      "fest",
      "event",
      "techfest",
      "techno",
    )
  ) {
    return {
      text: "SNGCE has a vibrant campus life! There are technical clubs, NSS, NCC, arts & cultural groups, and the annual **TECHNO** fest where students showcase their innovations. The college also participates in inter-collegiate competitions across Kerala. 🎭🤖",
    };
  }

  // ── Bus / Transport ──
  if (contains(msg, "bus", "transport", "how to reach", "route", "commute")) {
    return {
      text: "SNGCE is located in Kadayirippu, Kolenchery, Ernakulam. There are regular KSRTC and private buses connecting the campus to Koothattukulam and Ernakulam town. The nearest major town is Kolenchery (~5 km). The college also runs its own bus service covering several routes in Ernakulam district for students and staff.",
    };
  }

  // ── Library ──
  if (
    contains(
      msg,
      "library",
      "book",
      "reference",
      "digital library",
      "e-library",
    )
  ) {
    return {
      text: "SNGCE's central library houses over **50,000 books** plus journals, references, and digital resources. Students also have access to **NPTEL** and **DELNET** digital libraries. Library hours are typically 9 AM – 5 PM on weekdays.",
    };
  }

  // ── Principal / Management ──
  if (
    contains(
      msg,
      "principal",
      "management",
      "chairman",
      "director",
      "head of college",
      "who runs",
    )
  ) {
    return {
      text: "SNGCE is managed by the **Sree Narayana Gurukulam Trust**, an institution deeply committed to quality education in the spirit of Sree Narayana Guru's philosophy of 'Education for Liberation'. The college is led by an experienced principal and a dedicated management team. You can reach the college at **0484-2597800** or email **info@sngce.ac.in** for direct contact.",
    };
  }

  // ── Jokes ──
  if (
    contains(
      msg,
      "joke",
      "funny",
      "make me laugh",
      "tell me a joke",
      "humour",
      "humor",
    )
  ) {
    const jokes = [
      "Why do engineers prefer dark mode? Because light attracts bugs! 😄",
      "Why was the computer cold? Because it left its Windows open! 💻❄️",
      "How many engineers does it take to change a lightbulb? One — they just redefine the problem as 'the room is dark'. 😂",
      "Why do programmers always mix up Christmas and Halloween? Because Oct 31 == Dec 25! 🎃🎄",
    ];
    return { text: pick(jokes) };
  }

  // ── Motivation / Inspiration ──
  if (
    contains(
      msg,
      "motivat",
      "inspir",
      "quote",
      "encourage",
      "feel sad",
      "stressed",
      "anxiety",
      "worried",
    )
  ) {
    const quotes = [
      "Remember: every expert was once a beginner. Keep pushing forward! The fact that you're here means you're already on the right path. 💪",
      "Engineering is not just a degree — it's a way of thinking. Stay curious, stay persistent! You've got this. 🌟",
      "Tough times don't last, but tough engineers do! Take a break, breathe, and come back stronger. 🔥",
      "Every challenge you face in college is shaping the problem-solver you'll become. Trust the process! 🎓",
    ];
    return { text: pick(quotes) };
  }

  // ── What can you do / help ──
  if (
    contains(
      msg,
      "what can you do",
      "help me",
      "what can you help",
      "how can you help",
      "what do you know",
      "capabilities",
    )
  ) {
    return {
      text: "Sure! Here's what I can help you with:\n\n**📚 Academic Info:** Courses, fees, faculty, departments, syllabus\n**🎓 Admissions:** How to apply, entrance exams, eligibility\n**🏫 Campus:** Facilities, hostel, transport, library, clubs\n**📊 Student Portal:** Attendance, marks, timetable, fee dues\n**🔗 Navigation:** Take you to any page — just ask!\n**💬 General Chat:** Questions, jokes, motivation, and more!\n\nWhat would you like to know?",
    };
  }

  // ── Context-aware follow-up: if last bot message mentioned courses ──
  if (historyLength > 0) {
    const lastBotMsg = [...history].reverse().find((h) => h.role === "model");
    if (lastBotMsg) {
      if (
        contains(
          msg,
          "yes",
          "yeah",
          "sure",
          "okay",
          "ok",
          "please",
          "take me",
        ) &&
        lastBotMsg.text.toLowerCase().includes("courses page")
      ) {
        return {
          text: "Alright, heading to the Courses page now! 📚",
          redirect: "/courses",
        };
      }
      if (
        contains(
          msg,
          "yes",
          "yeah",
          "sure",
          "okay",
          "ok",
          "please",
          "take me",
        ) &&
        lastBotMsg.text.toLowerCase().includes("fees page")
      ) {
        return {
          text: "Sure! Taking you to the Fees page now. 💰",
          redirect: "/fees",
        };
      }
      if (
        contains(
          msg,
          "yes",
          "yeah",
          "sure",
          "okay",
          "ok",
          "please",
          "take me",
        ) &&
        (lastBotMsg.text.toLowerCase().includes("faculty directory") ||
          lastBotMsg.text.toLowerCase().includes("faculty page"))
      ) {
        return {
          text: "On it! Taking you to the Faculty Directory. 👨‍🏫",
          redirect: "/faculty",
        };
      }
      if (
        contains(
          msg,
          "yes",
          "yeah",
          "sure",
          "okay",
          "ok",
          "please",
          "take me",
        ) &&
        (lastBotMsg.text.toLowerCase().includes("login") ||
          lastBotMsg.text.toLowerCase().includes("student dashboard"))
      ) {
        return {
          text: "Taking you to the login page now! 🔐",
          redirect: "/login",
        };
      }
    }
  }

  // ── Fallback ──
  return { text: pick(unknownResponses) };
}
