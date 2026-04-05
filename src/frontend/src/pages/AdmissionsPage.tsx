import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Info,
  Mail,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const ELIGIBILITY = [
  {
    program: "B.Tech",
    icon: GraduationCap,
    criteria: [
      "10+2 with Physics, Chemistry & Mathematics",
      "Minimum 45% aggregate marks (40% for SC/ST/OBC)",
      "Valid KEAM rank from CEE Kerala",
      "Age: Born on or after July 1, 2002 (general)",
    ],
  },
  {
    program: "M.Tech",
    icon: BookOpen,
    criteria: [
      "B.Tech/B.E. in relevant engineering branch",
      "Minimum 60% aggregate marks",
      "GATE score preferred (for merit scholarships)",
      "Kerala or all-India rank considered",
    ],
  },
  {
    program: "MBA",
    icon: Shield,
    criteria: [
      "Any bachelor's degree with minimum 50% marks",
      "Valid KMAT / CMAT / MAT score",
      "Group discussion and personal interview",
      "Work experience is an added advantage",
    ],
  },
  {
    program: "MCA",
    icon: FileText,
    criteria: [
      "BCA / B.Sc (Computer Science) or equivalent",
      "Mathematics as subject in 10+2 or graduation",
      "Valid KMAT-MCA score",
      "Minimum 50% in qualifying exam",
    ],
  },
];

const STEPS = [
  {
    number: 1,
    title: "Register on Portal",
    desc: "Create your profile on the KEAM / KMAT / LBS portal and fill the application form online.",
  },
  {
    number: 2,
    title: "Appear for Entrance",
    desc: "Sit for the respective entrance exam (KEAM for B.Tech, KMAT for MBA/MCA, GATE for M.Tech).",
  },
  {
    number: 3,
    title: "Check Rank & Score",
    desc: "After results, note your rank or score. Verify SNGCE's previous year closing ranks for your branch.",
  },
  {
    number: 4,
    title: "Attend Counseling",
    desc: "Participate in centralized allotment (LBS Centre for KEAM). Register your preferred colleges and branches.",
  },
  {
    number: 5,
    title: "Receive Allotment",
    desc: "Get your allotment letter from the portal if SNGCE is assigned. Download and print it immediately.",
  },
  {
    number: 6,
    title: "Report to College",
    desc: "Visit SNGCE Admissions Office with all original documents within the stipulated date.",
  },
];

const IMPORTANT_DATES = [
  { event: "KEAM Registration Opens", date: "January 15 – March 31" },
  { event: "KEAM Examination", date: "April 25 – 26" },
  { event: "KEAM Result Declaration", date: "June 10" },
  { event: "LBS Counseling Begins", date: "July 1 onwards" },
  { event: "KMAT Registration (MBA/MCA)", date: "March 1 – April 30" },
  { event: "Classes Begin", date: "August 1" },
];

const COURSES_INTAKE = [
  { branch: "Computer Science Engineering", intake: 180, degree: "B.Tech" },
  { branch: "Electronics & Communication Engg", intake: 120, degree: "B.Tech" },
  { branch: "Civil Engineering", intake: 60, degree: "B.Tech" },
  { branch: "Electrical & Electronics Engg", intake: 60, degree: "B.Tech" },
  { branch: "Mechanical Engineering", intake: 60, degree: "B.Tech" },
  {
    branch: "Naval Architecture & Ship Building",
    intake: 120,
    degree: "B.Tech",
  },
  { branch: "AI & Cyber Security", intake: 60, degree: "B.Tech" },
  { branch: "Industrial Engineering & Mgmt", intake: 60, degree: "B.Tech" },
  { branch: "Computer Science & Design", intake: 60, degree: "B.Tech" },
  { branch: "M.Tech (CSE / VLSI / Structural)", intake: 18, degree: "M.Tech" },
  { branch: "Management Studies", intake: 60, degree: "MBA" },
  { branch: "Master of Computer Applications", intake: 30, degree: "MCA" },
];

const DOCUMENTS = [
  "10th Standard Mark Sheet & Certificate",
  "12th / Plus Two Mark Sheet & Certificate",
  "Entrance Exam Rank Card (KEAM/KMAT/GATE)",
  "Allotment Letter from Counseling Authority",
  "Community / Caste Certificate (if applicable)",
  "Income Certificate (for fee concession)",
  "Transfer Certificate (TC) from previous institution",
  "8 passport-size photographs (recent)",
];

export function AdmissionsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <div className="text-center" data-ocid="admissions.page">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="glass-sm p-2.5 rounded-xl">
              <GraduationCap size={22} className="text-foreground/70" />
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground text-shadow">
              Admissions
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start your engineering journey at SNGCE. Find program eligibility,
            application steps, and key dates.
          </p>
        </div>

        <div className="glass rounded-2xl p-6" data-ocid="admissions.section">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={18} className="text-foreground/60" />
            <h2 className="font-display font-bold text-xl text-foreground">
              Eligibility Criteria
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ELIGIBILITY.map((e) => (
              <div key={e.program} className="glass-sm rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="glass-sm p-2 rounded-lg">
                    <e.icon size={16} className="text-foreground/60" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground">
                    {e.program}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {e.criteria.map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <CheckCircle2
                        size={14}
                        className="text-foreground/40 mt-0.5 shrink-0"
                      />
                      <span className="text-sm text-muted-foreground">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <ChevronRight size={18} className="text-foreground/60" />
            <h2 className="font-display font-bold text-xl text-foreground">
              Application Process
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-px bg-white/10 hidden sm:block" />
            <div className="space-y-4">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="flex gap-4 items-start"
                  data-ocid={`admissions.item.${step.number}`}
                >
                  <div className="glass-sm w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10">
                    <span className="font-display font-bold text-lg text-foreground">
                      {step.number}
                    </span>
                  </div>
                  <div className="glass-sm rounded-2xl p-4 flex-1">
                    <p className="font-semibold text-foreground text-sm mb-1">
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Calendar size={18} className="text-foreground/60" />
              <h2 className="font-display font-bold text-xl text-foreground">
                Important Dates
              </h2>
            </div>
            <div className="space-y-3">
              {IMPORTANT_DATES.map((d, i) => (
                <div
                  key={d.event}
                  className="flex items-start justify-between gap-3 glass-sm rounded-xl px-4 py-3"
                  data-ocid={`admissions.item.${i + 7}`}
                >
                  <p className="text-sm text-foreground">{d.event}</p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                    {d.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <FileText size={18} className="text-foreground/60" />
              <h2 className="font-display font-bold text-xl text-foreground">
                Documents Required
              </h2>
            </div>
            <ul className="space-y-2.5">
              {DOCUMENTS.map((doc, i) => (
                <li
                  key={doc}
                  className="flex items-start gap-2"
                  data-ocid={`admissions.item.${i + 13}`}
                >
                  <CheckCircle2
                    size={14}
                    className="text-foreground/40 mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-muted-foreground">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <GraduationCap size={18} className="text-foreground/60" />
            <h2 className="font-display font-bold text-xl text-foreground">
              Available Programs & Intake
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["Program", "Degree", "Intake Seats"].map((h) => (
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
                {COURSES_INTAKE.map((c, i) => (
                  <tr
                    key={c.branch}
                    className="border-b border-white/5 last:border-0 hover:bg-foreground/5 transition-colors"
                    data-ocid={`admissions.row.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-foreground">{c.branch}</td>
                    <td className="px-4 py-3">
                      <span className="glass-pill px-2.5 py-1 text-xs font-medium text-foreground">
                        {c.degree}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      {c.intake}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Info size={18} className="text-foreground/60" />
            <h2 className="font-display font-bold text-xl text-foreground">
              Management Quota
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            A limited number of management quota seats are available for
            eligible candidates who do not secure admission through the regular
            merit/counseling process. These seats are filled at the
            institutional level based on merit and availability.
          </p>
          <div className="glass-sm rounded-xl p-4 flex items-start gap-3">
            <Info size={16} className="text-foreground/40 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              For management quota inquiries, contact the Admissions Office
              directly with your entrance exam scorecard. Seats are limited and
              filled on a first-come, first-served basis from eligible
              applicants.
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Phone size={18} className="text-foreground/60" />
            <h2 className="font-display font-bold text-xl text-foreground">
              Contact Admissions Office
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-sm rounded-xl p-4 flex items-center gap-3">
              <MapPin size={18} className="text-foreground/50 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium text-foreground">
                  Kadayirippu P.O., Kolenchery,
                  <br />
                  Ernakulam 682311
                </p>
              </div>
            </div>
            <div className="glass-sm rounded-xl p-4 flex items-center gap-3">
              <Phone size={18} className="text-foreground/50 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">
                  0484-2597800
                </p>
              </div>
            </div>
            <div className="glass-sm rounded-xl p-4 flex items-center gap-3">
              <Mail size={18} className="text-foreground/50 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">
                  admissions@sngce.ac.in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
