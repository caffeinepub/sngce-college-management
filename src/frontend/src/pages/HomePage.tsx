import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  DollarSign,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserCircle,
  Users,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const navCards = [
  {
    to: "/courses",
    icon: BookOpen,
    label: "Courses Offered",
    desc: "B.Tech, M.Tech & MBA programs",
    ocid: "home.courses.card",
  },
  {
    to: "/fees",
    icon: DollarSign,
    label: "Fee Structure",
    desc: "Semester-wise fee breakdown",
    ocid: "home.fees.card",
  },
  {
    to: "/faculty",
    icon: Users,
    label: "Faculty Directory",
    desc: "Meet our expert faculty",
    ocid: "home.faculty.card",
  },
  {
    to: "/login?tab=student",
    icon: GraduationCap,
    label: "Student Portal",
    desc: "Access your academic records",
    ocid: "home.student.card",
  },
  {
    to: "/login?tab=staff",
    icon: ShieldCheck,
    label: "Staff Portal",
    desc: "Manage student records",
    ocid: "home.staff.card",
  },
  {
    to: "#chatbot",
    icon: MessageCircle,
    label: "AI Assistant",
    desc: "Get instant answers",
    ocid: "home.chatbot.card",
    isChatbot: true,
  },
];

export function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80"
          alt="College campus"
          className="w-full h-full object-cover"
          style={{
            filter: isDark
              ? "grayscale(40%) brightness(0.35)"
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

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-sm px-4 py-1.5 rounded-full text-xs font-medium text-muted-foreground mb-6">
            <MapPin size={12} />
            Kadayirippu, Kolenchery, Ernakulam, Kerala
          </div>
          <h1
            className="font-display font-bold text-foreground leading-tight mb-4 text-shadow"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}
          >
            Sree Narayana Gurukulam
            <br />
            <span className="text-foreground/70">College of Engineering</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Empowering future engineers with excellence in education,
            innovation, and research since 2002.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/courses"
              data-ocid="home.explore.primary_button"
              className="glass-btn px-6 py-3 flex items-center gap-2 font-medium text-foreground"
            >
              Explore Courses
              <ChevronRight size={16} />
            </Link>
            <Link
              to="/login"
              data-ocid="home.login.secondary_button"
              className="glass-pill px-6 py-3 flex items-center gap-2 font-medium text-foreground"
            >
              <UserCircle size={16} />
              Student Login
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Nav Cards */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-semibold text-lg text-foreground/70 mb-6 text-center tracking-wide uppercase text-sm">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {navCards.map((card) => {
              const Icon = card.icon;
              const CardContent = (
                <div className="glass p-5 flex flex-col gap-3 group hover:scale-[1.02] transition-transform duration-200 cursor-pointer h-full">
                  <div className="glass-sm w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                    <Icon size={20} className="text-foreground/70" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm leading-snug">
                      {card.label}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-muted-foreground mt-auto self-end group-hover:translate-x-1 transition-transform"
                  />
                </div>
              );

              if (card.isChatbot) {
                return (
                  <button
                    type="button"
                    key={card.label}
                    data-ocid={card.ocid}
                    onClick={() => {
                      const btn = document.querySelector<HTMLButtonElement>(
                        '[data-ocid="chatbot.open_modal_button"]',
                      );
                      btn?.click();
                    }}
                    className="text-left"
                  >
                    {CardContent}
                  </button>
                );
              }
              return (
                <Link key={card.label} to={card.to} data-ocid={card.ocid}>
                  {CardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "23+", label: "Years of Excellence" },
              { value: "3000+", label: "Students Enrolled" },
              { value: "150+", label: "Faculty Members" },
              { value: "10", label: "Departments" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display font-bold text-3xl text-foreground">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="font-display font-bold text-foreground mb-2">
                SNGCE
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Sree Narayana Gurukulam College of Engineering, Kadayirippu,
                Kolenchery, Ernakulam — established 2002. Approved by AICTE,
                affiliated to APJ Abdul Kalam Technological University (KTU).
                Managed by Sree Narayana Gurukulam Charitable Trust.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm mb-2">
                Quick Links
              </h3>
              <div className="flex flex-col gap-1">
                {["/courses", "/fees", "/faculty"].map((to) => (
                  <Link
                    key={to}
                    to={to}
                    className="text-muted-foreground text-xs hover:text-foreground transition-colors capitalize"
                  >
                    {to.replace("/", "")}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm mb-2">
                Contact
              </h3>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <MapPin size={12} /> Kadayirippu P.O, Kolenchery, Ernakulam,
                  Kerala 682311
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <Phone size={12} /> 0484-2597800 (30 Lines)
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <Mail size={12} /> info@sngce.ac.in
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 text-center text-muted-foreground text-xs">
            © {new Date().getFullYear()}. Built with love by SNGCE
          </div>
        </div>
      </footer>
    </div>
  );
}
