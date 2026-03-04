import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export function StaffDashboard() {
  const { isLoggedIn, role, userName } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [searchId, setSearchId] = useState("");
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [localRecord, setLocalRecord] = useState<AcademicRecord | null>(null);

  useEffect(() => {
    if (!isLoggedIn || role !== "staff") {
      navigate({ to: "/login" });
    }
  }, [isLoggedIn, role, navigate]);

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

  if (!isLoggedIn || role !== "staff") return null;

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

  // Attendance helpers
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

  // Marks helpers
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
        [field]: field === "marks" ? BigInt(String(value)) : value,
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

  // Fees helpers
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

  // Exam helpers
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

  const inputClass =
    "glass-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none rounded-xl border-0 w-full";

  return (
    <div className="relative min-h-screen">
      {/* BG */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80"
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
        {/* Header */}
        <div className="glass rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="glass-sm w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-foreground/70" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              {userName}
            </h1>
            <p className="text-muted-foreground text-sm">
              Staff Dashboard · Manage Student Records
            </p>
          </div>
        </div>

        {/* Student search */}
        <div className="glass rounded-2xl p-5 mb-6">
          <h2 className="font-semibold text-foreground text-sm mb-3">
            Load Student Record
          </h2>
          <div className="flex gap-2">
            <div className="flex-1 glass-sm flex items-center gap-2 px-3 py-2 rounded-xl">
              <UserCircle
                size={16}
                className="text-muted-foreground shrink-0"
              />
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

        {/* Loading state */}
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

        {/* Record editor */}
        {localRecord && !loadingRecord && (
          <>
            {/* Student info */}
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

            <Tabs defaultValue="attendance">
              <TabsList className="glass mb-4 p-1 h-auto flex gap-1 bg-transparent w-full">
                {[
                  {
                    value: "attendance",
                    label: "Attendance",
                    icon: GraduationCap,
                  },
                  { value: "marks", label: "Marks", icon: BarChart2 },
                  { value: "exams", label: "Exams", icon: Calendar },
                  { value: "fees", label: "Fees Due", icon: DollarSign },
                ].map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    data-ocid={`staff.${value}.tab`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm data-[state=active]:bg-foreground/10 rounded-xl font-medium"
                  >
                    <Icon size={13} />
                    <span className="hidden sm:inline">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Attendance editor */}
              <TabsContent value="attendance">
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
              </TabsContent>

              {/* Marks editor */}
              <TabsContent value="marks">
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
                          onChange={(e) =>
                            updateMark(i, "subjectId", e.target.value)
                          }
                          placeholder="Subject ID"
                          className={inputClass}
                        />
                        <input
                          type="text"
                          value={m.examType}
                          onChange={(e) =>
                            updateMark(i, "examType", e.target.value)
                          }
                          placeholder="Exam Type"
                          className={`${inputClass} w-28`}
                        />
                        <input
                          type="number"
                          value={Number(m.marks)}
                          onChange={(e) =>
                            updateMark(i, "marks", e.target.value)
                          }
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
              </TabsContent>

              {/* Exams editor */}
              <TabsContent value="exams">
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
                          onChange={(e) =>
                            updateExam(i, "subjectId", e.target.value)
                          }
                          placeholder="Subject ID"
                          className={inputClass}
                        />
                        <input
                          type="text"
                          value={exam.examType}
                          onChange={(e) =>
                            updateExam(i, "examType", e.target.value)
                          }
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
                          onChange={(e) =>
                            updateExam(i, "date", e.target.value)
                          }
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
              </TabsContent>

              {/* Fees editor */}
              <TabsContent value="fees">
                <div className="glass rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground text-sm">
                      Fees Due
                    </h3>
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
                          onChange={(e) =>
                            updateFee(i, "yearSemester", e.target.value)
                          }
                          placeholder="Year/Semester"
                          className={inputClass}
                        />
                        <input
                          type="number"
                          value={fee.amount}
                          onChange={(e) =>
                            updateFee(i, "amount", e.target.value)
                          }
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
                          onChange={(e) =>
                            updateFee(i, "dueDate", e.target.value)
                          }
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
              </TabsContent>
            </Tabs>

            {/* Save button */}
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
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
