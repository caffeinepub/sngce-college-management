import { Skeleton } from "@/components/ui/skeleton";
import { Award, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import type { FacultyMember } from "../backend.d";
import { useTheme } from "../contexts/ThemeContext";
import { useFacultyDirectory } from "../hooks/useQueries";

interface LocalFaculty {
  name: string;
  qualification: string;
  designation: string;
  department: string;
  subjectsTaught: string[];
}

const STATIC_FACULTY: LocalFaculty[] = [
  {
    name: "Dr. Lissy A",
    qualification: "PhD",
    designation: "Professor & Head",
    department: "Science & Humanities",
    subjectsTaught: ["Engineering Mathematics"],
  },
  {
    name: "Dr. Bindu K",
    qualification: "PhD",
    designation: "Associate Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Engineering Physics"],
  },
  {
    name: "Dr. Suja P",
    qualification: "PhD",
    designation: "Associate Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Engineering Chemistry"],
  },
  {
    name: "Ms. Aneena Ann Alex",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Mathematics"],
  },
  {
    name: "Ms. Meera Mohan",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Physics"],
  },
  {
    name: "Ms. Sreelekha C",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Chemistry"],
  },
  {
    name: "Mr. Sijo Joseph",
    qualification: "MA",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["English"],
  },
  {
    name: "Ms. Anisha Mol P",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Mathematics"],
  },
  {
    name: "Ms. Reshma P R",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Physics"],
  },
  {
    name: "Ms. Nimitha N",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Mathematics"],
  },
  {
    name: "Ms. Aiswarya S",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Chemistry"],
  },
  {
    name: "Mr. Akash Suresh",
    qualification: "MA",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["English"],
  },
  {
    name: "Ms. Arya B",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Mathematics"],
  },
  {
    name: "Ms. Diya Susan Varghese",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Physics"],
  },
  {
    name: "Ms. Jessy Mariam Jose",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Chemistry"],
  },
  {
    name: "Ms. Liya Mary Mathew",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Mathematics"],
  },
  {
    name: "Ms. Sandra V",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Physics"],
  },
  {
    name: "Ms. Sreedevi V",
    qualification: "MSc",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["Chemistry"],
  },
  {
    name: "Mr. Vishnu S",
    qualification: "MA",
    designation: "Assistant Professor",
    department: "Science & Humanities",
    subjectsTaught: ["English"],
  },
  {
    name: "Prof. Dr. Smitha Suresh",
    qualification: "PhD (CSE)",
    designation: "Professor & Head",
    department: "Computer Science & Engineering",
    subjectsTaught: ["Compiler Design", "Theory of Computation"],
  },
  {
    name: "Mr. Saini Jacob Soman",
    qualification: "MTech (CSE)",
    designation: "Associate Professor",
    department: "Computer Science & Engineering",
    subjectsTaught: ["Data Structures", "Algorithms"],
  },
  {
    name: "Mrs. Sindhu M P",
    qualification: "MTech (CSE)",
    designation: "Associate Professor",
    department: "Computer Science & Engineering",
    subjectsTaught: ["Operating Systems", "Computer Networks"],
  },
  {
    name: "Mrs. Lisha Kurian",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    subjectsTaught: ["DBMS", "Web Technologies"],
  },
  {
    name: "Mrs. Shimi P S",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    subjectsTaught: ["Software Engineering", "Cloud Computing"],
  },
  {
    name: "Mrs. Nisha P K",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    subjectsTaught: ["Programming in C", "Python"],
  },
  {
    name: "Mrs. Jean Jacob",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    subjectsTaught: ["Computer Architecture", "Microprocessors"],
  },
  {
    name: "Baazil P. Thampy",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    subjectsTaught: ["AI", "Deep Learning"],
  },
  {
    name: "Anciya Ebrahim",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    subjectsTaught: ["Cyber Security", "Cryptography"],
  },
  {
    name: "Shamna Shahul",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    subjectsTaught: ["Mobile Computing", "IoT"],
  },
  {
    name: "Jisha N T",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    subjectsTaught: ["Big Data", "Hadoop"],
  },
  {
    name: "Ardra P Das",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    subjectsTaught: ["Distributed Systems"],
  },
  {
    name: "Anjali Suresh Kumar C",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    subjectsTaught: ["Multimedia & Communication"],
  },
  {
    name: "Dr. Smitha R",
    qualification: "PhD (EEE)",
    designation: "Professor & Head",
    department: "Electrical & Electronics Engineering",
    subjectsTaught: ["Power Systems", "Electrical Machines"],
  },
  {
    name: "Mr. Anil Kumar A",
    qualification: "MTech (Power Electronics)",
    designation: "Assistant Professor",
    department: "Electrical & Electronics Engineering",
    subjectsTaught: ["Power Electronics", "Drives"],
  },
  {
    name: "Ms. Anupama K",
    qualification: "MTech (EEE)",
    designation: "Assistant Professor",
    department: "Electrical & Electronics Engineering",
    subjectsTaught: ["Control Systems", "Instrumentation"],
  },
  {
    name: "Mr. Biju K",
    qualification: "MTech (EEE)",
    designation: "Assistant Professor",
    department: "Electrical & Electronics Engineering",
    subjectsTaught: ["Circuit Theory", "Electromagnetics"],
  },
  {
    name: "Ms. Divya M",
    qualification: "MTech (EEE)",
    designation: "Assistant Professor",
    department: "Electrical & Electronics Engineering",
    subjectsTaught: ["Power Quality", "Smart Grid"],
  },
  {
    name: "Mr. Jibin Jose",
    qualification: "MTech (EEE)",
    designation: "Assistant Professor",
    department: "Electrical & Electronics Engineering",
    subjectsTaught: ["Renewable Energy", "HVDC"],
  },
  {
    name: "Ms. Nithya R",
    qualification: "MTech (EEE)",
    designation: "Assistant Professor",
    department: "Electrical & Electronics Engineering",
    subjectsTaught: ["Electrical Drawing", "Switchgear"],
  },
  {
    name: "Mr. Rajeev K",
    qualification: "MTech (EEE)",
    designation: "Assistant Professor",
    department: "Electrical & Electronics Engineering",
    subjectsTaught: ["Electrical Workshop"],
  },
  {
    name: "Ms. Sreeja S",
    qualification: "MTech (EEE)",
    designation: "Assistant Professor",
    department: "Electrical & Electronics Engineering",
    subjectsTaught: ["Utilization of Electrical Energy"],
  },
  {
    name: "Dr. Bino Joseph",
    qualification: "PhD (ECE)",
    designation: "Professor & Head",
    department: "Electronics & Communication Engineering",
    subjectsTaught: ["VLSI Design", "Embedded Systems"],
  },
  {
    name: "Ms. Anju P",
    qualification: "MTech (ECE)",
    designation: "Assistant Professor",
    department: "Electronics & Communication Engineering",
    subjectsTaught: ["Digital Signal Processing", "Communication Theory"],
  },
  {
    name: "Mr. Dino George",
    qualification: "MTech (ECE)",
    designation: "Assistant Professor",
    department: "Electronics & Communication Engineering",
    subjectsTaught: ["Microelectronics", "Analog Circuits"],
  },
  {
    name: "Ms. Leena V",
    qualification: "MTech (ECE)",
    designation: "Assistant Professor",
    department: "Electronics & Communication Engineering",
    subjectsTaught: ["Wireless Communication", "Antenna Design"],
  },
  {
    name: "Mr. Nithin K",
    qualification: "MTech (ECE)",
    designation: "Assistant Professor",
    department: "Electronics & Communication Engineering",
    subjectsTaught: ["Optical Fiber Communication", "Networks"],
  },
  {
    name: "Dr. Pradeep M",
    qualification: "PhD (Mechanical)",
    designation: "Professor & Head",
    department: "Mechanical Engineering",
    subjectsTaught: ["Thermodynamics", "Heat Transfer"],
  },
  {
    name: "Mr. Ajith K",
    qualification: "MTech (Manufacturing)",
    designation: "Assistant Professor",
    department: "Mechanical Engineering",
    subjectsTaught: ["Manufacturing Technology", "Metrology"],
  },
  {
    name: "Ms. Asha V",
    qualification: "MTech (Mechanical)",
    designation: "Assistant Professor",
    department: "Mechanical Engineering",
    subjectsTaught: ["Fluid Mechanics", "Hydraulic Machinery"],
  },
  {
    name: "Mr. Deepak R",
    qualification: "MTech (Mechanical)",
    designation: "Assistant Professor",
    department: "Mechanical Engineering",
    subjectsTaught: ["Machine Design", "Theory of Machines"],
  },
  {
    name: "Dr. Sujith R",
    qualification: "PhD (Naval Architecture)",
    designation: "Professor & Head",
    department: "Naval Architecture & Ship Building",
    subjectsTaught: ["Ship Design", "Marine Hydrodynamics"],
  },
  {
    name: "Mr. Anoop S",
    qualification: "MTech (Naval Architecture)",
    designation: "Assistant Professor",
    department: "Naval Architecture & Ship Building",
    subjectsTaught: ["Stability of Ships", "Resistance & Propulsion"],
  },
  {
    name: "Ms. Revathy R",
    qualification: "MTech (Naval Architecture)",
    designation: "Assistant Professor",
    department: "Naval Architecture & Ship Building",
    subjectsTaught: ["Ship Production", "Outfitting"],
  },
  {
    name: "Dr. Asha T",
    qualification: "PhD (Civil)",
    designation: "Professor & Head",
    department: "Civil Engineering",
    subjectsTaught: ["Structural Engineering", "Concrete Technology"],
  },
  {
    name: "Mr. Jijo K",
    qualification: "MTech (Civil)",
    designation: "Assistant Professor",
    department: "Civil Engineering",
    subjectsTaught: ["Transportation Engineering", "Highway Design"],
  },
  {
    name: "Ms. Nimisha N",
    qualification: "MTech (Civil)",
    designation: "Assistant Professor",
    department: "Civil Engineering",
    subjectsTaught: ["Environmental Engineering", "Water Supply"],
  },
  {
    name: "Dr. Sreekumar M",
    qualification: "PhD (AI)",
    designation: "Professor & Head",
    department: "AI & Cyber Security",
    subjectsTaught: ["Machine Learning", "Deep Learning"],
  },
  {
    name: "Ms. Anjali S",
    qualification: "MTech (CSE)",
    designation: "Assistant Professor",
    department: "AI & Cyber Security",
    subjectsTaught: ["Cyber Security", "Ethical Hacking"],
  },
  {
    name: "Mr. Kevin George",
    qualification: "MTech (AI)",
    designation: "Assistant Professor",
    department: "AI & Cyber Security",
    subjectsTaught: ["Computer Vision", "NLP"],
  },
];

function loadLocalFaculty(): LocalFaculty[] | null {
  try {
    const raw = localStorage.getItem("sngce_faculty");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function toDisplayFaculty(f: LocalFaculty | FacultyMember): LocalFaculty {
  return {
    name: f.name,
    qualification: f.qualification,
    designation: (f as LocalFaculty).designation ?? "",
    department: f.department,
    subjectsTaught: f.subjectsTaught ?? [],
  };
}

export function FacultyPage() {
  const { data: backendFaculty, isLoading } = useFacultyDirectory();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [search, setSearch] = useState("");

  const rawFaculty: LocalFaculty[] = useMemo(() => {
    const lf = loadLocalFaculty();
    if (lf && lf.length > 0) return lf;
    const backend = (backendFaculty ?? []).map(toDisplayFaculty);
    return backend.length > 0 ? backend : STATIC_FACULTY;
  }, [backendFaculty]);

  const departments = useMemo(() => {
    const depts = Array.from(new Set(rawFaculty.map((f) => f.department)));
    return ["All", ...depts.sort()];
  }, [rawFaculty]);

  const filtered = useMemo(() => {
    let list = rawFaculty;
    if (selectedDept !== "All")
      list = list.filter((f) => f.department === selectedDept);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.qualification.toLowerCase().includes(q) ||
          f.subjectsTaught.some((s) => s.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [rawFaculty, selectedDept, search]);

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
                data-ocid="faculty.dept.button"
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
                {departments.slice(5).map((d) => (
                  <option key={d} value={d} className="bg-background">
                    {d}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {isLoading && rawFaculty === STATIC_FACULTY ? (
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
            {filtered.map((member, i) => (
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
                  {member.designation && (
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      {member.designation}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="glass-sm px-2 py-0.5 text-xs text-foreground/70 rounded-full">
                      {member.department}
                    </span>
                  </div>
                  {member.subjectsTaught.length > 0 && (
                    <div className="mt-2">
                      <p className="text-muted-foreground text-xs mb-1 font-medium">
                        Subjects:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {member.subjectsTaught.map((subj) => (
                          <span
                            key={subj}
                            className="glass-sm px-2 py-0.5 text-xs text-foreground/60 rounded-lg"
                          >
                            {subj}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
