import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  DollarSign,
  Edit2,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  Lock,
  Plus,
  Save,
  ShieldAlert,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { ElementType } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  AdminCourse,
  AdminFacultyMember,
  AdminFeeEntry,
  ClassifiedDoc,
} from "../backend.d";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useActor } from "../hooks/useActor";

const CATEGORIES = [
  "Internal Circular",
  "Exam Paper",
  "Confidential Notice",
  "Staff Document",
  "Administrative Order",
  "Financial Report",
];

export interface LocalCourse {
  branch: string;
  degree: string;
  durationYears: number;
  intake: number;
}

export interface LocalFeeStructure {
  course: { branch: string; degree: string; durationYears: number };
  yearSemesterBreakdown: { yearOrSemester: string; amount: number }[];
}

export interface LocalFaculty {
  name: string;
  qualification: string;
  designation: string;
  department: string;
  subjectsTaught: string[];
}

const DEFAULT_COURSES: LocalCourse[] = [
  {
    branch: "Computer Science & Engineering",
    degree: "bTech",
    durationYears: 4,
    intake: 120,
  },
  {
    branch: "Mechanical Engineering",
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
    branch: "Electronics & Communication Engineering",
    degree: "bTech",
    durationYears: 4,
    intake: 60,
  },
  {
    branch: "Civil Engineering",
    degree: "bTech",
    durationYears: 4,
    intake: 60,
  },
  {
    branch: "Naval Architecture & Ship Building",
    degree: "bTech",
    durationYears: 4,
    intake: 30,
  },
  {
    branch: "Artificial Intelligence & Cyber Security",
    degree: "bTech",
    durationYears: 4,
    intake: 60,
  },
  {
    branch: "Master of Computer Applications",
    degree: "mca",
    durationYears: 2,
    intake: 30,
  },
  {
    branch: "Master of Business Administration",
    degree: "mba",
    durationYears: 2,
    intake: 30,
  },
  {
    branch: "M.Tech Electrical Engineering",
    degree: "mTech",
    durationYears: 2,
    intake: 18,
  },
];

const DEFAULT_FEES: LocalFeeStructure[] = [
  {
    course: {
      branch: "Computer Science & Engineering",
      degree: "bTech",
      durationYears: 4,
    },
    yearSemesterBreakdown: [
      { yearOrSemester: "Year 1", amount: 112950 },
      { yearOrSemester: "Year 2", amount: 112950 },
      { yearOrSemester: "Year 3", amount: 112950 },
      { yearOrSemester: "Year 4", amount: 112950 },
    ],
  },
  {
    course: {
      branch: "Naval Architecture & Ship Building",
      degree: "bTech",
      durationYears: 4,
    },
    yearSemesterBreakdown: [
      { yearOrSemester: "Year 1", amount: 125000 },
      { yearOrSemester: "Year 2", amount: 125000 },
      { yearOrSemester: "Year 3", amount: 125000 },
      { yearOrSemester: "Year 4", amount: 125000 },
    ],
  },
  {
    course: {
      branch: "M.Tech Electrical Engineering",
      degree: "mTech",
      durationYears: 2,
    },
    yearSemesterBreakdown: [
      { yearOrSemester: "Year 1", amount: 140000 },
      { yearOrSemester: "Year 2", amount: 140000 },
    ],
  },
  {
    course: {
      branch: "Master of Business Administration",
      degree: "mba",
      durationYears: 2,
    },
    yearSemesterBreakdown: [
      { yearOrSemester: "Year 1", amount: 95000 },
      { yearOrSemester: "Year 2", amount: 95000 },
    ],
  },
  {
    course: {
      branch: "Master of Computer Applications",
      degree: "mca",
      durationYears: 2,
    },
    yearSemesterBreakdown: [
      { yearOrSemester: "Year 1", amount: 90000 },
      { yearOrSemester: "Year 2", amount: 90000 },
    ],
  },
];

const DEFAULT_FACULTY: LocalFaculty[] = [
  {
    name: "Dr. Suresh Kumar",
    qualification: "PhD (Mathematics)",
    designation: "Professor & HOD",
    department: "Science & Humanities",
    subjectsTaught: ["Engineering Mathematics", "Calculus"],
  },
  {
    name: "Dr. Priya Nair",
    qualification: "PhD (Physics)",
    designation: "Associate Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Engineering Physics", "Optics"],
  },
  {
    name: "Prof. Anitha Raj",
    qualification: "MSc (Chemistry)",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Engineering Chemistry"],
  },
  {
    name: "Dr. Rajesh Menon",
    qualification: "PhD (CSE)",
    designation: "Professor & HOD",
    department: "Computer Science",
    subjectsTaught: ["Data Structures", "Algorithms", "DBMS"],
  },
  {
    name: "Ms. Nisha Pillai",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "Computer Science",
    subjectsTaught: ["Operating Systems", "Computer Networks"],
  },
  {
    name: "Mr. Arun Thomas",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "Computer Science",
    subjectsTaught: ["Web Technologies", "Cloud Computing"],
  },
  {
    name: "Dr. Santhosh P",
    qualification: "PhD (EEE)",
    designation: "Professor & HOD",
    department: "Electrical & Electronics",
    subjectsTaught: ["Power Systems", "Electrical Machines"],
  },
  {
    name: "Ms. Divya Krishnan",
    qualification: "MTech (Power Electronics)",
    designation: "Assistant Professor",
    department: "Electrical & Electronics",
    subjectsTaught: ["Power Electronics", "Control Systems"],
  },
  {
    name: "Dr. Manoj Kumar",
    qualification: "PhD (Mechanical)",
    designation: "Professor & HOD",
    department: "Mechanical Engineering",
    subjectsTaught: ["Thermodynamics", "Fluid Mechanics"],
  },
  {
    name: "Mr. Vivek S",
    qualification: "MTech (Manufacturing)",
    designation: "Assistant Professor",
    department: "Mechanical Engineering",
    subjectsTaught: ["Manufacturing Technology", "Machine Design"],
  },
  {
    name: "Dr. Jayakumar P",
    qualification: "PhD (Naval Architecture)",
    designation: "Professor & HOD",
    department: "Naval Architecture",
    subjectsTaught: ["Ship Design", "Marine Hydrodynamics"],
  },
  {
    name: "Dr. Aswathy R",
    qualification: "PhD (Civil)",
    designation: "Professor & HOD",
    department: "Civil Engineering",
    subjectsTaught: ["Structural Engineering", "Concrete Technology"],
  },
  {
    name: "Mr. Sreejith V",
    qualification: "MTech (AI)",
    designation: "Assistant Professor",
    department: "AI & Cyber Security",
    subjectsTaught: ["Machine Learning", "Deep Learning"],
  },
];

const degreeLabels: Record<string, string> = {
  bTech: "B.Tech",
  mTech: "M.Tech",
  mba: "MBA",
  mca: "MCA",
};

const DEGREE_OPTIONS = ["bTech", "mTech", "mba", "mca"];

type AdminTab = "classified" | "courses" | "fees" | "faculty";

export function AdminDashboard() {
  const { isLoggedIn, role, userName } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<AdminTab>("classified");

  useEffect(() => {
    if (!isLoggedIn || role !== "admin") {
      navigate({ to: "/login" });
    }
  }, [isLoggedIn, role, navigate]);

  if (!isLoggedIn || role !== "admin") return null;

  const inputClass =
    "glass-sm w-full px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none rounded-xl border-0 focus:ring-1 focus:ring-foreground/20";

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
            <ShieldAlert size={20} className="text-foreground/70" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              {userName}
            </h1>
            <p className="text-muted-foreground text-sm">
              Admin Dashboard · Manage College Data
            </p>
          </div>
        </div>

        <div
          className="glass rounded-2xl p-1.5 mb-6 flex gap-1"
          data-ocid="admin.tab"
        >
          {(
            [
              { key: "classified", label: "Classified", icon: Lock },
              { key: "courses", label: "Courses", icon: BookOpen },
              { key: "fees", label: "Fees", icon: DollarSign },
              { key: "faculty", label: "Faculty", icon: Users },
            ] as { key: AdminTab; label: string; icon: ElementType }[]
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              data-ocid={`admin.${key}.tab`}
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

        {activeTab === "classified" && (
          <ClassifiedTab inputClass={inputClass} />
        )}
        {activeTab === "courses" && <CoursesTab inputClass={inputClass} />}
        {activeTab === "fees" && <FeesTab inputClass={inputClass} />}
        {activeTab === "faculty" && <FacultyTab inputClass={inputClass} />}
      </div>
    </div>
  );
}

function ClassifiedTab({ inputClass }: { inputClass: string }) {
  const { actor } = useActor();
  const [items, setItems] = useState<ClassifiedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [uniquePassword, setUniquePassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!actor) return;
    (actor as any)
      .getClassifiedDocs()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [actor]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    if (!title.trim() || !content.trim() || !uniquePassword.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    const newItem: ClassifiedDoc = {
      id: `classified_${Date.now()}`,
      title: title.trim(),
      category,
      content: content.trim(),
      uniquePassword: uniquePassword.trim(),
      createdAt: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    await (actor as any).addClassifiedDoc(newItem);
    const updated = await (actor as any).getClassifiedDocs();
    setItems(updated);
    setTitle("");
    setCategory(CATEGORIES[0]);
    setContent("");
    setUniquePassword("");
    toast.success("Classified item added.");
  };

  const handleDelete = async (id: string) => {
    if (!actor) return;
    await (actor as any).removeClassifiedDoc(id);
    const updated = await (actor as any).getClassifiedDocs();
    setItems(updated);
    setRevealedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success("Item deleted.");
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <div className="glass rounded-2xl p-5 mb-6">
        <h2 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
          <Plus size={15} className="text-foreground/70" />
          Add New Classified Item
        </h2>
        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-4"
          data-ocid="admin.classified.panel"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="classified-title"
                className="text-xs font-medium text-muted-foreground mb-1.5 block"
              >
                Title
              </label>
              <input
                id="classified-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Semester Exam Guidelines"
                data-ocid="admin.title.input"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="classified-category"
                className="text-xs font-medium text-muted-foreground mb-1.5 block"
              >
                Category
              </label>
              <select
                id="classified-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                data-ocid="admin.category.select"
                className={`${inputClass} cursor-pointer`}
              >
                {CATEGORIES.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-background text-foreground"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="classified-content"
              className="text-xs font-medium text-muted-foreground mb-1.5 block"
            >
              Content
            </label>
            <textarea
              id="classified-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the confidential content here..."
              rows={4}
              data-ocid="admin.content.textarea"
              required
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label
              htmlFor="classified-password"
              className="text-xs font-medium text-muted-foreground mb-1.5 block"
            >
              Unique Access Password{" "}
              <span className="text-muted-foreground/60">(Admin-only)</span>
            </label>
            <div className="relative">
              <input
                id="classified-password"
                type={showNewPass ? "text" : "password"}
                value={uniquePassword}
                onChange={(e) => setUniquePassword(e.target.value)}
                placeholder="Set a unique password"
                data-ocid="admin.password.input"
                required
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowNewPass((v) => !v)}
                data-ocid="admin.showpassword.toggle"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            data-ocid="admin.classified.submit_button"
            className="glass-btn py-3 w-full flex items-center justify-center gap-2 font-semibold text-sm text-foreground"
          >
            <Lock size={15} />
            Add Classified Item
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2 px-1">
          <FileText size={15} className="text-foreground/70" />
          Classified Documents
        </h2>
        {loading ? (
          <div
            className="flex flex-col gap-3"
            data-ocid="admin.classified.loading_state"
          >
            {[1, 2, 3].map((k) => (
              <div key={k} className="glass rounded-2xl p-5">
                <Skeleton className="h-5 w-48 mb-2 bg-foreground/10" />
                <Skeleton className="h-4 w-full mb-1 bg-foreground/10" />
                <Skeleton className="h-4 w-3/4 bg-foreground/10" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div
            className="glass rounded-2xl p-10 flex flex-col items-center gap-3 text-center"
            data-ocid="admin.classified.empty_state"
          >
            <div className="glass-sm w-12 h-12 rounded-2xl flex items-center justify-center">
              <Lock size={20} className="text-foreground/40" />
            </div>
            <p className="text-muted-foreground text-sm">
              No classified documents yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item, idx) => {
              const isRevealed = revealedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className="glass rounded-2xl p-5"
                  data-ocid={`admin.classified.item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {item.title}
                        </h3>
                        <span className="glass-sm px-2 py-0.5 rounded-full text-[10px] text-muted-foreground shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground/60">
                        {item.createdAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      data-ocid={`admin.classified.delete_button.${idx + 1}`}
                      className="glass-btn p-2 text-destructive shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {item.content}
                  </p>
                  <div className="glass-sm rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Lock
                        size={12}
                        className="text-muted-foreground shrink-0"
                      />
                      <span className="text-xs text-muted-foreground font-mono truncate">
                        {isRevealed
                          ? item.uniquePassword
                          : "•".repeat(
                              Math.min(item.uniquePassword.length, 12),
                            )}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleReveal(item.id)}
                      data-ocid={`admin.classified.toggle.${idx + 1}`}
                      className="glass-btn p-1.5 text-muted-foreground hover:text-foreground shrink-0"
                    >
                      {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function CoursesTab({ inputClass }: { inputClass: string }) {
  const { actor } = useActor();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState("");
  const [degree, setDegree] = useState("bTech");
  const [durationYears, setDurationYears] = useState(4);
  const [intake, setIntake] = useState(60);

  useEffect(() => {
    if (!actor) return;
    (actor as any)
      .getAdminCourses()
      .then(async (result) => {
        if (result.length === 0) {
          await Promise.all(
            DEFAULT_COURSES.map((c) =>
              (actor as any).addAdminCourse({
                branch: c.branch,
                degree: c.degree,
                durationYears: BigInt(c.durationYears),
                intake: BigInt(c.intake),
              }),
            ),
          );
          const seeded = await (actor as any).getAdminCourses();
          setCourses(seeded);
        } else {
          setCourses(result);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [actor]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    if (!branch.trim()) {
      toast.error("Branch name is required.");
      return;
    }
    await (actor as any).addAdminCourse({
      branch: branch.trim(),
      degree,
      durationYears: BigInt(durationYears),
      intake: BigInt(intake),
    });
    const updated = await (actor as any).getAdminCourses();
    setCourses(updated);
    setBranch("");
    setDegree("bTech");
    setDurationYears(4);
    setIntake(60);
    toast.success("Course added.");
  };

  const handleRemove = async (courseBranch: string) => {
    if (!actor) return;
    await (actor as any).removeAdminCourse(courseBranch);
    const updated = await (actor as any).getAdminCourses();
    setCourses(updated);
    toast.success("Course removed.");
  };

  return (
    <>
      <div className="glass rounded-2xl p-5 mb-6">
        <h2 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
          <Plus size={15} className="text-foreground/70" />
          Add New Course
        </h2>
        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-4"
          data-ocid="admin.courses.panel"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Branch / Program Name
              </p>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                data-ocid="admin.courses.branch.input"
                required
                className={inputClass}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Degree
              </p>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                data-ocid="admin.courses.degree.select"
                className={`${inputClass} cursor-pointer`}
              >
                {DEGREE_OPTIONS.map((d) => (
                  <option
                    key={d}
                    value={d}
                    className="bg-background text-foreground"
                  >
                    {degreeLabels[d]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Duration (Years)
              </p>
              <input
                type="number"
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                min={1}
                max={6}
                data-ocid="admin.courses.duration.input"
                required
                className={inputClass}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Intake
              </p>
              <input
                type="number"
                value={intake}
                onChange={(e) => setIntake(Number(e.target.value))}
                min={1}
                data-ocid="admin.courses.intake.input"
                required
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            data-ocid="admin.courses.submit_button"
            className="glass-btn py-3 w-full flex items-center justify-center gap-2 font-semibold text-sm text-foreground"
          >
            <Plus size={15} /> Add Course
          </button>
        </form>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
          <BookOpen size={15} className="text-foreground/70" />
          <span className="font-semibold text-foreground text-sm">
            All Courses ({courses.length})
          </span>
        </div>
        {loading ? (
          <div
            className="p-5 flex flex-col gap-2"
            data-ocid="admin.courses.loading_state"
          >
            {[1, 2, 3, 4].map((k) => (
              <Skeleton key={k} className="h-10 w-full bg-foreground/10" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div
            className="p-10 text-center"
            data-ocid="admin.courses.empty_state"
          >
            <p className="text-muted-foreground text-sm">No courses yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["Branch", "Degree", "Duration", "Intake", ""].map((h) => (
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
                {courses.map((c, i) => (
                  <tr
                    key={`${c.branch}-${i}`}
                    className="border-b border-white/5 last:border-0 hover:bg-foreground/5"
                    data-ocid={`admin.courses.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-foreground font-medium">
                      {c.branch}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {degreeLabels[c.degree] ?? c.degree}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {Number(c.durationYears)} yr
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {Number(c.intake)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleRemove(c.branch)}
                        data-ocid={`admin.courses.delete_button.${i + 1}`}
                        className="glass-btn p-1.5 text-destructive"
                      >
                        <Trash2 size={13} />
                      </button>
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

function FeesTab({ inputClass }: { inputClass: string }) {
  const { actor } = useActor();
  const [fees, setFees] = useState<AdminFeeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editRows, setEditRows] = useState<
    { yearOrSemester: string; amount: number }[]
  >([]);

  useEffect(() => {
    if (!actor) return;
    (actor as any)
      .getAdminFeeEntries()
      .then(async (result) => {
        if (result.length === 0) {
          await Promise.all(
            DEFAULT_FEES.map((f) =>
              (actor as any).upsertAdminFeeEntry({
                courseBranch: f.course.branch,
                yearSemesterBreakdown: f.yearSemesterBreakdown,
              }),
            ),
          );
          const seeded = await (actor as any).getAdminFeeEntries();
          setFees(seeded);
        } else {
          setFees(result);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [actor]);

  const openEdit = (idx: number) => {
    setEditIdx(idx);
    setEditRows(fees[idx].yearSemesterBreakdown.map((r) => ({ ...r })));
  };

  const saveEdit = async () => {
    if (editIdx === null || !actor) return;
    const entry = fees[editIdx];
    await (actor as any).upsertAdminFeeEntry({
      courseBranch: entry.courseBranch,
      yearSemesterBreakdown: editRows,
    });
    const updated = await (actor as any).getAdminFeeEntries();
    setFees(updated);
    setEditIdx(null);
    toast.success("Fees updated.");
  };

  const formatRs = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <>
      <div className="glass rounded-2xl overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
          <DollarSign size={15} className="text-foreground/70" />
          <span className="font-semibold text-foreground text-sm">
            Fee Structures
          </span>
        </div>
        {loading ? (
          <div
            className="p-5 flex flex-col gap-2"
            data-ocid="admin.fees.loading_state"
          >
            {[1, 2, 3].map((k) => (
              <Skeleton key={k} className="h-16 w-full bg-foreground/10" />
            ))}
          </div>
        ) : fees.length === 0 ? (
          <div className="p-10 text-center" data-ocid="admin.fees.empty_state">
            <p className="text-muted-foreground text-sm">
              No fee structures found.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {fees.map((fs, i) => {
              const total = fs.yearSemesterBreakdown.reduce(
                (s, r) => s + r.amount,
                0,
              );
              return (
                <div
                  key={`${fs.courseBranch}-${i}`}
                  className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-foreground/5"
                  data-ocid={`admin.fees.item.${i + 1}`}
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {fs.courseBranch}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Total {formatRs(total)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openEdit(i)}
                    data-ocid={`admin.fees.edit_button.${i + 1}`}
                    className="glass-btn px-3 py-1.5 flex items-center gap-1.5 text-xs text-foreground shrink-0"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          data-ocid="admin.fees.dialog"
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: modal backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditIdx(null)}
          />
          <div className="glass rounded-2xl p-6 w-full max-w-md relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">
                {fees[editIdx].courseBranch}
              </h3>
              <button
                type="button"
                onClick={() => setEditIdx(null)}
                data-ocid="admin.fees.close_button"
                className="glass-btn p-1.5 text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-3 mb-4">
              {editRows.map((row, ri) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: fee year rows are positional
                <div key={ri} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-16 shrink-0">
                    {row.yearOrSemester}
                  </span>
                  <input
                    type="number"
                    value={row.amount}
                    onChange={(e) =>
                      setEditRows((prev) =>
                        prev.map((r, rIdx) =>
                          rIdx === ri
                            ? { ...r, amount: Number(e.target.value) }
                            : r,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="Amount (₹)"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={saveEdit}
              data-ocid="admin.fees.save_button"
              className="glass-btn py-3 w-full flex items-center justify-center gap-2 font-semibold text-sm text-foreground"
            >
              <Save size={15} /> Save Fees
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function FacultyTab({ inputClass }: { inputClass: string }) {
  const { actor } = useActor();
  const [faculty, setFaculty] = useState<AdminFacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [subjects, setSubjects] = useState("");

  useEffect(() => {
    if (!actor) return;
    (actor as any)
      .getAdminFacultyList()
      .then(async (result) => {
        if (result.length === 0) {
          await Promise.all(
            DEFAULT_FACULTY.map((f) =>
              (actor as any).addAdminFaculty({
                name: f.name,
                qualification: f.qualification,
                designation: f.designation,
                department: f.department,
                subjectsTaught: f.subjectsTaught,
              }),
            ),
          );
          const seeded = await (actor as any).getAdminFacultyList();
          setFaculty(seeded);
        } else {
          setFaculty(result);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [actor]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    if (!name.trim() || !department.trim()) {
      toast.error("Name and department are required.");
      return;
    }
    const newMember: AdminFacultyMember = {
      name: name.trim(),
      qualification: qualification.trim(),
      designation: designation.trim(),
      department: department.trim(),
      subjectsTaught: subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    await (actor as any).addAdminFaculty(newMember);
    const updated = await (actor as any).getAdminFacultyList();
    setFaculty(updated);
    setName("");
    setQualification("");
    setDesignation("");
    setDepartment("");
    setSubjects("");
    toast.success("Faculty member added.");
  };

  const handleRemove = async (memberName: string, memberDept: string) => {
    if (!actor) return;
    await (actor as any).removeAdminFaculty(memberName, memberDept);
    const updated = await (actor as any).getAdminFacultyList();
    setFaculty(updated);
    toast.success("Faculty member removed.");
  };

  const departments = Array.from(
    new Set(faculty.map((f) => f.department)),
  ).sort();

  return (
    <>
      <div className="glass rounded-2xl p-5 mb-6">
        <h2 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
          <Plus size={15} className="text-foreground/70" />
          Add Faculty Member
        </h2>
        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-4"
          data-ocid="admin.faculty.panel"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Full Name
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Anil Kumar"
                data-ocid="admin.faculty.name.input"
                required
                className={inputClass}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Qualification
              </p>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. PhD (Computer Science)"
                data-ocid="admin.faculty.qualification.input"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Designation
              </p>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Assistant Professor"
                data-ocid="admin.faculty.designation.input"
                className={inputClass}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Department
              </p>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                data-ocid="admin.faculty.department.input"
                required
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Subjects Taught{" "}
              <span className="text-muted-foreground/60">
                (comma-separated)
              </span>
            </p>
            <input
              type="text"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="e.g. Data Structures, Algorithms"
              data-ocid="admin.faculty.subjects.input"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            data-ocid="admin.faculty.submit_button"
            className="glass-btn py-3 w-full flex items-center justify-center gap-2 font-semibold text-sm text-foreground"
          >
            <Plus size={15} /> Add Faculty Member
          </button>
        </form>
      </div>

      {loading ? (
        <div
          className="flex flex-col gap-3"
          data-ocid="admin.faculty.loading_state"
        >
          {[1, 2, 3].map((k) => (
            <div key={k} className="glass rounded-2xl p-5">
              <Skeleton className="h-5 w-32 mb-2 bg-foreground/10" />
              <Skeleton className="h-4 w-48 mb-1 bg-foreground/10" />
              <Skeleton className="h-3 w-full bg-foreground/10" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {departments.map((dept) => {
            const members = faculty.filter((f) => f.department === dept);
            return (
              <div key={dept} className="glass rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
                  <GraduationCap size={14} className="text-foreground/70" />
                  <span className="font-semibold text-foreground text-sm">
                    {dept}
                  </span>
                  <span className="glass-sm px-2 py-0.5 rounded-full text-[10px] text-muted-foreground ml-auto">
                    {members.length}
                  </span>
                </div>
                <div className="divide-y divide-white/5">
                  {members.map((member) => {
                    const globalIdx = faculty.indexOf(member);
                    return (
                      <div
                        key={`${member.name}-${globalIdx}`}
                        className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-foreground/5"
                        data-ocid={`admin.faculty.item.${globalIdx + 1}`}
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.designation} · {member.qualification}
                          </p>
                          {member.subjectsTaught.length > 0 && (
                            <p className="text-xs text-muted-foreground/60 mt-0.5">
                              {member.subjectsTaught.join(", ")}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(member.name, member.department)
                          }
                          data-ocid={`admin.faculty.delete_button.${globalIdx + 1}`}
                          className="glass-btn p-1.5 text-destructive shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {faculty.length === 0 && (
            <div
              className="glass rounded-2xl p-10 text-center"
              data-ocid="admin.faculty.empty_state"
            >
              <p className="text-muted-foreground text-sm">
                No faculty members yet.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
