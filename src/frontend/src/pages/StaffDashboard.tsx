import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Plus, Save, Search, ShieldCheck } from "lucide-react";
import type { ElementType } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ClassAttendanceSession } from "../backend.d";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useActor } from "../hooks/useActor";

type StaffTab = "overview" | "classAttendance";

export function StaffDashboard() {
  const { isLoggedIn, role, userName } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<StaffTab>("overview");

  useEffect(() => {
    if (!isLoggedIn || role !== "staff") {
      navigate({ to: "/login" });
    }
  }, [isLoggedIn, role, navigate]);

  if (!isLoggedIn || role !== "staff") return null;

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <img
          src="https://sngce.ac.in/user/images/college1.jpg"
          alt="Campus"
          className="w-full h-full object-cover"
          style={{
            filter: isDark
              ? "grayscale(60%) brightness(0.20)"
              : "grayscale(20%) brightness(0.75)",
          }}
        />
        <div
          className={
            isDark
              ? "bg-overlay absolute inset-0"
              : "bg-overlay-light absolute inset-0"
          }
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="glass rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="glass-sm w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-foreground/70" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              {userName}
            </h1>
            <p className="text-muted-foreground text-sm">
              Staff Dashboard · Student Management
            </p>
          </div>
        </div>

        <div
          className="glass rounded-2xl p-1.5 mb-6 flex gap-1"
          data-ocid="staff.tab"
        >
          {(
            [
              { key: "overview", label: "Overview", icon: ShieldCheck },
              {
                key: "classAttendance",
                label: "Class Attendance",
                icon: Calendar,
              },
            ] as { key: StaffTab; label: string; icon: ElementType }[]
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              data-ocid={`staff.${key}.tab`}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all ${
                activeTab === key
                  ? "glass-btn bg-foreground/15 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {activeTab === "overview" && <OverviewTab />}

        {activeTab === "classAttendance" && <ClassAttendanceTab />}
      </div>
    </div>
  );
}

const DEMO_OVERVIEW_STUDENTS = [
  {
    studentId: "CSE23001",
    name: "Amrita Bose",
    year: "Year 3",
    department: "CSE",
  },
  {
    studentId: "CSE23002",
    name: "Rohit Pillai",
    year: "Year 3",
    department: "CSE",
  },
  {
    studentId: "CSE23003",
    name: "Nithya Sunil",
    year: "Year 3",
    department: "CSE",
  },
];

function computeStudentAttendanceFromSessions(
  studentId: string,
  sessions: ClassAttendanceSession[],
): { subject: string; present: number; total: number; percentage: number }[] {
  const map: Record<string, { present: number; total: number }> = {};
  for (const session of sessions) {
    const rec = session.records.find((r) => r.studentId === studentId);
    if (!rec) continue;
    if (!map[session.subject]) map[session.subject] = { present: 0, total: 0 };
    map[session.subject].total++;
    if (rec.present) map[session.subject].present++;
  }
  return Object.entries(map).map(([subject, data]) => ({
    subject,
    present: data.present,
    total: data.total,
    percentage:
      data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
  }));
}

function OverviewTab() {
  const { actor } = useActor();
  const [selected, setSelected] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ClassAttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    (actor as any)
      .getAttendanceSessions()
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [actor]);

  return (
    <div className="flex flex-col gap-4">
      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold text-foreground text-sm mb-1">
          CSE — Year 3 Students
        </h2>
        <p className="text-muted-foreground text-xs mb-4">
          Demo class for attendance tracking
        </p>
        {loading ? (
          <div
            className="flex flex-col gap-3"
            data-ocid="staff.overview.loading_state"
          >
            {[1, 2, 3].map((k) => (
              <div key={k} className="glass-sm rounded-xl p-4">
                <Skeleton className="h-5 w-40 mb-2 bg-foreground/10" />
                <Skeleton className="h-4 w-28 bg-foreground/10" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {DEMO_OVERVIEW_STUDENTS.map((stu) => {
              const attendance = computeStudentAttendanceFromSessions(
                stu.studentId,
                sessions,
              );
              const overall =
                attendance.length > 0
                  ? Math.round(
                      attendance.reduce((a, b) => a + b.percentage, 0) /
                        attendance.length,
                    )
                  : null;
              const isOpen = selected === stu.studentId;
              return (
                <div
                  key={stu.studentId}
                  className="glass-sm rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(isOpen ? null : stu.studentId)}
                    data-ocid={`staff.overview.item.${DEMO_OVERVIEW_STUDENTS.indexOf(stu) + 1}`}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-foreground/5 transition-colors text-left"
                  >
                    <div className="glass w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-display font-bold text-sm text-foreground">
                      {stu.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">
                        {stu.name}
                      </p>
                      <p className="text-muted-foreground text-xs font-mono">
                        {stu.studentId} · {stu.department} {stu.year}
                      </p>
                    </div>
                    {overall !== null ? (
                      <span
                        className={`text-sm font-bold ${
                          overall >= 75 ? "text-green-400" : "text-amber-400"
                        }`}
                      >
                        {overall}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        No data
                      </span>
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-white/10">
                      {attendance.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-3 text-center">
                          No attendance recorded yet. Use Class Attendance tab
                          to mark attendance.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2 mt-3">
                          {attendance.map((a) => (
                            <div
                              key={a.subject}
                              className="flex items-center gap-3"
                            >
                              <span className="text-sm text-foreground flex-1 min-w-0 truncate">
                                {a.subject}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {a.present}/{a.total}
                              </span>
                              <span
                                className={`text-sm font-bold w-10 text-right ${
                                  a.percentage >= 75
                                    ? "text-green-400"
                                    : "text-amber-400"
                                }`}
                              >
                                {a.percentage}%
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface ClassAttendanceRecord {
  studentId: string;
  name: string;
  present: boolean;
}

interface DemoStudent {
  studentId: string;
  firstName: string;
  lastName: string;
  department: string;
  year: string;
}

const DEPARTMENTS = [
  "CSE",
  "ECE",
  "Civil",
  "EEE",
  "Mechanical",
  "Naval Architecture",
  "AI & Cyber Security",
];

const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4"];

const DEMO_STUDENTS: DemoStudent[] = [
  {
    studentId: "CSE25001",
    firstName: "Arjun",
    lastName: "Menon",
    department: "CSE",
    year: "Year 1",
  },
  {
    studentId: "CSE25002",
    firstName: "Priya",
    lastName: "Krishnan",
    department: "CSE",
    year: "Year 1",
  },
  {
    studentId: "CSE25003",
    firstName: "Rahul",
    lastName: "Nair",
    department: "CSE",
    year: "Year 1",
  },
  {
    studentId: "CSE24001",
    firstName: "Aditya",
    lastName: "Rajan",
    department: "CSE",
    year: "Year 2",
  },
  {
    studentId: "CSE24002",
    firstName: "Meera",
    lastName: "Suresh",
    department: "CSE",
    year: "Year 2",
  },
  {
    studentId: "CSE24003",
    firstName: "Kiran",
    lastName: "Thomas",
    department: "CSE",
    year: "Year 2",
  },
  {
    studentId: "CSE23001",
    firstName: "Amrita",
    lastName: "Bose",
    department: "CSE",
    year: "Year 3",
  },
  {
    studentId: "CSE23002",
    firstName: "Rohit",
    lastName: "Pillai",
    department: "CSE",
    year: "Year 3",
  },
  {
    studentId: "CSE23003",
    firstName: "Nithya",
    lastName: "Sunil",
    department: "CSE",
    year: "Year 3",
  },
  {
    studentId: "CSE22001",
    firstName: "Abhijith",
    lastName: "Kumar",
    department: "CSE",
    year: "Year 4",
  },
  {
    studentId: "ECE25001",
    firstName: "Anjali",
    lastName: "George",
    department: "ECE",
    year: "Year 1",
  },
  {
    studentId: "ECE24001",
    firstName: "Rohan",
    lastName: "Mathew",
    department: "ECE",
    year: "Year 2",
  },
  {
    studentId: "CIVIL25001",
    firstName: "Ananya",
    lastName: "Raj",
    department: "Civil",
    year: "Year 1",
  },
];

function ClassAttendanceTab() {
  const { actor } = useActor();
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState<ClassAttendanceRecord[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const inputClass =
    "glass-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none rounded-xl border-0 w-full";

  const filteredStudents = DEMO_STUDENTS.filter(
    (s) => s.department === department && s.year === year,
  );

  function loadClass() {
    if (!department || !year) return;
    setRecords(
      filteredStudents.map((s) => ({
        studentId: s.studentId,
        name: `${s.firstName} ${s.lastName}`,
        present: true,
      })),
    );
    setSubmitted(false);
  }

  function toggleAll(val: boolean) {
    setRecords((r) => r.map((rec) => ({ ...rec, present: val })));
  }

  function toggleOne(studentId: string) {
    setRecords((r) =>
      r.map((rec) =>
        rec.studentId === studentId ? { ...rec, present: !rec.present } : rec,
      ),
    );
  }

  async function handleSubmit() {
    if (!actor) return;
    if (!subject.trim()) {
      toast.error("Please enter a subject name");
      return;
    }
    setSaving(true);
    try {
      const session: ClassAttendanceSession = {
        id: Date.now().toString(),
        department,
        year,
        subject,
        date,
        savedAt: new Date().toISOString(),
        records,
      };
      await (actor as any).addAttendanceSession(session);
      const presentCount = records.filter((r) => r.present).length;
      const absentCount = records.length - presentCount;
      toast.success(
        `Attendance saved: ${presentCount} present, ${absentCount} absent for ${department} ${year} - ${subject}`,
      );
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-5">
      <div>
        <h2 className="font-display font-semibold text-foreground text-lg mb-1">
          Class Attendance
        </h2>
        <p className="text-muted-foreground text-sm">
          Select a class to mark attendance for all students at once.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="glass-sm rounded-xl overflow-hidden">
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setRecords([]);
              setSubmitted(false);
            }}
            className={`${inputClass} appearance-none`}
            style={{
              background: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="glass-sm rounded-xl overflow-hidden">
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setRecords([]);
              setSubmitted(false);
            }}
            className={`${inputClass} appearance-none`}
            style={{
              background: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <option value="">Select Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="glass-sm rounded-xl overflow-hidden">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject (e.g. Data Structures)"
            className={inputClass}
          />
        </div>
        <div className="glass-sm rounded-xl overflow-hidden">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {department && year && records.length === 0 && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadClass}
            className="glass-btn px-5 py-2.5 text-sm font-medium text-foreground rounded-xl hover:bg-foreground/10 flex items-center gap-2"
          >
            <Search size={14} />
            Load {filteredStudents.length} Students
          </button>
          {filteredStudents.length === 0 && (
            <span className="text-muted-foreground text-sm">
              No students found for this selection.
            </span>
          )}
        </div>
      )}

      {records.length > 0 && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted-foreground text-sm">
              {records.length} students loaded
            </span>
            <button
              type="button"
              onClick={() => toggleAll(true)}
              className="glass-sm px-3 py-1 text-xs text-foreground rounded-lg hover:bg-foreground/10"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => toggleAll(false)}
              className="glass-sm px-3 py-1 text-xs text-foreground rounded-lg hover:bg-foreground/10"
            >
              Mark All Absent
            </button>
          </div>

          <div className="glass-sm rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["Student ID", "Name", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-muted-foreground font-medium px-4 py-2.5"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((rec, i) => (
                  <tr
                    key={rec.studentId}
                    className={`border-b border-white/5 last:border-0 cursor-pointer transition-colors ${
                      rec.present
                        ? "hover:bg-green-500/5"
                        : "hover:bg-red-500/5"
                    }`}
                    onClick={() => toggleOne(rec.studentId)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        toggleOne(rec.studentId);
                    }}
                    data-ocid={`staff.class_attendance.row.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-foreground font-mono text-xs">
                      {rec.studentId}
                    </td>
                    <td className="px-4 py-3 text-foreground">{rec.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          rec.present
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {rec.present ? "Present" : "Absent"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-muted-foreground">
              <span className="text-green-400 font-medium">
                {records.filter((r) => r.present).length} present
              </span>
              {" · "}
              <span className="text-red-400 font-medium">
                {records.filter((r) => !r.present).length} absent
              </span>
            </div>
            {!submitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                data-ocid="staff.class_attendance.submit_button"
                className="glass-btn px-5 py-2.5 text-sm font-medium text-foreground rounded-xl hover:bg-foreground/10 flex items-center gap-2 disabled:opacity-60"
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save Attendance"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDepartment("");
                  setYear("");
                  setSubject("");
                  setRecords([]);
                  setSubmitted(false);
                }}
                className="glass-btn px-5 py-2.5 text-sm font-medium text-foreground rounded-xl hover:bg-foreground/10 flex items-center gap-2"
              >
                <Plus size={14} />
                New Attendance
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
