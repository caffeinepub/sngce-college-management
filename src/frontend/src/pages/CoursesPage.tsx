import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import { Degree } from "../backend";
import { useTheme } from "../contexts/ThemeContext";
import { useAllCourses } from "../hooks/useQueries";

const degreeLabels: Record<string, string> = {
  bTech: "B.Tech",
  mTech: "M.Tech",
  mba: "MBA",
};

const degreeColors: Record<string, string> = {
  bTech: "bg-blue-500/15 text-blue-400",
  mTech: "bg-purple-500/15 text-purple-400",
  mba: "bg-amber-500/15 text-amber-400",
};

export function CoursesPage() {
  const { data: courses, isLoading } = useAllCourses();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const grouped = {
    bTech: courses?.filter((c) => c.degree === Degree.bTech) ?? [],
    mTech: courses?.filter((c) => c.degree === Degree.mTech) ?? [],
    mba: courses?.filter((c) => c.degree === Degree.mba) ?? [],
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <img
          src="/assets/uploads/college1-3-1.jpg"
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

        {isLoading ? (
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
          <Tabs defaultValue="bTech" data-ocid="courses.tab">
            <TabsList className="glass mb-6 p-1 h-auto flex gap-1 bg-transparent">
              {Object.entries(degreeLabels).map(([key, label]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  data-ocid={`courses.${key}.tab`}
                  className="glass-btn px-4 py-2 text-sm data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground rounded-xl"
                >
                  {label} ({grouped[key as keyof typeof grouped].length})
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(grouped).map(([key, list]) => (
              <TabsContent key={key} value={key}>
                {list.length === 0 ? (
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
                    {list.map((course, i) => (
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
                            className={`text-xs shrink-0 border-0 ${
                              degreeColors[key] ?? ""
                            }`}
                          >
                            {degreeLabels[key] ?? key}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <Clock size={13} />
                          {course.durationYears} Year
                          {course.durationYears > 1 ? "s" : ""} Program
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <GraduationCap size={13} />
                          Affiliated to APJ KTU
                        </div>
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
