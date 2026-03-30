import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  Calendar,
  DollarSign,
  GraduationCap,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  UserCircle,
} from "lucide-react";
import type { ElementType } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Degree } from "../backend";
import type {
  AcademicRecord,
  Attendance,
  Exam,
  FeesDue,
  Marks,
} from "../backend.d";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useSaveAcademicRecord, useStudentRecord } from "../hooks/useQueries";

const LS_ATTENDANCE = "sngce_attendance";
const LS_MARKS = "sngce_marks";

interface AttendanceEntry {
  studentId: string;
  subjectId: string;
  subjectName: string;
  percentage: number;
  updatedAt: string;
}

interface MarksEntry {
  studentId: string;
  subjectId: string;
  subjectName: string;
  examType: string;
  marks: number;
  updatedAt: string;
}

const EXAM_TYPES = [
  "Internal 1",
  "Internal 2",
  "End Semester",
  "Assignment",
  "Practical",
];

function loadLS<T>(key: string, def: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : def;
  } catch {
    return def;
  }
}

function saveLS<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val));
}

function makeDefaultRecord(studentId: string): AcademicRecord {
  return {
    student: {
      studentId,
      firstName: "",
      lastName: "",
      department: "",
      degree: Degree.bTech,
    },
    attendance: [],
    marks: [],
    exams: [],
    feesDue: [],
    subjects: [],
  };
}

type StaffTab = "overview" | "attendance" | "marks" | "classAttendance";

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

  const inputClass =
    "glass-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none rounded-xl border-0 w-full";

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
              { key: "attendance", label: "Attendance", icon: GraduationCap },
              { key: "marks", label: "Marks", icon: BarChart2 },
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

        {activeTab === "overview" && <OverviewTab inputClass={inputClass} />}
        {activeTab === "attendance" && (
          <AttendanceTab inputClass={inputClass} />
        )}
        {activeTab === "marks" && <MarksTab inputClass={inputClass} />}
        {activeTab === "classAttendance" && <ClassAttendanceTab />}
      </div>
    </div>
  );
}

function OverviewTab({ inputClass }: { inputClass: string }) {
  const [searchId, setSearchId] = useState("");
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [localRecord, setLocalRecord] = useState<AcademicRecord | null>(null);

  const { data: fetchedRecord, isLoading: loadingRecord } =
    useStudentRecord(loadedId);
  const { mutateAsync: saveRecord, isPending: saving } =
    useSaveAcademicRecord();

  useEffect(() => {
    if (fetchedRecord) {
      setLocalRecord(JSON.parse(JSON.stringify(fetchedRecord)));
    } else if (loadedId && !loadingRecord) {
      setLocalRecord(makeDefaultRecord(loadedId));
    }
  }, [fetchedRecord, loadedId, loadingRecord]);

  const handleLoad = () => {
    const id = searchId.trim().toUpperCase();
    if (!id) return;
    setLoadedId(id);
    setLocalRecord(null);
  };

  const handleSave = async () => {
    if (!localRecord || !loadedId) return;
    try {
      await saveRecord({ studentId: loadedId, record: localRecord });
      toast.success("Student record saved successfully!");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
  };

  const addAttendance = () => {
    setLocalRecord((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        attendance: [...prev.attendance, { subjectId: "", percentage: 0 }],
      };
    });
  };
  const updateAttendance = (
    i: number,
    field: keyof Attendance,
    value: string | number,
  ) => {
    setLocalRecord((prev) => {
      if (!prev) return prev;
      const att = [...prev.attendance];
      att[i] = {
        ...att[i],
        [field]: field === "percentage" ? Number(value) : value,
      };
      return { ...prev, attendance: att };
    });
  };
  const removeAttendance = (i: number) => {
    setLocalRecord((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        attendance: prev.attendance.filter((_, idx) => idx !== i),
      };
    });
  };

  const addMark = () => {
    setLocalRecord((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        marks: [
          ...prev.marks,
          { subjectId: "", examType: "", marks: BigInt(0) },
        ],
      };
    });
  };
  const updateMark = (
    i: number,
    field: keyof Marks,
    value: string | bigint,
  ) => {
    setLocalRecord((prev) => {
      if (!prev) return prev;
      const m = [...prev.marks];
      m[i] = {
        ...m[i],
        [field]:
          field === "marks"
            ? (() => {
                try {
                  return BigInt(Math.round(Number(String(value))) || 0);
                } catch {
                  return BigInt(0);
                }
              })()
            : value,
      };
      return { ...prev, marks: m };
    });
  };
  const removeMark = (i: number) => {
    setLocalRecord((prev) => {
      if (!prev) return prev;
      return { ...prev, marks: prev.marks.filter((_, idx) => idx !== i) };
    });
  };

  const addFee = () => {
    setLocalRecord((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        feesDue: [
          ...prev.feesDue,
          {
            yearSemester: "",
            amount: 0,
            dueDate: BigInt(Date.now() * 1_000_000),
          },
        ],
      };
    });
  };
  const updateFee = (
    i: number,
    field: "yearSemester" | "amount" | "dueDate",
    value: string | number,
  ) => {
    setLocalRecord((prev) => {
      if (!prev) return prev;
      const f = [...prev.feesDue];
      if (field === "amount") {
        f[i] = { ...f[i], amount: Number(value) };
      } else if (field === "dueDate") {
        const ms = new Date(String(value)).getTime();
        f[i] = { ...f[i], dueDate: BigInt(ms * 1_000_000) };
      } else {
        f[i] = { ...f[i], yearSemester: String(value) };
      }
      return { ...prev, feesDue: f };
    });
  };
  const removeFee = (i: number) => {
    setLocalRecord((prev) => {
      if (!prev) return prev;
      return { ...prev, feesDue: prev.feesDue.filter((_, idx) => idx !== i) };
    });
  };

  const addExam = () => {
    setLocalRecord((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exams: [
          ...prev.exams,
          {
            examId: `EXAM_${Date.now()}`,
            subjectId: "",
            examType: "",
            date: BigInt(Date.now() * 1_000_000),
          },
        ],
      };
    });
  };
  const updateExam = (i: number, field: keyof Exam, value: string | bigint) => {
    setLocalRecord((prev) => {
      if (!prev) return prev;
      const exs = [...prev.exams];
      if (field === "date") {
        const ms = new Date(String(value)).getTime();
        exs[i] = { ...exs[i], date: BigInt(ms * 1_000_000) };
      } else {
        exs[i] = { ...exs[i], [field]: value };
      }
      return { ...prev, exams: exs };
    });
  };
  const removeExam = (i: number) => {
    setLocalRecord((prev) => {
      if (!prev) return prev;
      return { ...prev, exams: prev.exams.filter((_, idx) => idx !== i) };
    });
  };

  return (
    <>
      <div className="glass rounded-2xl p-5 mb-6">
        <h2 className="font-semibold text-foreground text-sm mb-3">
          Load Student Record
        </h2>
        <div className="flex gap-2">
          <div className="flex-1 glass-sm flex items-center gap-2 px-3 py-2 rounded-xl">
            <UserCircle size={16} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoad()}
              placeholder="Enter Student ID (e.g. STU001)"
              data-ocid="staff.studentid.input"
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
          </div>
          <button
            type="button"
            onClick={handleLoad}
            data-ocid="staff.load.button"
            className="glass-btn px-4 py-2 flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <Search size={15} />
            Load
          </button>
        </div>
      </div>

      {loadingRecord && (
        <div
          className="glass rounded-2xl p-6"
          data-ocid="staff.record.loading_state"
        >
          <Skeleton className="h-6 w-48 mb-4 bg-foreground/10" />
          {(["sk1", "sk2", "sk3", "sk4"] as const).map((k) => (
            <Skeleton key={k} className="h-10 w-full mb-2 bg-foreground/10" />
          ))}
        </div>
      )}

      {localRecord && !loadingRecord && (
        <>
          <div className="glass rounded-2xl p-5 mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "First Name", field: "firstName" as const },
                { label: "Last Name", field: "lastName" as const },
                { label: "Department", field: "department" as const },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label
                    htmlFor={`student-${field}`}
                    className="text-xs text-muted-foreground mb-1 block"
                  >
                    {label}
                  </label>
                  <input
                    id={`student-${field}`}
                    type="text"
                    value={localRecord.student[field] ?? ""}
                    onChange={(e) =>
                      setLocalRecord((prev) =>
                        prev
                          ? {
                              ...prev,
                              student: {
                                ...prev.student,
                                [field]: e.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                    data-ocid={`staff.student.${field}.input`}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          <InnerRecordTabs
            localRecord={localRecord}
            inputClass={inputClass}
            addAttendance={addAttendance}
            updateAttendance={updateAttendance}
            removeAttendance={removeAttendance}
            addMark={addMark}
            updateMark={updateMark}
            removeMark={removeMark}
            addFee={addFee}
            updateFee={updateFee}
            removeFee={removeFee}
            addExam={addExam}
            updateExam={updateExam}
            removeExam={removeExam}
          />

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              data-ocid="staff.save.primary_button"
              className="glass-btn px-6 py-3 flex items-center gap-2 font-semibold text-foreground disabled:opacity-50"
            >
              {saving ? (
                <span
                  className="flex items-center gap-2"
                  data-ocid="staff.save.loading_state"
                >
                  <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  Saving…
                </span>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </>
      )}
    </>
  );
}

function InnerRecordTabs({
  localRecord,
  inputClass,
  addAttendance,
  updateAttendance,
  removeAttendance,
  addMark,
  updateMark,
  removeMark,
  addFee,
  updateFee,
  removeFee,
  addExam,
  updateExam,
  removeExam,
}: {
  localRecord: AcademicRecord;
  inputClass: string;
  addAttendance: () => void;
  updateAttendance: (
    i: number,
    field: keyof Attendance,
    value: string | number,
  ) => void;
  removeAttendance: (i: number) => void;
  addMark: () => void;
  updateMark: (i: number, field: keyof Marks, value: string | bigint) => void;
  removeMark: (i: number) => void;
  addFee: () => void;
  updateFee: (
    i: number,
    field: "yearSemester" | "amount" | "dueDate",
    value: string | number,
  ) => void;
  removeFee: (i: number) => void;
  addExam: () => void;
  updateExam: (i: number, field: keyof Exam, value: string | bigint) => void;
  removeExam: (i: number) => void;
}) {
  const [innerTab, setInnerTab] = useState("attendance");
  const tabs = [
    { value: "attendance", label: "Attendance", icon: GraduationCap },
    { value: "marks", label: "Marks", icon: BarChart2 },
    { value: "exams", label: "Exams", icon: Calendar },
    { value: "fees", label: "Fees Due", icon: DollarSign },
  ];

  return (
    <>
      <div className="glass rounded-2xl p-1.5 mb-4 flex gap-1">
        {tabs.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setInnerTab(value)}
            data-ocid={`staff.${value}.tab`}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-xl transition-all ${
              innerTab === value
                ? "glass-btn bg-foreground/15 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={13} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {innerTab === "attendance" && (
        <div className="glass rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground text-sm">
              Attendance Records
            </h3>
            <button
              type="button"
              onClick={addAttendance}
              data-ocid="staff.attendance.add_button"
              className="glass-btn px-3 py-1.5 flex items-center gap-1.5 text-xs text-foreground"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          {localRecord.attendance.length === 0 ? (
            <p
              className="text-muted-foreground text-sm text-center py-4"
              data-ocid="staff.attendance.empty_state"
            >
              No records. Click Add to begin.
            </p>
          ) : (
            localRecord.attendance.map((a: Attendance, i: number) => (
              <div
                key={`att-${i}-${a.subjectId}`}
                className="flex gap-2 items-center"
                data-ocid={`staff.attendance.item.${i + 1}`}
              >
                <input
                  type="text"
                  value={a.subjectId}
                  onChange={(e) =>
                    updateAttendance(i, "subjectId", e.target.value)
                  }
                  placeholder="Subject ID"
                  data-ocid="staff.attendance.subject.input"
                  className={inputClass}
                />
                <input
                  type="number"
                  value={a.percentage}
                  onChange={(e) =>
                    updateAttendance(i, "percentage", e.target.value)
                  }
                  placeholder="%"
                  min={0}
                  max={100}
                  className={`${inputClass} w-20`}
                />
                <button
                  type="button"
                  onClick={() => removeAttendance(i)}
                  data-ocid={`staff.attendance.delete_button.${i + 1}`}
                  className="glass-btn p-2 text-destructive shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {innerTab === "marks" && (
        <div className="glass rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground text-sm">
              Marks Records
            </h3>
            <button
              type="button"
              onClick={addMark}
              data-ocid="staff.marks.add_button"
              className="glass-btn px-3 py-1.5 flex items-center gap-1.5 text-xs text-foreground"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          {localRecord.marks.length === 0 ? (
            <p
              className="text-muted-foreground text-sm text-center py-4"
              data-ocid="staff.marks.empty_state"
            >
              No records. Click Add to begin.
            </p>
          ) : (
            localRecord.marks.map((m: Marks, i: number) => (
              <div
                key={`mark-${i}-${m.subjectId}`}
                className="flex gap-2 items-center"
                data-ocid={`staff.marks.item.${i + 1}`}
              >
                <input
                  type="text"
                  value={m.subjectId}
                  onChange={(e) => updateMark(i, "subjectId", e.target.value)}
                  placeholder="Subject ID"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={m.examType}
                  onChange={(e) => updateMark(i, "examType", e.target.value)}
                  placeholder="Exam Type"
                  className={`${inputClass} w-28`}
                />
                <input
                  type="number"
                  value={Number(m.marks)}
                  onChange={(e) => updateMark(i, "marks", e.target.value)}
                  placeholder="Marks"
                  className={`${inputClass} w-20`}
                />
                <button
                  type="button"
                  onClick={() => removeMark(i)}
                  data-ocid={`staff.marks.delete_button.${i + 1}`}
                  className="glass-btn p-2 text-destructive shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {innerTab === "exams" && (
        <div className="glass rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground text-sm">
              Exam Timetable
            </h3>
            <button
              type="button"
              onClick={addExam}
              data-ocid="staff.exams.add_button"
              className="glass-btn px-3 py-1.5 flex items-center gap-1.5 text-xs text-foreground"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          {localRecord.exams.length === 0 ? (
            <p
              className="text-muted-foreground text-sm text-center py-4"
              data-ocid="staff.exams.empty_state"
            >
              No exams scheduled.
            </p>
          ) : (
            localRecord.exams.map((exam: Exam, i: number) => (
              <div
                key={`exam-${exam.examId || i}`}
                className="flex gap-2 items-center flex-wrap"
                data-ocid={`staff.exams.item.${i + 1}`}
              >
                <input
                  type="text"
                  value={exam.subjectId}
                  onChange={(e) => updateExam(i, "subjectId", e.target.value)}
                  placeholder="Subject ID"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={exam.examType}
                  onChange={(e) => updateExam(i, "examType", e.target.value)}
                  placeholder="Exam Type"
                  className={`${inputClass} w-28`}
                />
                <input
                  type="date"
                  value={
                    new Date(Number(exam.date) / 1_000_000)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) => updateExam(i, "date", e.target.value)}
                  className={`${inputClass} w-36`}
                />
                <button
                  type="button"
                  onClick={() => removeExam(i)}
                  data-ocid={`staff.exams.delete_button.${i + 1}`}
                  className="glass-btn p-2 text-destructive shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {innerTab === "fees" && (
        <div className="glass rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground text-sm">Fees Due</h3>
            <button
              type="button"
              onClick={addFee}
              data-ocid="staff.fees.add_button"
              className="glass-btn px-3 py-1.5 flex items-center gap-1.5 text-xs text-foreground"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          {localRecord.feesDue.length === 0 ? (
            <p
              className="text-muted-foreground text-sm text-center py-4"
              data-ocid="staff.fees.empty_state"
            >
              No fees due records.
            </p>
          ) : (
            localRecord.feesDue.map((fee: FeesDue, i: number) => (
              <div
                key={`fee-${i}-${fee.yearSemester}`}
                className="flex gap-2 items-center flex-wrap"
                data-ocid={`staff.fees.item.${i + 1}`}
              >
                <input
                  type="text"
                  value={fee.yearSemester}
                  onChange={(e) => updateFee(i, "yearSemester", e.target.value)}
                  placeholder="Year/Semester"
                  className={inputClass}
                />
                <input
                  type="number"
                  value={fee.amount}
                  onChange={(e) => updateFee(i, "amount", e.target.value)}
                  placeholder="Amount (₹)"
                  className={`${inputClass} w-28`}
                />
                <input
                  type="date"
                  value={
                    new Date(Number(fee.dueDate) / 1_000_000)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) => updateFee(i, "dueDate", e.target.value)}
                  className={`${inputClass} w-36`}
                />
                <button
                  type="button"
                  onClick={() => removeFee(i)}
                  data-ocid={`staff.fees.delete_button.${i + 1}`}
                  className="glass-btn p-2 text-destructive shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

function AttendanceTab({ inputClass }: { inputClass: string }) {
  const [entries, setEntries] = useState<AttendanceEntry[]>(() =>
    loadLS(LS_ATTENDANCE, []),
  );
  const [studentId, setStudentId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [percentage, setPercentage] = useState<number>(0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !subjectId.trim()) {
      toast.error("Student ID and Subject ID are required.");
      return;
    }
    const now = new Date().toLocaleString("en-IN");
    const existing = entries.findIndex(
      (en) =>
        en.studentId === studentId.trim().toUpperCase() &&
        en.subjectId === subjectId.trim().toUpperCase(),
    );
    let updated: AttendanceEntry[];
    if (existing >= 0) {
      updated = entries.map((en, i) =>
        i === existing
          ? {
              ...en,
              subjectName: subjectName.trim(),
              percentage,
              updatedAt: now,
            }
          : en,
      );
    } else {
      updated = [
        ...entries,
        {
          studentId: studentId.trim().toUpperCase(),
          subjectId: subjectId.trim().toUpperCase(),
          subjectName: subjectName.trim(),
          percentage,
          updatedAt: now,
        },
      ];
    }
    setEntries(updated);
    saveLS(LS_ATTENDANCE, updated);
    setStudentId("");
    setSubjectName("");
    setSubjectId("");
    setPercentage(0);
    toast.success("Attendance saved.");
  };

  const getColor = (pct: number) => {
    if (pct >= 75) return "text-green-400";
    if (pct >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <>
      <div className="glass rounded-2xl p-5 mb-6">
        <h2 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
          <GraduationCap size={15} className="text-foreground/70" />
          Enter Student Attendance
        </h2>
        <form
          onSubmit={handleSave}
          className="flex flex-col gap-4"
          data-ocid="staff.attendance.panel"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Student ID
              </p>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. STU001"
                data-ocid="staff.attendance.studentid.input"
                required
                className={inputClass}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Subject Name
              </p>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Data Structures"
                data-ocid="staff.attendance.subjectname.input"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Subject Code / ID
              </p>
              <input
                type="text"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                placeholder="e.g. CS301"
                data-ocid="staff.attendance.subjectid.input"
                required
                className={inputClass}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Attendance %
              </p>
              <input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                min={0}
                max={100}
                data-ocid="staff.attendance.percentage.input"
                required
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            data-ocid="staff.attendance.submit_button"
            className="glass-btn py-3 w-full flex items-center justify-center gap-2 font-semibold text-sm text-foreground"
          >
            <Save size={15} /> Save Attendance
          </button>
        </form>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <span className="font-semibold text-foreground text-sm">
            Attendance Records ({entries.length})
          </span>
        </div>
        {entries.length === 0 ? (
          <div
            className="p-10 text-center"
            data-ocid="staff.attendance.table.empty_state"
          >
            <p className="text-muted-foreground text-sm">
              No attendance records yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["Student ID", "Subject", "Code", "Attendance %"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-muted-foreground font-medium px-4 py-3"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {entries.map((en, i) => (
                  <tr
                    key={`${en.studentId}-${en.subjectId}`}
                    className="border-b border-white/5 last:border-0 hover:bg-foreground/5"
                    data-ocid={`staff.attendance.row.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-foreground font-mono text-xs">
                      {en.studentId}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {en.subjectName || "-"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                      {en.subjectId}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${getColor(en.percentage)}`}
                    >
                      {en.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function MarksTab({ inputClass }: { inputClass: string }) {
  const [entries, setEntries] = useState<MarksEntry[]>(() =>
    loadLS(LS_MARKS, []),
  );
  const [studentId, setStudentId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [examType, setExamType] = useState(EXAM_TYPES[0]);
  const [marks, setMarks] = useState<number>(0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !subjectId.trim()) {
      toast.error("Student ID and Subject ID are required.");
      return;
    }
    const now = new Date().toLocaleString("en-IN");
    const key = `${studentId.trim().toUpperCase()}-${subjectId.trim().toUpperCase()}-${examType}`;
    const existing = entries.findIndex(
      (en) => `${en.studentId}-${en.subjectId}-${en.examType}` === key,
    );
    let updated: MarksEntry[];
    if (existing >= 0) {
      updated = entries.map((en, i) =>
        i === existing
          ? { ...en, subjectName: subjectName.trim(), marks, updatedAt: now }
          : en,
      );
    } else {
      updated = [
        ...entries,
        {
          studentId: studentId.trim().toUpperCase(),
          subjectId: subjectId.trim().toUpperCase(),
          subjectName: subjectName.trim(),
          examType,
          marks,
          updatedAt: now,
        },
      ];
    }
    setEntries(updated);
    saveLS(LS_MARKS, updated);
    setStudentId("");
    setSubjectName("");
    setSubjectId("");
    setExamType(EXAM_TYPES[0]);
    setMarks(0);
    toast.success("Marks saved.");
  };

  return (
    <>
      <div className="glass rounded-2xl p-5 mb-6">
        <h2 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
          <BarChart2 size={15} className="text-foreground/70" />
          Enter Student Marks
        </h2>
        <form
          onSubmit={handleSave}
          className="flex flex-col gap-4"
          data-ocid="staff.marks.panel"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Student ID
              </p>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. STU001"
                data-ocid="staff.marks.studentid.input"
                required
                className={inputClass}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Subject Name
              </p>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Data Structures"
                data-ocid="staff.marks.subjectname.input"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Subject ID
              </p>
              <input
                type="text"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                placeholder="e.g. CS301"
                data-ocid="staff.marks.subjectid.input"
                required
                className={inputClass}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Exam Type
              </p>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                data-ocid="staff.marks.examtype.select"
                className={`${inputClass} cursor-pointer`}
              >
                {EXAM_TYPES.map((et) => (
                  <option
                    key={et}
                    value={et}
                    className="bg-background text-foreground"
                  >
                    {et}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Marks
              </p>
              <input
                type="number"
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                min={0}
                data-ocid="staff.marks.marks.input"
                required
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            data-ocid="staff.marks.submit_button"
            className="glass-btn py-3 w-full flex items-center justify-center gap-2 font-semibold text-sm text-foreground"
          >
            <Save size={15} /> Save Marks
          </button>
        </form>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <span className="font-semibold text-foreground text-sm">
            Marks Records ({entries.length})
          </span>
        </div>
        {entries.length === 0 ? (
          <div
            className="p-10 text-center"
            data-ocid="staff.marks.table.empty_state"
          >
            <p className="text-muted-foreground text-sm">
              No marks records yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["Student ID", "Subject", "Exam Type", "Marks"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-muted-foreground font-medium px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((en, i) => (
                  <tr
                    key={`${en.studentId}-${en.subjectId}-${en.examType}`}
                    className="border-b border-white/5 last:border-0 hover:bg-foreground/5"
                    data-ocid={`staff.marks.row.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-foreground font-mono text-xs">
                      {en.studentId}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {en.subjectName || en.subjectId}
                    </td>
                    <td className="px-4 py-3">
                      <span className="glass-sm px-2 py-0.5 rounded-full text-xs text-foreground/70">
                        {en.examType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground font-semibold">
                      {en.marks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
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
const LS_CLASS_ATTENDANCE = "sngce_class_attendance";

interface DemoStudent {
  studentId: string;
  firstName: string;
  lastName: string;
  department: string;
  year: string;
}

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
    studentId: "CSE25004",
    firstName: "Sneha",
    lastName: "Pillai",
    department: "CSE",
    year: "Year 1",
  },
  {
    studentId: "CSE25005",
    firstName: "Vishnu",
    lastName: "Kumar",
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
    studentId: "CSE24004",
    firstName: "Divya",
    lastName: "Joseph",
    department: "CSE",
    year: "Year 2",
  },
  {
    studentId: "CSE24005",
    firstName: "Sanjay",
    lastName: "Varma",
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
    studentId: "CSE22002",
    firstName: "Lakshmi",
    lastName: "Nair",
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
    studentId: "ECE25002",
    firstName: "Rohan",
    lastName: "Mathew",
    department: "ECE",
    year: "Year 1",
  },
  {
    studentId: "ECE25003",
    firstName: "Nandini",
    lastName: "Raj",
    department: "ECE",
    year: "Year 1",
  },
  {
    studentId: "ECE24001",
    firstName: "Akash",
    lastName: "Sreekumar",
    department: "ECE",
    year: "Year 2",
  },
  {
    studentId: "ECE24002",
    firstName: "Lakshmi",
    lastName: "Nambiar",
    department: "ECE",
    year: "Year 2",
  },
  {
    studentId: "ECE23001",
    firstName: "Midhun",
    lastName: "Raj",
    department: "ECE",
    year: "Year 3",
  },
  {
    studentId: "CIV25001",
    firstName: "Akhil",
    lastName: "Chandran",
    department: "Civil",
    year: "Year 1",
  },
  {
    studentId: "CIV25002",
    firstName: "Reshma",
    lastName: "Pillai",
    department: "Civil",
    year: "Year 1",
  },
  {
    studentId: "CIV24001",
    firstName: "Sreejith",
    lastName: "Mohan",
    department: "Civil",
    year: "Year 2",
  },
  {
    studentId: "EEE24001",
    firstName: "Nikhil",
    lastName: "Sasi",
    department: "EEE",
    year: "Year 2",
  },
  {
    studentId: "EEE24002",
    firstName: "Parvathy",
    lastName: "Mohan",
    department: "EEE",
    year: "Year 2",
  },
  {
    studentId: "EEE25001",
    firstName: "Faiz",
    lastName: "Rahman",
    department: "EEE",
    year: "Year 1",
  },
  {
    studentId: "MECH25001",
    firstName: "Sreejith",
    lastName: "Babu",
    department: "Mechanical",
    year: "Year 1",
  },
  {
    studentId: "MECH25002",
    firstName: "Athira",
    lastName: "Nair",
    department: "Mechanical",
    year: "Year 1",
  },
  {
    studentId: "MECH24001",
    firstName: "Joel",
    lastName: "Joseph",
    department: "Mechanical",
    year: "Year 2",
  },
  {
    studentId: "NA25001",
    firstName: "Sreedev",
    lastName: "Pillai",
    department: "Naval Architecture",
    year: "Year 1",
  },
  {
    studentId: "NA25002",
    firstName: "Kavya",
    lastName: "Krishnan",
    department: "Naval Architecture",
    year: "Year 1",
  },
  {
    studentId: "AI25001",
    firstName: "Arun",
    lastName: "Thomas",
    department: "AI & Cyber Security",
    year: "Year 1",
  },
  {
    studentId: "AI25002",
    firstName: "Deepthi",
    lastName: "Menon",
    department: "AI & Cyber Security",
    year: "Year 1",
  },
];

interface ClassAttendanceRecord {
  studentId: string;
  name: string;
  present: boolean;
}

function ClassAttendanceTab() {
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState<ClassAttendanceRecord[]>([]);
  const [submitted, setSubmitted] = useState(false);
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

  function handleSubmit() {
    if (!subject.trim()) {
      toast.error("Please enter a subject name");
      return;
    }
    const presentCount = records.filter((r) => r.present).length;
    const absentCount = records.length - presentCount;
    const existing = loadLS<object[]>(LS_CLASS_ATTENDANCE, []);
    saveLS(LS_CLASS_ATTENDANCE, [
      ...existing,
      {
        department,
        year,
        subject,
        date,
        records,
        savedAt: new Date().toISOString(),
      },
    ]);
    toast.success(
      `Attendance saved: ${presentCount} present, ${absentCount} absent for ${department} ${year} - ${subject}`,
    );
    setSubmitted(true);
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
                    className={`border-b border-white/5 last:border-0 cursor-pointer transition-colors ${rec.present ? "hover:bg-green-500/5" : "hover:bg-red-500/5"}`}
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
                className="glass-btn px-5 py-2.5 text-sm font-medium text-foreground rounded-xl hover:bg-foreground/10 flex items-center gap-2"
              >
                <Save size={14} />
                Save Attendance
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
