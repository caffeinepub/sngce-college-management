import { Badge } from "@/components/ui/badge";
import {
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Filter,
  GraduationCap,
  RefreshCw,
  ScrollText,
  Table,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const KTU_NOTIFICATIONS = [
  {
    id: 1,
    date: "2026-03-24",
    category: "Result",
    title:
      "B.Tech S5 (2019 Scheme) Regular/Supplementary Exam Results Published",
    link: "https://ktu.edu.in/exam/result",
  },
  {
    id: 2,
    date: "2026-03-15",
    category: "Timetable",
    title:
      "B.Tech S6 (2019 Scheme) Regular Examination April 2026 - Timetable Released",
    link: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 3,
    date: "2026-03-10",
    category: "Circular",
    title: "KTU Academic Calendar 2025-26 (Odd Semester) - Revised Schedule",
    link: "https://ktu.edu.in/notifications",
  },
  {
    id: 4,
    date: "2026-02-28",
    category: "Admission",
    title: "M.Tech Admissions 2026-27 - Application Portal Open",
    link: "https://ktu.edu.in/admissions",
  },
  {
    id: 5,
    date: "2026-02-20",
    category: "Result",
    title: "M.Tech S2 (2024 Scheme) Regular Exam Results Declared",
    link: "https://ktu.edu.in/exam/result",
  },
  {
    id: 6,
    date: "2026-02-15",
    category: "Exam",
    title: "Hall Ticket Download - B.Tech S6 April 2026 Exams",
    link: "https://ktu.edu.in/exam/hallticket",
  },
  {
    id: 7,
    date: "2026-01-30",
    category: "Circular",
    title: "KTU Fee Revision Notification for 2024 Scheme - Details Inside",
    link: "https://ktu.edu.in/notifications",
  },
  {
    id: 8,
    date: "2026-01-20",
    category: "Timetable",
    title: "MBA S2 April 2026 Examination Timetable Published",
    link: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 9,
    date: "2026-01-10",
    category: "Result",
    title: "B.Tech S3 (2024 Scheme) Supplementary Results Published",
    link: "https://ktu.edu.in/exam/result",
  },
  {
    id: 10,
    date: "2025-12-20",
    category: "Exam",
    title:
      "KTU End Semester Exams (Odd Sem 2025-26) Commencing from November 2025",
    link: "https://ktu.edu.in/notifications",
  },
];

const ODD_SEMESTER = [
  { event: "Semester Begins", date: "June 2025" },
  { event: "Series Exam 1", date: "July 2025" },
  { event: "Internal Assessment Window", date: "Aug – Sep 2025" },
  { event: "Series Exam 2", date: "Sep 2025" },
  { event: "End Semester Exams", date: "Nov 2025 – Jan 2026" },
  { event: "Results Published", date: "Feb – Mar 2026" },
];

const EVEN_SEMESTER = [
  { event: "Semester Begins", date: "Jan 2026" },
  { event: "Series Exam 1", date: "Feb 2026" },
  { event: "Series Exam 2", date: "Apr 2026" },
  { event: "End Semester Exams", date: "Apr 2026 – Jun 2026" },
  { event: "Results Published", date: "Jul – Aug 2026" },
];

const EXAM_TYPES = [
  {
    title: "B.Tech End Semester Exams",
    icon: GraduationCap,
    schedule: "Nov–Jan (Odd Sem) · Apr–Jun (Even Sem)",
    duration: "3 hours",
    pattern: "Theory + Practical",
    note: "Regular & Supplementary exams",
  },
  {
    title: "M.Tech End Semester Exams",
    icon: BookOpen,
    schedule: "Alongside B.Tech schedule",
    duration: "3 hours",
    pattern: "Theory + Special lab exams",
    note: "Lab exams scheduled separately",
  },
  {
    title: "MBA Semester Exams",
    icon: FileText,
    schedule: "Twice per year",
    duration: "3 hours",
    pattern: "Case study based",
    note: "Odd & Even semester cycles",
  },
  {
    title: "MCA Semester Exams",
    icon: ScrollText,
    schedule: "Alongside B.Tech schedule",
    duration: "3 hours",
    pattern: "Theory + Practical",
    note: "Follows B.Tech exam calendar",
  },
];

const RESULT_STEPS = [
  "Visit ktu.edu.in",
  'Click "Exam" → "Result"',
  "Select Programme, Scheme, Semester",
  "Enter Register Number",
  "View and download marksheet PDF",
];

const SCHEMES = [
  {
    name: "2015 Scheme",
    tag: "Legacy",
    tagColor: "bg-amber-500/20 text-amber-300",
    desc: "Original B.Tech curriculum. Now in final batches (supplementary only).",
    sems: "S1 – S8",
    credits: "160 credits",
    cgpa: "10-point scale",
  },
  {
    name: "2019 Scheme",
    tag: "Current (Most)",
    tagColor: "bg-blue-500/20 text-blue-300",
    desc: "Revised curriculum with updated syllabus. Current batch for most students.",
    sems: "S1 – S8",
    credits: "160 credits",
    cgpa: "10-point scale",
  },
  {
    name: "2024 Scheme",
    tag: "New",
    tagColor: "bg-emerald-500/20 text-emerald-300",
    desc: "NEP-aligned new curriculum with Honours/Minor tracks.",
    sems: "S1 – S8 + Honours/Minor",
    credits: "170+ credits",
    cgpa: "10-point scale",
  },
];

type TimetableEntry = {
  id: number;
  sem: string;
  program: string;
  scheme: string;
  type: string;
  examPeriod: string;
  startDate: string;
  description: string;
  downloadLink: string;
};

const KTU_TIMETABLES: TimetableEntry[] = [
  // ==================== 2024 SCHEME ====================
  // B.Tech 2024 Scheme
  {
    id: 1,
    sem: "S1",
    program: "B.Tech",
    scheme: "2024",
    type: "Regular/Supplementary",
    examPeriod: "Nov–Dec 2025",
    startDate: "15-11-2025",
    description: "B.Tech S1 (R,S) Exam Time Table (2024 scheme) Dec 2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 2,
    sem: "S1",
    program: "B.Tech",
    scheme: "2024",
    type: "Supplementary",
    examPeriod: "May 2025",
    startDate: "26-05-2025",
    description: "B.Tech S1 (S) Examination (2024 scheme) May 2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 3,
    sem: "S2",
    program: "B.Tech",
    scheme: "2024",
    type: "Regular",
    examPeriod: "Apr–May 2025",
    startDate: "05-05-2025",
    description: "B.Tech S2 (R) Examination (2024 scheme) May 2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 4,
    sem: "S2",
    program: "B.Tech",
    scheme: "2024",
    type: "Supplementary",
    examPeriod: "Jan 2026",
    startDate: "05-01-2026",
    description: "B.Tech S2 (S) Examination January 2026 (2024 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 5,
    sem: "S3",
    program: "B.Tech",
    scheme: "2024",
    type: "Regular",
    examPeriod: "Nov 2025",
    startDate: "13-11-2025",
    description:
      "B.Tech S3 (R) Examination Time Table November 2025 (2024 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 6,
    sem: "S3",
    program: "B.Tech",
    scheme: "2024",
    type: "Minor",
    examPeriod: "Jan 2026",
    startDate: "20-01-2026",
    description: "B.Tech S3 (Minor) Examination, Nov 2025 (2024 Admission)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // ==================== 2019 SCHEME ====================
  // B.Tech 2019 Scheme - S1
  {
    id: 7,
    sem: "S1",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Dec 2023",
    startDate: "19-12-2023",
    description: "B.Tech S1 (R,S) Examinations (2019 scheme) December 2023",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 8,
    sem: "S1",
    program: "B.Tech",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Dec 2025",
    startDate: "02-12-2025",
    description:
      "B.Tech S1 (S,FE) S2 (S,FE) Dec 2025 examination (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // B.Tech 2019 Scheme - S2
  {
    id: 9,
    sem: "S2",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Jun 2023",
    startDate: "10-06-2023",
    description:
      "B.Tech S2 Regular and Supplementary Examinations June 2023 (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 10,
    sem: "S2",
    program: "B.Tech",
    scheme: "2019",
    type: "Part-Time Supplementary",
    examPeriod: "Dec 2025",
    startDate: "08-01-2026",
    description: "B.Tech S2 (PT) (S,FE) Exam Dec 2025 (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // B.Tech 2019 Scheme - S3
  {
    id: 11,
    sem: "S3",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Dec 2023",
    startDate: "19-12-2023",
    description: "B.Tech S3 (R,S) Examinations (2019 scheme) December 2023",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 12,
    sem: "S3",
    program: "B.Tech",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Nov–Dec 2025",
    startDate: "02-12-2025",
    description: "B.Tech S3 (S,FE) Examinations November 2025 (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 13,
    sem: "S3",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular",
    examPeriod: "Apr–May 2025",
    startDate: "31-05-2025",
    description: "B.Tech S3 (S,FE) Exam Time Table (2019 Scheme) May 2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // B.Tech 2019 Scheme - S4
  {
    id: 14,
    sem: "S4",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Jun 2022",
    startDate: "10-06-2022",
    description:
      "B.Tech S4 Regular and Supplementary Examinations June 2022 (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 15,
    sem: "S4",
    program: "B.Tech",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Jan 2024",
    startDate: "08-01-2024",
    description: "B.Tech S4 (S,FE) Exam January 2024 (2019 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 16,
    sem: "S4",
    program: "B.Tech",
    scheme: "2019",
    type: "Honours",
    examPeriod: "May 2025",
    startDate: "27-05-2025",
    description: "B.Tech S4 Honours Exam Time Table May 2025 (2023 admission)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 17,
    sem: "S4",
    program: "B.Tech",
    scheme: "2019",
    type: "Minor",
    examPeriod: "May 2025",
    startDate: "29-05-2025",
    description: "B.Tech S4 Minor Exam Time Table May 2025 (2023 admission)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // B.Tech 2019 Scheme - S5
  {
    id: 18,
    sem: "S5",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Nov 2025",
    startDate: "12-11-2025",
    description: "B.Tech S5 (R,S) Examinations November 2025 (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 19,
    sem: "S5",
    program: "B.Tech",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "May 2025",
    startDate: "22-05-2025",
    description: "B.Tech S5 (S,FE) Exam Time Table May 2025 (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 20,
    sem: "S5",
    program: "B.Tech",
    scheme: "2019",
    type: "Honours",
    examPeriod: "Jan 2026",
    startDate: "13-01-2026",
    description: "B.Tech S5 (Honours) Examinations Nov 2025 (2023 Admission)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 21,
    sem: "S5",
    program: "B.Tech",
    scheme: "2019",
    type: "Minor",
    examPeriod: "Jan 2026",
    startDate: "20-01-2026",
    description: "B.Tech S5 (Minor) Examination Nov 2025 (2023 Admission)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // B.Tech 2019 Scheme - S6
  {
    id: 22,
    sem: "S6",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Apr–May 2026",
    startDate: "22-04-2026",
    description:
      "B.Tech S6 Regular & Supplementary Examinations April 2026 (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 23,
    sem: "S6",
    program: "B.Tech",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Dec 2025",
    startDate: "15-12-2025",
    description: "B.Tech S6 (S,FE) Exam Time Table (2019 scheme) Dec 2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 24,
    sem: "S6",
    program: "B.Tech",
    scheme: "2019",
    type: "Honours",
    examPeriod: "May 2025",
    startDate: "27-05-2025",
    description: "B.Tech S6 Honours Exam Time Table May 2025 (2022 admission)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 25,
    sem: "S6",
    program: "B.Tech",
    scheme: "2019",
    type: "Minor",
    examPeriod: "May 2025",
    startDate: "29-05-2025",
    description: "B.Tech S6 Minor Exam Time Table May 2025 (2022 admission)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // B.Tech 2019 Scheme - S7
  {
    id: 26,
    sem: "S7",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Nov 2025",
    startDate: "14-11-2025",
    description: "B.Tech S7 (R,S) Examinations November 2025 (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 27,
    sem: "S7",
    program: "B.Tech",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Apr 2025",
    startDate: "02-04-2025",
    description: "B.Tech S7 (S,FE) Exam Time Table April 2025 (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 28,
    sem: "S7",
    program: "B.Tech",
    scheme: "2019",
    type: "Honours",
    examPeriod: "Jan 2026",
    startDate: "13-01-2026",
    description: "B.Tech S7 (Honours) Examinations Nov 2025 (2022 Admission)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 29,
    sem: "S7",
    program: "B.Tech",
    scheme: "2019",
    type: "Minor",
    examPeriod: "Jan 2026",
    startDate: "20-01-2026",
    description: "B.Tech S7 (Minor) Examination Nov 2025 (2022 Admission)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // B.Tech 2019 Scheme - S8
  {
    id: 30,
    sem: "S8",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Apr 2025",
    startDate: "16-04-2025",
    description:
      "Revised B.Tech S8 (R,S) Exam Time Table April 2025 (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 31,
    sem: "S8",
    program: "B.Tech",
    scheme: "2019",
    type: "Supplementary",
    examPeriod: "Sep 2025",
    startDate: "24-09-2025",
    description: "B.Tech S8 (S) Exam September 2025 (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // Part-Time B.Tech 2019
  {
    id: 32,
    sem: "S1–S7",
    program: "B.Tech (Part-Time)",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Aug 2025",
    startDate: "02-08-2025",
    description:
      "Part Time B.Tech S1,S3,S5 (S,FE) Supplementary Exam Time Table May 2025 (2019 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 33,
    sem: "S2,S4,S6",
    program: "B.Tech (Part-Time)",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Jan 2024",
    startDate: "08-01-2024",
    description:
      "B.Tech Part-Time S2(S), S4(S), S6(S) Examinations (2019 scheme), January 2024",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // ==================== 2015 SCHEME ====================
  // B.Tech 2015 Scheme - Special/Supplementary
  {
    id: 34,
    sem: "S1–S2",
    program: "B.Tech",
    scheme: "2015",
    type: "Special Exam",
    examPeriod: "Aug 2025",
    startDate: "01-08-2025",
    description:
      "B.Tech S1,S2 Special Exam Time Table August 2025 (2015 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 35,
    sem: "S3",
    program: "B.Tech",
    scheme: "2015",
    type: "Special Exam",
    examPeriod: "Aug 2025",
    startDate: "02-08-2025",
    description: "B.Tech S3 Special Exam Time Table August 2025 (2015 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 36,
    sem: "S4",
    program: "B.Tech",
    scheme: "2015",
    type: "Special Exam",
    examPeriod: "Aug 2025",
    startDate: "12-08-2025",
    description: "B.Tech S4 Special Exam Time Table August 2025 (2015 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 37,
    sem: "S5",
    program: "B.Tech",
    scheme: "2015",
    type: "Special Exam",
    examPeriod: "Aug 2025",
    startDate: "01-08-2025",
    description: "B.Tech S5 Special Exam Time Table August 2025 (2015 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 38,
    sem: "S6",
    program: "B.Tech",
    scheme: "2015",
    type: "Special Exam",
    examPeriod: "Aug 2025",
    startDate: "02-08-2025",
    description: "B.Tech S6 Special Exam Time Table August 2025 (2015 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 39,
    sem: "S7",
    program: "B.Tech",
    scheme: "2015",
    type: "Special Exam",
    examPeriod: "Aug 2025",
    startDate: "04-08-2025",
    description: "B.Tech S7 Special Exam Time Table August 2025 (2015 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 40,
    sem: "S8",
    program: "B.Tech",
    scheme: "2015",
    type: "Special Exam",
    examPeriod: "Aug 2025",
    startDate: "05-08-2025",
    description:
      "B.Tech S8 Special Examination August 2025 (2015 scheme) incl. Part-Time",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 41,
    sem: "S1–S7 (PT)",
    program: "B.Tech (Part-Time)",
    scheme: "2015",
    type: "Supplementary",
    examPeriod: "Aug 2025",
    startDate: "02-08-2025",
    description:
      "B.Tech S1–S7 Part-Time (S,FE) Exam Time August 2025 (2015 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // ==================== M.TECH ====================
  {
    id: 42,
    sem: "S1",
    program: "M.Tech",
    scheme: "2024",
    type: "Regular/Supplementary",
    examPeriod: "Dec 2025",
    startDate: "29-12-2025",
    description: "M.Tech S1 (R,S) Exam Time Table December 2025 (2022 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 43,
    sem: "S2",
    program: "M.Tech",
    scheme: "2024",
    type: "Regular/Supplementary",
    examPeriod: "May–Aug 2025",
    startDate: "31-07-2025",
    description: "M.Tech S2 (R,S) Exam Time Table May 2025 (2022 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 44,
    sem: "S2",
    program: "M.Tech",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Jan 2026",
    startDate: "14-01-2026",
    description: "M.Tech S2 (S,FE) Examinations Jan 2026 (2022 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 45,
    sem: "S1",
    program: "M.Tech",
    scheme: "2015",
    type: "Special Exam",
    examPeriod: "Sep 2025",
    startDate: "10-09-2025",
    description:
      "M.Tech S1 (Special Exam) August 2025 (2015 Scheme) incl. Part-Time",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 46,
    sem: "S3",
    program: "M.Tech",
    scheme: "2015",
    type: "Special Exam",
    examPeriod: "Sep 2025",
    startDate: "20-09-2025",
    description:
      "M.Tech S3 (Special Exam) August 2025 (2015 Scheme) incl. Part-Time",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // ==================== MBA ====================
  {
    id: 47,
    sem: "S1",
    program: "MBA",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "May–Jun 2025",
    startDate: "26-05-2025",
    description: "MBA S1 (S,FE) & MBA S2 (R,S) Examination May/June 2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 48,
    sem: "S2",
    program: "MBA",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "May–Jun 2025",
    startDate: "26-05-2025",
    description: "MBA S2 (R,S) Examination May/June 2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 49,
    sem: "S2",
    program: "MBA",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Jan 2026",
    startDate: "03-01-2026",
    description: "MBA S2 (S,FE) JAN 2026 (2020 SCHEME)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 50,
    sem: "S3",
    program: "MBA",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "May–Jun 2025",
    startDate: "27-05-2025",
    description: "MBA S3 (S,FE) Incl. PT Exam Time Table May/June 2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 51,
    sem: "S4",
    program: "MBA",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Apr–May 2025",
    startDate: "21-04-2025",
    description: "MBA S4 (R,S) April/May 2025 Including MBA S4 (PT) (S,FE)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 52,
    sem: "S4",
    program: "MBA",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Jan 2026",
    startDate: "17-01-2026",
    description: "MBA S4 (S,FE) Incl PT Examination Jan 2026 (2020 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  // ==================== MCA ====================
  {
    id: 53,
    sem: "S1–S2",
    program: "MCA",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Dec 2025",
    startDate: "15-12-2025",
    description: "MCA 2 Year S1 (R,S) Exam Time Table Dec 2025 (2020 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 54,
    sem: "S2",
    program: "MCA",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Jan 2026",
    startDate: "05-01-2026",
    description: "MCA 2 Year S2 (S,FE) Exam Dec 2025 (2020 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 55,
    sem: "S3–S9 (Int.)",
    program: "MCA (Integrated)",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Nov 2025",
    startDate: "18-11-2025",
    description:
      "MCA Integrated S3(R,S), S5(R,S), S7(R,S) & S9(R,S) examination Nov 2025 (2020 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 56,
    sem: "S4,S8 (Int.)",
    program: "MCA (Integrated)",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Jan 2026",
    startDate: "09-01-2026",
    description: "MCA Integrated S4 (S,FE) Dec 2025 (2020 scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 57,
    sem: "S8",
    program: "MCA (Integrated)",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Jan 2026",
    startDate: "02-02-2026",
    description:
      "Revised Detailed Time Table MCA Integrated S8 (S,FE) examination Jan 2026 (2020 Scheme)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    id: 58,
    sem: "All",
    program: "MCA (Integrated)",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "May–Jun 2025",
    startDate: "04-06-2025",
    description:
      "MCA Integrated exam time table (2020 Scheme) May/June 2025 – Even (R,S)/Odd (S,FE)",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
];

const PROGRAMS = [
  "All",
  "B.Tech",
  "B.Tech (Part-Time)",
  "M.Tech",
  "MBA",
  "MCA",
  "MCA (Integrated)",
];
const SEMESTERS = ["All", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
const SCHEME_FILTERS = ["All", "2015", "2019", "2024"];
const EXAM_TYPE_FILTERS = [
  "All",
  "Regular",
  "Supplementary",
  "Special",
  "Honours",
  "Minor",
  "Part-Time",
];

export default function KTUPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [filterProgram, setFilterProgram] = useState("All");
  const [filterSem, setFilterSem] = useState("All");
  const [filterScheme, setFilterScheme] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [notifCount, setNotifCount] = useState(10);

  const filteredTimetables = KTU_TIMETABLES.filter((t) => {
    const matchProgram = filterProgram === "All" || t.program === filterProgram;
    const matchSem =
      filterSem === "All" ||
      t.sem.includes(filterSem.replace("S", "")) ||
      t.sem === filterSem;
    const matchScheme = filterScheme === "All" || t.scheme === filterScheme;
    const matchType =
      filterType === "All" ||
      (filterType === "Regular" && t.type.includes("Regular")) ||
      (filterType === "Supplementary" &&
        (t.type.includes("Supplementary") || t.type.includes("FE"))) ||
      (filterType === "Special" && t.type.includes("Special")) ||
      (filterType === "Honours" && t.type.includes("Honours")) ||
      (filterType === "Minor" && t.type.includes("Minor")) ||
      (filterType === "Part-Time" && t.type.includes("Part-Time"));
    return matchProgram && matchSem && matchScheme && matchType;
  });

  const handleDownload = (entry: TimetableEntry) => {
    const url = entry.downloadLink;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <img
          src="https://sngce.ac.in/user/images/college1.jpg"
          alt="SNGCE campus"
          className="w-full h-full object-cover"
          style={{
            filter: isDark
              ? "brightness(0.55) saturate(0.8)"
              : "brightness(0.70) saturate(0.9)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.40) 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.30) 100%)",
          }}
        />
      </div>

      <div className="relative pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 glass-sm px-4 py-1.5 rounded-full text-xs font-medium text-muted-foreground mb-4">
              <GraduationCap size={12} />
              KTU · APJ Abdul Kalam Technological University
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">
              KTU Information Hub
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Exam timetables, results, notifications, and academic calendar for
              SNGCE students
            </p>
          </div>

          {/* KTU Overview */}
          <section>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex-1">
                  <h2 className="font-display font-bold text-xl text-foreground mb-1">
                    APJ Abdul Kalam Technological University
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    Autonomous technological university of Kerala, overseeing
                    engineering education across the state.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                    {[
                      {
                        label: "Headquarters",
                        value: "CET Campus, Thiruvananthapuram",
                      },
                      { label: "Established", value: "2015" },
                      { label: "Affiliated Colleges", value: "170+" },
                    ].map((item) => (
                      <div key={item.label} className="glass-sm rounded-xl p-3">
                        <p className="text-muted-foreground text-[10px] uppercase tracking-wide mb-0.5">
                          {item.label}
                        </p>
                        <p className="font-semibold text-foreground text-sm">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="glass-sm rounded-xl p-3 flex items-start gap-2.5 mb-5">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-foreground text-sm">
                      <span className="font-semibold">SNGCE Affiliation:</span>{" "}
                      <span className="text-muted-foreground">
                        SNGCE is affiliated to KTU. All B.Tech, M.Tech, MBA, and
                        MCA programs follow KTU regulations.
                      </span>
                    </p>
                  </div>
                  <a
                    href="https://ktu.edu.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-foreground"
                  >
                    <ExternalLink size={14} />
                    Visit ktu.edu.in
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* EXAM TIMETABLE SECTION */}
          <section>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2">
                <Table size={18} className="text-foreground/70" />
                <h2 className="font-display font-bold text-xl text-foreground">
                  Semester Exam Timetable
                </h2>
              </div>
              <p className="text-muted-foreground text-sm mb-1">
                All semester and supplementary exam timetables for B.Tech,
                M.Tech, MBA and MCA — 2015, 2019 and 2024 schemes.
              </p>
              <div className="glass-sm rounded-xl px-3 py-2 mb-5 flex items-start gap-2">
                <Download
                  size={13}
                  className="text-blue-400 flex-shrink-0 mt-0.5"
                />
                <p className="text-muted-foreground text-xs">
                  Click{" "}
                  <span className="font-semibold text-foreground">
                    Download Timetable
                  </span>{" "}
                  to open the official KTU exam timetable portal at{" "}
                  <a
                    href="https://ktu.edu.in/exam/timetable"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-2"
                  >
                    app.ktu.edu.in
                  </a>{" "}
                  where you can download the exact PDF for any exam directly.
                </p>
              </div>

              {/* Filters Row 1 - Programme */}
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-1.5 mr-1">
                  <Filter size={12} className="text-muted-foreground" />
                  <span className="text-muted-foreground text-xs font-medium">
                    Programme:
                  </span>
                </div>
                {PROGRAMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFilterProgram(p)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      filterProgram === p
                        ? "bg-foreground/20 text-foreground border border-foreground/30"
                        : "glass-sm text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Filters Row 2 - Semester */}
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-1.5 mr-1">
                  <Filter size={12} className="text-muted-foreground" />
                  <span className="text-muted-foreground text-xs font-medium">
                    Semester:
                  </span>
                </div>
                {SEMESTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilterSem(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      filterSem === s
                        ? "bg-foreground/20 text-foreground border border-foreground/30"
                        : "glass-sm text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Filters Row 3 - Scheme */}
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-1.5 mr-1">
                  <Filter size={12} className="text-muted-foreground" />
                  <span className="text-muted-foreground text-xs font-medium">
                    Scheme:
                  </span>
                </div>
                {SCHEME_FILTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilterScheme(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      filterScheme === s
                        ? "bg-foreground/20 text-foreground border border-foreground/30"
                        : "glass-sm text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Filters Row 4 - Type */}
              <div className="flex flex-wrap gap-2 mb-5">
                <div className="flex items-center gap-1.5 mr-1">
                  <Filter size={12} className="text-muted-foreground" />
                  <span className="text-muted-foreground text-xs font-medium">
                    Exam Type:
                  </span>
                </div>
                {EXAM_TYPE_FILTERS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      filterType === t
                        ? "bg-foreground/20 text-foreground border border-foreground/30"
                        : "glass-sm text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Timetable count */}
              <p className="text-muted-foreground text-xs mb-3">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredTimetables.length}
                </span>{" "}
                timetable{filteredTimetables.length !== 1 ? "s" : ""}
              </p>

              {/* Timetable list */}
              {filteredTimetables.length === 0 ? (
                <div className="glass-sm rounded-xl p-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    No timetables found for the selected filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTimetables.map((entry) => (
                    <div
                      key={entry.id}
                      className="glass-sm rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="font-semibold text-foreground text-sm">
                            {entry.program} {entry.sem}
                          </span>
                          <Badge
                            className={`text-[10px] px-1.5 py-0 ${
                              entry.scheme === "2024"
                                ? "bg-emerald-500/20 text-emerald-300 border-0"
                                : entry.scheme === "2019"
                                  ? "bg-blue-500/20 text-blue-300 border-0"
                                  : "bg-amber-500/20 text-amber-300 border-0"
                            }`}
                          >
                            {entry.scheme} Scheme
                          </Badge>
                          <Badge
                            className={`text-[10px] px-1.5 py-0 ${
                              entry.type.includes("Regular")
                                ? "bg-purple-500/20 text-purple-300 border-0"
                                : entry.type.includes("Special")
                                  ? "bg-orange-500/20 text-orange-300 border-0"
                                  : entry.type.includes("Honours")
                                    ? "bg-pink-500/20 text-pink-300 border-0"
                                    : entry.type.includes("Minor")
                                      ? "bg-indigo-500/20 text-indigo-300 border-0"
                                      : "bg-red-500/20 text-red-300 border-0"
                            }`}
                          >
                            {entry.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs leading-snug">
                          {entry.description}
                        </p>
                        <p className="text-muted-foreground text-[10px] mt-0.5">
                          Exam Period:{" "}
                          <span className="text-foreground/70">
                            {entry.examPeriod}
                          </span>
                          {" · "}
                          Starts:{" "}
                          <span className="text-foreground/70">
                            {entry.startDate}
                          </span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload(entry)}
                        className="glass-btn flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-foreground whitespace-nowrap"
                      >
                        <Download size={12} />
                        Download Timetable
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* NOTIFICATIONS */}
          <section>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-foreground/70" />
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Live Notifications
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifCount((n) => (n === 10 ? 5 : 10))}
                  className="glass-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  <RefreshCw size={11} />
                  Refresh
                </button>
              </div>
              <div className="space-y-2">
                {KTU_NOTIFICATIONS.slice(0, notifCount).map((n) => (
                  <a
                    key={n.id}
                    href={n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-sm rounded-xl p-3 flex items-start gap-3 hover:bg-white/5 transition-colors block"
                  >
                    <Badge
                      className={`text-[10px] px-2 py-0.5 flex-shrink-0 mt-0.5 border-0 ${
                        n.category === "Result"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : n.category === "Timetable"
                            ? "bg-blue-500/20 text-blue-300"
                            : n.category === "Exam"
                              ? "bg-purple-500/20 text-purple-300"
                              : n.category === "Admission"
                                ? "bg-pink-500/20 text-pink-300"
                                : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {n.category}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm leading-snug">
                        {n.title}
                      </p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">
                        {n.date}
                      </p>
                    </div>
                    <ExternalLink
                      size={12}
                      className="text-muted-foreground flex-shrink-0 mt-1"
                    />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* EXAM DETAILS */}
          <section>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-foreground/70" />
                <h2 className="font-display font-bold text-xl text-foreground">
                  Exam Details
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXAM_TYPES.map((e) => (
                  <div key={e.title} className="glass-sm rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <e.icon size={15} className="text-foreground/70" />
                      <h3 className="font-semibold text-foreground text-sm">
                        {e.title}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {[
                        { label: "Schedule", value: e.schedule },
                        { label: "Duration", value: e.duration },
                        { label: "Pattern", value: e.pattern },
                        { label: "Note", value: e.note },
                      ].map((item) => (
                        <div key={item.label} className="flex gap-2">
                          <span className="text-muted-foreground text-xs w-16 flex-shrink-0">
                            {item.label}:
                          </span>
                          <span className="text-foreground text-xs">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RESULTS */}
          <section>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-foreground/70" />
                <h2 className="font-display font-bold text-xl text-foreground">
                  Results
                </h2>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                How to check your KTU exam results:
              </p>
              <ol className="space-y-2 mb-5">
                {RESULT_STEPS.map((step, i) => (
                  <li
                    key={step}
                    className="glass-sm rounded-xl p-3 flex items-center gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-foreground text-sm">{step}</span>
                  </li>
                ))}
              </ol>
              <a
                href="https://ktu.edu.in/exam/result"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-foreground"
              >
                <ExternalLink size={14} />
                Check Results on KTU Portal
              </a>
            </div>
          </section>

          {/* ACADEMIC CALENDAR */}
          <section>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-foreground/70" />
                <h2 className="font-display font-bold text-xl text-foreground">
                  Academic Calendar 2025–26
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-3">
                    Odd Semester (Jul–Dec)
                  </h3>
                  <div className="space-y-2">
                    {ODD_SEMESTER.map((item) => (
                      <div
                        key={item.event}
                        className="glass-sm rounded-xl p-3 flex justify-between items-center"
                      >
                        <span className="text-muted-foreground text-sm">
                          {item.event}
                        </span>
                        <span className="font-medium text-foreground text-sm">
                          {item.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-3">
                    Even Semester (Jan–Jun)
                  </h3>
                  <div className="space-y-2">
                    {EVEN_SEMESTER.map((item) => (
                      <div
                        key={item.event}
                        className="glass-sm rounded-xl p-3 flex justify-between items-center"
                      >
                        <span className="text-muted-foreground text-sm">
                          {item.event}
                        </span>
                        <span className="font-medium text-foreground text-sm">
                          {item.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* REGULATIONS */}
          <section>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <ScrollText size={18} className="text-foreground/70" />
                <h2 className="font-display font-bold text-xl text-foreground">
                  KTU Regulations
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SCHEMES.map((s) => (
                  <div key={s.name} className="glass-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground text-sm">
                        {s.name}
                      </h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.tagColor}`}
                      >
                        {s.tag}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs mb-3">
                      {s.desc}
                    </p>
                    <div className="space-y-1">
                      {[
                        { label: "Semesters", value: s.sems },
                        { label: "Credits", value: s.credits },
                        { label: "CGPA", value: s.cgpa },
                      ].map((item) => (
                        <div key={item.label} className="flex gap-2">
                          <span className="text-muted-foreground text-xs w-16 flex-shrink-0">
                            {item.label}:
                          </span>
                          <span className="text-foreground text-xs">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 glass-sm rounded-xl p-3">
                <p className="text-muted-foreground text-xs">
                  <span className="font-semibold text-foreground">
                    Attendance Rule:
                  </span>{" "}
                  Minimum 75% attendance required in each subject. Students with
                  less than 75% are detained from appearing in end semester
                  exams.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
