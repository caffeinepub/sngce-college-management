import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  MapPin,
  Phone,
  Quote,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const YEAR_DATA = [
  { year: "2021", rate: 85, placed: 238, total: 280 },
  { year: "2022", rate: 88, placed: 256, total: 291 },
  { year: "2023", rate: 90, placed: 279, total: 310 },
  { year: "2024", rate: 92, placed: 312, total: 339 },
];

const RECRUITERS = [
  { name: "UST Global", category: "IT" },
  { name: "Infosys", category: "IT" },
  { name: "TCS", category: "IT" },
  { name: "Ernst & Young", category: "Consulting" },
  { name: "Deloitte", category: "Consulting" },
  { name: "Accenture", category: "IT" },
  { name: "Wipro", category: "IT" },
  { name: "L&T", category: "Engineering" },
  { name: "ITC Infotech", category: "IT" },
  { name: "Cognizant", category: "IT" },
  { name: "HCL Technologies", category: "IT" },
  { name: "KPMG", category: "Consulting" },
  { name: "Capgemini", category: "IT" },
  { name: "IBM", category: "IT" },
];

const DEPT_STATS = [
  { dept: "CSE", rate: 95, color: "from-blue-500/20 to-blue-600/10" },
  { dept: "ECE", rate: 90, color: "from-purple-500/20 to-purple-600/10" },
  { dept: "Civil", rate: 82, color: "from-amber-500/20 to-amber-600/10" },
  {
    dept: "Mechanical",
    rate: 78,
    color: "from-orange-500/20 to-orange-600/10",
  },
  { dept: "EEE", rate: 85, color: "from-green-500/20 to-green-600/10" },
  {
    dept: "Naval Architecture",
    rate: 88,
    color: "from-cyan-500/20 to-cyan-600/10",
  },
];

const TESTIMONIALS = [
  {
    name: "Arjun Krishnan",
    dept: "CSE, 2023 Batch",
    company: "Infosys",
    package: "5.5 LPA",
    quote:
      "The Training & Placement Cell at SNGCE was phenomenal. The mock interviews, aptitude training, and industry mentorship sessions truly prepared me for a competitive placement process.",
  },
  {
    name: "Priya Nambiar",
    dept: "ECE, 2023 Batch",
    company: "UST Global",
    package: "6.2 LPA",
    quote:
      "I never expected to get placed at a top MNC right out of college. The college brought UST Global on campus and I secured my offer in the first placement drive itself.",
  },
  {
    name: "Rahul Varma",
    dept: "CSE, 2022 Batch",
    company: "Deloitte",
    package: "7.0 LPA",
    quote:
      "SNGCE's focus on both technical skills and soft skills gave me an edge. The placement process was well-organized and the faculty support throughout was outstanding.",
  },
];

export function PlacementsPage() {
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
        <div className="text-center mb-4" data-ocid="placements.page">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="glass-sm p-2.5 rounded-xl">
              <Briefcase size={22} className="text-foreground/70" />
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground text-shadow">
              Placements
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            SNGCE's Training & Placement Cell connects talented graduates with
            India's top companies.
          </p>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          data-ocid="placements.section"
        >
          {[
            {
              icon: TrendingUp,
              label: "Placement Rate",
              value: "92%",
              sub: "Class of 2024",
            },
            {
              icon: Building2,
              label: "Companies Visited",
              value: "500+",
              sub: "Cumulative",
            },
            {
              icon: Star,
              label: "Highest Package",
              value: "12+ LPA",
              sub: "Per annum",
            },
            {
              icon: BarChart3,
              label: "Average Package",
              value: "4.5 LPA",
              sub: "Per annum",
            },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="glass rounded-2xl p-5 text-center">
              <div className="glass-sm w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon size={18} className="text-foreground/70" />
              </div>
              <p className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-1">
                {value}
              </p>
              <p className="text-xs font-semibold text-foreground/80">
                {label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-foreground/60" />
            <h2 className="font-display font-bold text-xl text-foreground">
              Year-wise Placement Trend
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="placements.table">
              <thead>
                <tr className="border-b border-white/10">
                  {[
                    "Year",
                    "Students Placed",
                    "Total Eligible",
                    "Placement Rate",
                    "Trend",
                  ].map((h) => (
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
                {YEAR_DATA.map((row, i) => (
                  <tr
                    key={row.year}
                    className="border-b border-white/5 last:border-0 hover:bg-foreground/5 transition-colors"
                    data-ocid={`placements.row.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {row.year}
                    </td>
                    <td className="px-4 py-3 text-foreground">{row.placed}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.total}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="inline-block h-1.5 rounded-full bg-foreground/30"
                          style={{ width: `${row.rate * 0.6}px` }}
                        />
                        <span className="font-bold text-foreground">
                          {row.rate}%
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {i > 0 && (
                        <span className="text-green-400/90 text-xs font-medium">
                          ↑ +{row.rate - YEAR_DATA[i - 1].rate}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={18} className="text-foreground/60" />
            <h2 className="font-display font-bold text-xl text-foreground">
              Top Recruiters
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {RECRUITERS.map((r, i) => (
              <div
                key={r.name}
                className="glass-sm rounded-xl px-3 py-3 text-center hover:bg-foreground/10 transition-colors"
                data-ocid={`placements.item.${i + 1}`}
              >
                <p className="text-sm font-semibold text-foreground">
                  {r.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {r.category}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Users size={18} className="text-foreground/60" />
            <h2 className="font-display font-bold text-xl text-foreground">
              Department-wise Placement
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEPT_STATS.map((d) => (
              <div key={d.dept} className="glass-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">
                    {d.dept}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {d.rate}%
                  </span>
                </div>
                <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground/50 rounded-full transition-all"
                    style={{ width: `${d.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={18} className="text-foreground/60" />
            <h2 className="font-display font-bold text-xl text-foreground">
              Training & Placement Cell
            </h2>
          </div>
          <p className="text-muted-foreground text-sm mb-5">
            SNGCE's dedicated T&P Cell works year-round to prepare students and
            attract top companies.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Aptitude Training",
                desc: "Regular sessions on quantitative, logical, and verbal aptitude to crack placement tests.",
              },
              {
                title: "Mock Interviews",
                desc: "Face-to-face practice interviews with industry professionals and alumni.",
              },
              {
                title: "Industry Connects",
                desc: "Guest lectures, workshops, and internship tie-ups with 50+ companies annually.",
              },
            ].map((item) => (
              <div key={item.title} className="glass-sm rounded-xl p-4">
                <p className="font-semibold text-foreground text-sm mb-1.5">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Quote size={18} className="text-foreground/60" />
            <h2 className="font-display font-bold text-xl text-foreground">
              Student Voices
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="glass-sm rounded-2xl p-5 flex flex-col gap-3"
                data-ocid={`placements.item.${i + 5}`}
              >
                <Quote size={20} className="text-foreground/25" />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {t.quote}
                </p>
                <div className="border-t border-white/10 pt-3">
                  <p className="font-semibold text-foreground text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.dept}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="glass-pill px-2.5 py-1 text-xs font-medium text-foreground">
                      {t.company}
                    </span>
                    <span className="glass-pill px-2.5 py-1 text-xs font-medium text-foreground">
                      {t.package}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-foreground/60" />
            <h2 className="font-display font-bold text-xl text-foreground">
              Contact Placement Cell
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-sm rounded-xl p-4 flex items-center gap-3">
              <MapPin size={18} className="text-foreground/50 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium text-foreground">
                  SNGCE, Kadayirippu, Kolenchery
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
              <Briefcase size={18} className="text-foreground/50 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">
                  placements@sngce.ac.in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
