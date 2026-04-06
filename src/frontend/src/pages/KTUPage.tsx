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
    points: [
      "For students admitted 2015–2018",
      "10-point CGPA grading",
      "75% attendance mandatory",
      "Credit and semester system",
    ],
  },
  {
    name: "2019 Scheme",
    tag: "Ongoing",
    tagColor: "bg-emerald-500/20 text-emerald-300",
    points: [
      "For students admitted 2019–2023",
      "10-point CGPA grading",
      "75% attendance per subject",
      "Revised elective and credit structure",
    ],
  },
  {
    name: "2024 Scheme",
    tag: "Latest",
    tagColor: "bg-blue-500/20 text-blue-300",
    points: [
      "For students admitted 2024 onwards",
      "NEP 2020 aligned curriculum",
      "75% attendance mandatory",
      "Enhanced practical and project component",
    ],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Result: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Timetable: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Circular: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Admission: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Exam: "bg-red-500/20 text-red-300 border-red-500/30",
};

type TimetableEntry = {
  sem: string;
  program: string;
  scheme: string;
  type: string;
  examPeriod: string;
  startDate: string;
  downloadLink: string;
};

const KTU_TIMETABLES: TimetableEntry[] = [
  {
    sem: "S1",
    program: "B.Tech",
    scheme: "2024",
    type: "Regular",
    examPeriod: "Nov–Dec 2025",
    startDate: "15-11-2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S2",
    program: "B.Tech",
    scheme: "2024",
    type: "Regular/Supplementary",
    examPeriod: "Apr–May 2026",
    startDate: "15-04-2026",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S3",
    program: "B.Tech",
    scheme: "2024",
    type: "Regular",
    examPeriod: "Nov–Dec 2025",
    startDate: "12-11-2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S3",
    program: "B.Tech",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Nov–Dec 2025",
    startDate: "02-12-2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S4",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Apr–May 2026",
    startDate: "20-04-2026",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S5",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Nov 2025",
    startDate: "10-11-2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S6",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Apr–May 2026",
    startDate: "22-04-2026",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S7",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Nov 2025",
    startDate: "14-11-2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S7",
    program: "B.Tech",
    scheme: "2015",
    type: "Supplementary/FE",
    examPeriod: "Nov–Dec 2025",
    startDate: "01-12-2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S8",
    program: "B.Tech",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Apr–May 2026",
    startDate: "17-04-2026",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S8",
    program: "B.Tech",
    scheme: "2015",
    type: "Supplementary/FE",
    examPeriod: "Apr–May 2026",
    startDate: "25-04-2026",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S1",
    program: "M.Tech",
    scheme: "2024",
    type: "Regular",
    examPeriod: "Dec 2025",
    startDate: "10-12-2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S2",
    program: "M.Tech",
    scheme: "2024",
    type: "Regular/Supplementary",
    examPeriod: "May 2026",
    startDate: "05-05-2026",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S1",
    program: "M.Tech",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Dec 2025",
    startDate: "15-12-2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S2",
    program: "M.Tech",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "May 2026",
    startDate: "08-05-2026",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S1",
    program: "MBA",
    scheme: "2019",
    type: "Supplementary/FE",
    examPeriod: "Nov–Dec 2025",
    startDate: "20-11-2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S2",
    program: "MBA",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Apr 2026",
    startDate: "10-04-2026",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S3",
    program: "MBA",
    scheme: "2019",
    type: "Regular",
    examPeriod: "Nov 2025",
    startDate: "11-11-2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S4",
    program: "MBA",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Apr–May 2026",
    startDate: "16-04-2026",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S1",
    program: "MCA",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Nov–Dec 2025",
    startDate: "18-11-2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S2",
    program: "MCA",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Apr–May 2026",
    startDate: "14-04-2026",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S3",
    program: "MCA",
    scheme: "2019",
    type: "Regular",
    examPeriod: "Nov 2025",
    startDate: "13-11-2025",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
  {
    sem: "S4",
    program: "MCA",
    scheme: "2019",
    type: "Regular/Supplementary",
    examPeriod: "Apr–May 2026",
    startDate: "19-04-2026",
    downloadLink: "https://ktu.edu.in/exam/timetable",
  },
];

const PROGRAMS = ["All", "B.Tech", "M.Tech", "MBA", "MCA"];
const SEMESTERS = ["All", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
const SCHEME_FILTERS = ["All", "2015", "2019", "2024"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function KTUPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [filterProgram, setFilterProgram] = useState("All");
  const [filterSem, setFilterSem] = useState("All");
  const [filterScheme, setFilterScheme] = useState("All");

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const filteredTimetables = KTU_TIMETABLES.filter((t) => {
    const matchProgram = filterProgram === "All" || t.program === filterProgram;
    const matchSem = filterSem === "All" || t.sem === filterSem;
    const matchScheme = filterScheme === "All" || t.scheme === filterScheme;
    return matchProgram && matchSem && matchScheme;
  });

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
              <p className="text-muted-foreground text-sm mb-4">
                Official KTU exam timetables for all programmes and semesters.
                Click{" "}
                <span className="font-medium text-foreground">
                  Download Timetable
                </span>{" "}
                to get the latest PDF directly from ktu.edu.in.
              </p>

              <div className="glass-sm rounded-xl px-3 py-2 mb-5 flex items-center gap-2">
                <ExternalLink
                  size={12}
                  className="text-blue-400 flex-shrink-0"
                />
                <p className="text-muted-foreground text-xs">
                  All timetable PDFs are hosted on the official KTU portal.{" "}
                  <a
                    href="https://ktu.edu.in/exam/timetable"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-2 font-medium"
                  >
                    ktu.edu.in/exam/timetable
                  </a>{" "}
                  — updated in real time by KTU.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1.5 mr-2">
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
                    data-ocid="ktu.tab"
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
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1.5 mr-2">
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
                    data-ocid="ktu.tab"
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
              <div className="flex flex-wrap gap-2 mb-5">
                <div className="flex items-center gap-1.5 mr-2">
                  <Filter size={12} className="text-muted-foreground" />
                  <span className="text-muted-foreground text-xs font-medium">
                    Scheme:
                  </span>
                </div>
                {SCHEME_FILTERS.map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setFilterScheme(sc)}
                    data-ocid="ktu.tab"
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      filterScheme === sc
                        ? "bg-foreground/20 text-foreground border border-foreground/30"
                        : "glass-sm text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sc === "All" ? "All Schemes" : `${sc} Scheme`}
                  </button>
                ))}
              </div>

              {/* Timetable Cards */}
              {filteredTimetables.length === 0 ? (
                <div
                  className="glass-sm rounded-xl p-6 text-center"
                  data-ocid="ktu.empty_state"
                >
                  <p className="text-muted-foreground text-sm">
                    No timetables found for the selected filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredTimetables.map((t, idx) => (
                    <div
                      key={t.program + t.sem + t.scheme + t.examPeriod + t.type}
                      data-ocid={`ktu.item.${idx + 1}`}
                      className="glass-sm rounded-xl p-4 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="glass px-2 py-0.5 rounded-full text-xs font-bold text-foreground">
                            {t.program} {t.sem}
                          </span>
                          <span className="text-muted-foreground text-xs bg-white/5 px-2 py-0.5 rounded-full">
                            {t.scheme} Scheme
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs w-20">
                          Type
                        </span>
                        <span className="text-foreground text-xs">
                          {t.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs w-20">
                          Exam Period
                        </span>
                        <span className="text-foreground text-xs font-medium">
                          {t.examPeriod}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs w-20">
                          Starts
                        </span>
                        <span className="text-foreground text-xs">
                          {t.startDate}
                        </span>
                      </div>
                      <a
                        href={t.downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid="ktu.button"
                        className="mt-1 glass-btn inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground w-full"
                      >
                        <Download size={12} />
                        Download Timetable (ktu.edu.in)
                      </a>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 flex justify-center">
                <a
                  href="https://ktu.edu.in/exam/timetable"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-foreground"
                >
                  <ExternalLink size={14} />
                  View All Timetables on ktu.edu.in
                </a>
              </div>
            </div>
          </section>

          {/* Live Notifications */}
          <section>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-foreground/70" />
                  <h2 className="font-display font-bold text-xl text-foreground">
                    KTU Live Notifications
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  data-ocid="ktu.button"
                  className="glass-btn flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw size={12} />
                  Refresh
                </button>
              </div>
              <p className="text-muted-foreground text-xs mb-1">
                Last updated:{" "}
                {lastUpdated.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <div className="glass-sm rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
                <ExternalLink
                  size={12}
                  className="text-muted-foreground flex-shrink-0"
                />
                <p className="text-muted-foreground text-xs">
                  Visit{" "}
                  <a
                    href="https://ktu.edu.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-2"
                  >
                    ktu.edu.in
                  </a>{" "}
                  for the latest real-time updates
                </p>
              </div>
              <div className="divide-y divide-white/5">
                {KTU_NOTIFICATIONS.map((notif) => (
                  <a
                    key={notif.id}
                    href={notif.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 py-3 group hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border whitespace-nowrap mt-0.5 ${CATEGORY_COLORS[notif.category]}`}
                    >
                      {notif.category}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm leading-snug group-hover:underline underline-offset-2 line-clamp-2">
                        {notif.title}
                      </p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {formatDate(notif.date)}
                      </p>
                    </div>
                    <ExternalLink
                      size={12}
                      className="text-muted-foreground group-hover:text-foreground mt-1 flex-shrink-0"
                    />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Exam Details */}
          <section>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="font-display font-bold text-xl text-foreground mb-5">
                KTU Examination Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {EXAM_TYPES.map((exam) => {
                  const Icon = exam.icon;
                  return (
                    <div key={exam.title} className="glass-sm rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="glass w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon size={15} className="text-foreground/70" />
                        </div>
                        <h3 className="font-semibold text-foreground text-sm leading-tight">
                          {exam.title}
                        </h3>
                      </div>
                      <div className="space-y-1.5">
                        {[
                          ["Schedule", exam.schedule],
                          ["Duration", exam.duration],
                          ["Pattern", exam.pattern],
                          ["Note", exam.note],
                        ].map(([label, val]) => (
                          <div key={label} className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs w-20 flex-shrink-0">
                              {label}
                            </span>
                            <span className="text-foreground text-xs">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="glass-sm rounded-xl p-4 mb-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={15}
                    className="text-blue-400 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-foreground text-sm font-semibold mb-0.5">
                      Hall Ticket Download
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Hall tickets are available on the KTU portal{" "}
                      <span className="font-medium text-foreground">
                        7–10 days before the exam
                      </span>
                      . Students must download and verify before the exam.
                    </p>
                  </div>
                </div>
              </div>
              <a
                href="https://ktu.edu.in/exam/hallticket"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-foreground"
              >
                <ExternalLink size={14} />
                Download Hall Ticket
              </a>
            </div>
          </section>

          {/* Results */}
          <section>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="font-display font-bold text-xl text-foreground mb-2">
                KTU Results
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                Results are published on the official KTU portal. Check using
                your KTU ID and register number.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-5">
                {RESULT_STEPS.map((step, i) => (
                  <div
                    key={step}
                    className="glass-sm rounded-xl p-3 flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center">
                      <span className="text-foreground font-bold text-xs">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-foreground text-xs leading-snug">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
              <div className="glass-sm rounded-xl p-3 mb-5 flex items-start gap-2.5">
                <Bell
                  size={14}
                  className="text-amber-400 mt-0.5 flex-shrink-0"
                />
                <p className="text-muted-foreground text-xs">
                  <span className="font-semibold text-foreground">
                    Revaluation / Scrutiny:
                  </span>{" "}
                  Applications within{" "}
                  <span className="text-foreground font-medium">15 days</span>{" "}
                  of result publication on ktu.edu.in.
                </p>
              </div>
              <a
                href="https://ktu.edu.in/exam/result"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-foreground"
              >
                <ExternalLink size={14} />
                Check Results Now
              </a>
            </div>
          </section>

          {/* Academic Calendar */}
          <section>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <Calendar size={18} className="text-foreground/70" />
                <h2 className="font-display font-bold text-xl text-foreground">
                  Academic Calendar 2025-26
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Odd Semester", rows: ODD_SEMESTER },
                  { label: "Even Semester", rows: EVEN_SEMESTER },
                ].map(({ label, rows }) => (
                  <div key={label}>
                    <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                      <span className="glass-sm px-2 py-0.5 rounded-full text-xs">
                        {label}
                      </span>
                      <span className="text-muted-foreground font-normal text-xs">
                        2025-26
                      </span>
                    </h3>
                    <div className="space-y-2">
                      {rows.map((row) => (
                        <div
                          key={row.event}
                          className="flex items-center justify-between glass-sm rounded-lg px-3 py-2"
                        >
                          <span className="text-foreground text-xs">
                            {row.event}
                          </span>
                          <span className="text-muted-foreground text-xs font-medium">
                            {row.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Regulations */}
          <section>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="font-display font-bold text-xl text-foreground mb-2">
                KTU Regulations Overview
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                KTU currently has three active schemes. Key rules apply to all
                schemes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {SCHEMES.map((scheme) => (
                  <div key={scheme.name} className="glass-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground text-sm">
                        {scheme.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${scheme.tagColor}`}
                      >
                        {scheme.tag}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {scheme.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-1.5">
                          <CheckCircle2
                            size={11}
                            className="text-emerald-400 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-muted-foreground text-xs">
                            {pt}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="glass-sm rounded-xl p-4 mb-5">
                <h3 className="font-semibold text-foreground text-sm mb-3">
                  Common Rules (All Schemes)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {[
                    ["Minimum Attendance", "75% per subject (mandatory)"],
                    ["Theory Pass Mark", "40% in theory papers"],
                    ["Practical Pass Mark", "50% in practical exams"],
                    ["Grading Scale", "10-point CGPA scale"],
                    ["Supplementary Exams", "Available after each semester"],
                    ["Backlogs", "Cleared through supplementary exams"],
                  ].map(([key, val]) => (
                    <div key={key} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="text-foreground text-xs font-medium">
                          {key}:{" "}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {val}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <a
                href="https://ktu.edu.in/regulation"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-foreground"
              >
                <ExternalLink size={14} />
                View KTU Regulations
              </a>
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t border-white/10 px-4 sm:px-6 py-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()}. Built with love by SNGCE
          </p>
        </div>
      </footer>
    </div>
  );
}
