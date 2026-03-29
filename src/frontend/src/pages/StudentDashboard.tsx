import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart2,
  Calendar,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { useEffect } from "react";
import type { Attendance, Exam, FeesDue, Marks } from "../backend.d";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  useAttendanceByStudent,
  useExamTimetable,
  useFeesDue,
  useMarksByStudent,
} from "../hooks/useQueries";

function formatDate(time: bigint): string {
  const ms = Number(time) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function StudentDashboard() {
  const { isLoggedIn, role, studentId, userName } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const department = "Computer Science";

  useEffect(() => {
    if (!isLoggedIn || role !== "student") navigate({ to: "/login" });
  }, [isLoggedIn, role, navigate]);

  const { data: attendance, isLoading: loadingAttendance } =
    useAttendanceByStudent(studentId);
  const { data: marks, isLoading: loadingMarks } = useMarksByStudent(studentId);
  const { data: exams, isLoading: loadingExams } = useExamTimetable(department);
  const { data: feesDue, isLoading: loadingFees } = useFeesDue(studentId);

  if (!isLoggedIn || role !== "student") return null;

  const overallAttendance =
    attendance && attendance.length > 0
      ? Math.round(
          attendance.reduce(
            (acc: number, a: Attendance) => acc + a.percentage,
            0,
          ) / attendance.length,
        )
      : 0;

  const totalFeesDue =
    feesDue?.reduce((acc: number, f: FeesDue) => acc + f.amount, 0) ?? 0;

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <img
          src="https://sngce.ac.in/user/images/college1.jpg"
          alt="Campus"
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
            background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.20)",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="glass-sm w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-display font-bold text-xl text-foreground">
              {userName?.charAt(0) ?? "S"}
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">
                {userName}
              </h1>
              <p className="text-muted-foreground text-sm">
                {studentId} · {department}
              </p>
            </div>
            <div className="ml-auto grid grid-cols-2 gap-3 text-center hidden sm:grid">
              <div className="glass-sm px-4 py-2 rounded-xl">
                <p className="font-bold text-lg text-foreground">
                  {overallAttendance}%
                </p>
                <p className="text-muted-foreground text-xs">Attendance</p>
              </div>
              <div className="glass-sm px-4 py-2 rounded-xl">
                <p className="font-bold text-lg text-foreground">
                  {formatAmount(totalFeesDue)}
                </p>
                <p className="text-muted-foreground text-xs">Fees Due</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="attendance">
          <TabsList className="glass mb-6 p-1 h-auto flex gap-1 bg-transparent w-full">
            {[
              { value: "attendance", label: "Attendance", icon: GraduationCap },
              { value: "marks", label: "Marks", icon: BarChart2 },
              { value: "exams", label: "Timetable", icon: Calendar },
              { value: "fees", label: "Fees Due", icon: DollarSign },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                data-ocid={`student.${value}.tab`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground rounded-xl font-medium"
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="attendance">
            {loadingAttendance ? (
              <div
                className="flex flex-col gap-3"
                data-ocid="student.attendance.loading_state"
              >
                {[1, 2, 3, 4, 5].map((k) => (
                  <div key={k} className="glass p-4 flex gap-3 items-center">
                    <Skeleton className="h-4 w-32 bg-foreground/10" />
                    <Skeleton className="h-3 flex-1 bg-foreground/10" />
                    <Skeleton className="h-4 w-10 bg-foreground/10" />
                  </div>
                ))}
              </div>
            ) : !attendance?.length ? (
              <div
                className="glass rounded-2xl p-12 text-center"
                data-ocid="student.attendance.empty_state"
              >
                <GraduationCap
                  size={40}
                  className="text-muted-foreground mx-auto mb-3"
                />
                <p className="text-muted-foreground">
                  No attendance records found.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {attendance.map((a: Attendance, i: number) => {
                  const pct = Math.round(a.percentage);
                  const isLow = pct < 75;
                  return (
                    <div
                      key={`${a.subjectId}-${i}`}
                      className={`glass p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${isLow ? "border border-amber-500/30" : ""}`}
                      data-ocid={`student.attendance.item.${i + 1}`}
                    >
                      <div className="sm:w-48 flex-shrink-0 flex items-center gap-2">
                        {isLow && (
                          <AlertTriangle
                            size={14}
                            className="text-amber-500 shrink-0"
                          />
                        )}
                        <span className="text-sm font-medium text-foreground">
                          {a.subjectId}
                        </span>
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <Progress
                          value={pct}
                          className={`h-2 flex-1 ${isLow ? "bg-amber-500/10" : "bg-foreground/10"}`}
                        />
                        <span
                          className={`text-sm font-bold w-10 text-right ${isLow ? "text-amber-400" : "text-foreground"}`}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="marks">
            {loadingMarks ? (
              <div
                className="glass rounded-2xl p-6"
                data-ocid="student.marks.loading_state"
              >
                <Skeleton className="h-6 w-full mb-3 bg-foreground/10" />
                {[1, 2, 3, 4].map((k) => (
                  <Skeleton
                    key={k}
                    className="h-10 w-full mb-2 bg-foreground/10"
                  />
                ))}
              </div>
            ) : !marks?.length ? (
              <div
                className="glass rounded-2xl p-12 text-center"
                data-ocid="student.marks.empty_state"
              >
                <BarChart2
                  size={40}
                  className="text-muted-foreground mx-auto mb-3"
                />
                <p className="text-muted-foreground">No marks records found.</p>
              </div>
            ) : (
              <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">
                        Subject
                      </th>
                      <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">
                        Exam Type
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-medium px-5 py-3">
                        Marks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((m: Marks, i: number) => (
                      <tr
                        key={`${m.subjectId}-${m.examType}-${i}`}
                        className="border-b border-white/5 last:border-0 hover:bg-foreground/5"
                        data-ocid={`student.marks.item.${i + 1}`}
                      >
                        <td className="px-5 py-3 text-foreground">
                          {m.subjectId}
                        </td>
                        <td className="px-5 py-3 text-muted-foreground capitalize">
                          {m.examType}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-foreground">
                          {Number(m.marks)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="exams">
            {loadingExams ? (
              <div
                className="flex flex-col gap-3"
                data-ocid="student.exams.loading_state"
              >
                {[1, 2, 3, 4].map((k) => (
                  <div key={k} className="glass p-4">
                    <Skeleton className="h-5 w-40 mb-2 bg-foreground/10" />
                    <Skeleton className="h-4 w-24 bg-foreground/10" />
                  </div>
                ))}
              </div>
            ) : !exams?.length ? (
              <div
                className="glass rounded-2xl p-12 text-center"
                data-ocid="student.exams.empty_state"
              >
                <Calendar
                  size={40}
                  className="text-muted-foreground mx-auto mb-3"
                />
                <p className="text-muted-foreground">
                  No upcoming exams scheduled.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {exams.map((exam: Exam, i: number) => (
                  <div
                    key={exam.examId ?? i}
                    className="glass p-4 flex items-center gap-4"
                    data-ocid={`student.exams.item.${i + 1}`}
                  >
                    <div className="glass-sm rounded-xl px-3 py-2 text-center min-w-[56px]">
                      <p className="font-bold text-sm text-foreground leading-tight">
                        {new Date(Number(exam.date) / 1_000_000).getDate()}
                      </p>
                      <p className="text-muted-foreground text-[10px]">
                        {new Date(Number(exam.date) / 1_000_000).toLocaleString(
                          "en-IN",
                          { month: "short" },
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {exam.subjectId}
                      </p>
                      <p className="text-muted-foreground text-xs capitalize mt-0.5">
                        {exam.examType} · {formatDate(exam.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="fees">
            {loadingFees ? (
              <div
                className="flex flex-col gap-3"
                data-ocid="student.fees.loading_state"
              >
                {[1, 2, 3].map((k) => (
                  <div key={k} className="glass p-4">
                    <Skeleton className="h-5 w-40 mb-2 bg-foreground/10" />
                    <Skeleton className="h-4 w-24 bg-foreground/10" />
                  </div>
                ))}
              </div>
            ) : !feesDue?.length ? (
              <div
                className="glass rounded-2xl p-12 text-center"
                data-ocid="student.fees.empty_state"
              >
                <DollarSign
                  size={40}
                  className="text-muted-foreground mx-auto mb-3"
                />
                <p className="text-muted-foreground">
                  No outstanding fees. You're all clear!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="glass rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Total Outstanding
                    </p>
                    <p className="font-display font-bold text-2xl text-foreground mt-0.5">
                      {formatAmount(totalFeesDue)}
                    </p>
                  </div>
                  <AlertTriangle size={20} className="text-amber-400" />
                </div>
                {feesDue.map((fee: FeesDue, i: number) => (
                  <div
                    key={`${fee.yearSemester}-${i}`}
                    className="glass p-4 flex items-center justify-between"
                    data-ocid={`student.fees.item.${i + 1}`}
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {fee.yearSemester}
                      </p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        Due: {formatDate(fee.dueDate)}
                      </p>
                    </div>
                    <p className="font-bold text-foreground">
                      {formatAmount(fee.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
