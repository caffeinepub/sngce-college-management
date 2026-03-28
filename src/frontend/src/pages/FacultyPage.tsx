import { Skeleton } from "@/components/ui/skeleton";
import { Award, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import type { FacultyMember } from "../backend.d";
import { useTheme } from "../contexts/ThemeContext";
import { useFacultyDirectory } from "../hooks/useQueries";

export function FacultyPage() {
  const { data: faculty, isLoading } = useFacultyDirectory();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [search, setSearch] = useState("");

  const departments = useMemo(() => {
    const depts = Array.from(
      new Set(faculty?.map((f: FacultyMember) => f.department) ?? []),
    );
    return ["All", ...depts.sort()];
  }, [faculty]);

  const filtered = useMemo(() => {
    let list = faculty ?? [];
    if (selectedDept !== "All")
      list = list.filter((f: FacultyMember) => f.department === selectedDept);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f: FacultyMember) =>
          f.name.toLowerCase().includes(q) ||
          f.qualification.toLowerCase().includes(q) ||
          f.subjectsTaught.some((s: string) => s.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [faculty, selectedDept, search]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

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
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="glass-sm p-2 rounded-xl">
              <Users size={20} className="text-foreground/70" />
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              Faculty Directory
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Meet our dedicated faculty members who bring expertise and passion
            to every classroom.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="glass-sm flex items-center gap-2 px-3 py-2 rounded-xl flex-1">
            <Search size={15} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, subject..."
              data-ocid="faculty.search_input"
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {departments.slice(0, 5).map((dept) => (
              <button
                type="button"
                key={dept}
                onClick={() => setSelectedDept(dept)}
                data-ocid={`faculty.dept.${dept
                  .toLowerCase()
                  .replace(/\s+/g, "_")}.button`}
                className={`glass-btn px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedDept === dept
                    ? "bg-foreground/15 text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {dept}
              </button>
            ))}
            {departments.length > 5 && (
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                data-ocid="faculty.dept.select"
                className="glass-btn px-3 py-1.5 text-xs font-medium text-foreground bg-transparent outline-none cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d} value={d} className="bg-background">
                    {d}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-ocid="faculty.loading_state"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
              <div key={i} className="glass p-5 flex gap-4">
                <Skeleton className="w-12 h-12 rounded-full bg-foreground/10 shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-5 w-32 bg-foreground/10" />
                  <Skeleton className="h-4 w-24 bg-foreground/10" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="glass rounded-2xl p-12 text-center"
            data-ocid="faculty.empty_state"
          >
            <Users size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No faculty members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((member: FacultyMember, i: number) => (
              <div
                key={`${member.name}-${i}`}
                className="glass p-5 flex gap-4 hover:scale-[1.01] transition-transform"
                data-ocid={`faculty.item.${i + 1}`}
              >
                <div className="glass-sm w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-foreground font-display font-bold text-sm">
                  {getInitials(member.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-foreground text-sm">
                    {member.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-0.5">
                    <Award size={11} />
                    {member.qualification}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="glass-sm px-2 py-0.5 text-xs text-foreground/70 rounded-full">
                      {member.department}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-muted-foreground text-xs mb-1 font-medium">
                      Subjects:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {member.subjectsTaught.map((subj: string) => (
                        <span
                          key={subj}
                          className="glass-sm px-2 py-0.5 text-xs text-foreground/60 rounded-lg"
                        >
                          {subj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
