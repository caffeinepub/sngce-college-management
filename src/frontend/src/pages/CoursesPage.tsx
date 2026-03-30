import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAllCourses } from "../hooks/useQueries";

const degreeLabels: Record<string, string> = {
  bTech: "B.Tech",
  mTech: "M.Tech",
  mba: "MBA",
  mca: "MCA",
};

const degreeColors: Record<string, string> = {
  bTech: "bg-blue-500/15 text-blue-400",
  mTech: "bg-purple-500/15 text-purple-400",
  mba: "bg-amber-500/15 text-amber-400",
  mca: "bg-emerald-500/15 text-emerald-400",
};

interface LocalCourse {
  branch: string;
  degree: string;
  durationYears: number;
  intake?: number;
}

const STATIC_COURSES: LocalCourse[] = [
  {
    branch: "Computer Science Engineering",
    degree: "bTech",
    durationYears: 4,
    intake: 180,
  },
  {
    branch: "Electronics & Communication Engineering",
    degree: "bTech",
    durationYears: 4,
    intake: 120,
  },
  {
    branch: "Civil Engineering",
    degree: "bTech",
    durationYears: 4,
    intake: 60,
  },
  {
    branch: "Electrical & Electronics Engineering",
    degree: "bTech",
    durationYears: 4,
    intake: 60,
  },
  {
    branch: "Mechanical Engineering",
    degree: "bTech",
    durationYears: 4,
    intake: 60,
  },
  {
    branch: "Naval Architecture & Ship Building",
    degree: "bTech",
    durationYears: 4,
    intake: 120,
  },
  {
    branch: "Artificial Intelligence & Cyber Security",
    degree: "bTech",
    durationYears: 4,
    intake: 60,
  },
  {
    branch: "Industrial Engineering & Management",
    degree: "bTech",
    durationYears: 4,
    intake: 60,
  },
  {
    branch: "Computer Science & Design",
    degree: "bTech",
    durationYears: 4,
    intake: 60,
  },
  {
    branch: "Computer Science & Engineering",
    degree: "mTech",
    durationYears: 2,
  },
  { branch: "VLSI & Embedded Systems", degree: "mTech", durationYears: 2 },
  { branch: "Structural Engineering", degree: "mTech", durationYears: 2 },
  { branch: "Management Studies", degree: "mba", durationYears: 2 },
  { branch: "Computer Applications (MCA)", degree: "mca", durationYears: 3 },
];

function normalizeDegree(d: unknown): string {
  if (typeof d === "string") return d;
  if (d && typeof d === "object") {
    if ("bTech" in (d as object)) return "bTech";
    if ("mTech" in (d as object)) return "mTech";
    if ("mba" in (d as object)) return "mba";
    if ("mca" in (d as object)) return "mca";
  }
  return String(d);
}

function loadLocalCourses(): LocalCourse[] | null {
  try {
    const raw = localStorage.getItem("sngce_courses");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function CoursesPage() {
  const { data: backendCourses, isLoading } = useAllCourses();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const localCourses = loadLocalCourses();

  const rawCourses = localCourses ?? backendCourses ?? [];
  const courses: LocalCourse[] =
    rawCourses.length > 0
      ? rawCourses.map((c) => ({ ...c, degree: normalizeDegree(c.degree) }))
      : STATIC_COURSES;

  const degreeOrder = ["bTech", "mTech", "mba", "mca"];
  const presentDegrees = new Set(courses.map((c) => c.degree));
  const tabs = degreeOrder.filter((d) => presentDegrees.has(d));

  const grouped: Record<string, LocalCourse[]> = {};
  for (const key of tabs) {
    grouped[key] = courses.filter((c) => c.degree === key);
  }

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="glass-sm p-2 rounded-xl">
              <BookOpen size={20} className="text-foreground/70" />
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              Courses Offered
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            SNGCE offers undergraduate and postgraduate programs approved by
            AICTE and affiliated to APJ Abdul Kalam Technological University
            (KTU). Established 2002.
          </p>
        </div>

        {isLoading && rawCourses.length === 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="courses.loading_state"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
              <div key={i} className="glass p-5 flex flex-col gap-3">
                <Skeleton className="h-5 w-24 bg-foreground/10" />
                <Skeleton className="h-4 w-32 bg-foreground/10" />
              </div>
            ))}
          </div>
        ) : (
          <Tabs defaultValue={tabs[0] ?? "bTech"} data-ocid="courses.tab">
            <TabsList className="glass mb-6 p-1 h-auto flex gap-1 bg-transparent">
              {tabs.map((key) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  data-ocid={`courses.${key}.tab`}
                  className="glass-btn px-4 py-2 text-sm data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground rounded-xl"
                >
                  {degreeLabels[key] ?? key} ({grouped[key]?.length ?? 0})
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((key) => (
              <TabsContent key={key} value={key}>
                {(grouped[key]?.length ?? 0) === 0 ? (
                  <div
                    className="glass rounded-2xl p-12 text-center"
                    data-ocid="courses.empty_state"
                  >
                    <GraduationCap
                      size={40}
                      className="text-muted-foreground mx-auto mb-3"
                    />
                    <p className="text-muted-foreground">
                      No courses found for this category.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(grouped[key] ?? []).map((course, i) => (
                      <div
                        key={`${course.branch}-${i}`}
                        className="glass p-5 flex flex-col gap-4 hover:scale-[1.01] transition-transform"
                        data-ocid={`courses.item.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display font-semibold text-foreground text-base leading-snug">
                            {course.branch}
                          </h3>
                          <Badge
                            className={`text-xs shrink-0 border-0 ${degreeColors[key] ?? ""}`}
                          >
                            {degreeLabels[key] ?? key}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <Clock size={13} />
                          {course.durationYears} Year
                          {course.durationYears > 1 ? "s" : ""} Program
                        </div>
                        {course.intake && (
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                            <GraduationCap size={13} />
                            Intake: {course.intake} seats
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
