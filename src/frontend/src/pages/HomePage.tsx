import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Bot,
  ChevronRight,
  DollarSign,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  UserCircle,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const QUICK_CHIPS = [
  { label: "Courses", query: "What courses does SNGCE offer?" },
  { label: "Fees", query: "What is the fee structure at SNGCE?" },
  { label: "Admissions", query: "How to get admission in SNGCE?" },
  { label: "Placements", query: "What are placement opportunities at SNGCE?" },
];

const navCards = [
  {
    to: "chatbot" as const,
    icon: MessageCircle,
    label: "AI Assistant",
    desc: "Get instant answers",
    ocid: "home.chatbot.card",
    isChatbot: true,
    isHighlighted: true,
  },
  {
    to: "/courses" as const,
    icon: BookOpen,
    label: "Courses Offered",
    desc: "B.Tech, M.Tech & MBA programs",
    ocid: "home.courses.card",
  },
  {
    to: "/fees" as const,
    icon: DollarSign,
    label: "Fee Structure",
    desc: "Semester-wise fee breakdown",
    ocid: "home.fees.card",
  },
  {
    to: "/faculty" as const,
    icon: Users,
    label: "Faculty Directory",
    desc: "Meet our expert faculty",
    ocid: "home.faculty.card",
  },
  {
    to: "/login" as const,
    icon: GraduationCap,
    label: "Student Portal",
    desc: "Access your academic records",
    ocid: "home.student.card",
  },
  {
    to: "/login" as const,
    icon: ShieldCheck,
    label: "Staff Portal",
    desc: "Manage student records",
    ocid: "home.staff.card",
  },
];

const FACILITIES = [
  {
    emoji: "🏠",
    label: "Hostels",
    desc: "Separate boys & girls hostels on campus",
  },
  {
    emoji: "📚",
    label: "Library",
    desc: "15,847+ volumes, digital resources, reading room",
  },
  {
    emoji: "💻",
    label: "Computer Labs",
    desc: "11 dedicated labs incl. Data Centre, Linux Lab, CAD Lab",
  },
  {
    emoji: "🏋️",
    label: "Gymnasium",
    desc: "Modern fitness facility for students",
  },
  {
    emoji: "🍽️",
    label: "Cafeteria",
    desc: "Subsidized meals, multiple outlets",
  },
  { emoji: "🏥", label: "Medical Centre", desc: "On-campus health facility" },
  {
    emoji: "🏟️",
    label: "Auditorium",
    desc: "Large-capacity auditorium for events",
  },
  {
    emoji: "🏅",
    label: "Sports",
    desc: "Cricket, football, basketball, badminton courts; NCC unit",
  },
  { emoji: "📡", label: "Wi-Fi", desc: "Campus-wide internet connectivity" },
  {
    emoji: "🔬",
    label: "Research Labs",
    desc: "ECE: 8 labs · EEE: 10 labs · Mech: 10 labs · Civil: 5 labs · Naval: 4 labs",
  },
];

const ACCREDITATIONS = [
  {
    label: "AICTE Approved",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    label: "NBA Accredited",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    label: "KTU Affiliated",
    color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    label: "Est. 2002 by SNDP Union",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
];

function openChatbotWithMessage(message: string) {
  const openBtn = document.querySelector<HTMLButtonElement>(
    '[data-ocid="chatbot.open_modal_button"]',
  );
  if (openBtn) {
    openBtn.click();
  }
  setTimeout(() => {
    const chatInput = document.querySelector<HTMLInputElement>(
      '[data-ocid="chatbot.input"]',
    );
    if (chatInput) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      if (setter) {
        setter.call(chatInput, message);
        chatInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
      setTimeout(() => {
        const btn = document.querySelector<HTMLButtonElement>(
          '[data-ocid="chatbot.submit_button"]',
        );
        btn?.click();
      }, 80);
    }
  }, 200);
}

export function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [heroInput, setHeroInput] = useState("");
  const heroInputRef = useRef<HTMLInputElement>(null);

  const handleHeroSubmit = () => {
    const text = heroInput.trim();
    if (!text) return;
    setHeroInput("");
    openChatbotWithMessage(text);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <img
          src="https://sngce.ac.in/user/images/college1.jpg"
          alt="SNGCE College campus"
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
            background: isDark
              ? "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.40) 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.30) 100%)",
          }}
        />
      </div>

      <section className="relative pt-28 pb-10 px-4 sm:px-6 text-center">
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
            <span className="text-foreground/80">College of Engineering</span>
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

      <section className="px-4 sm:px-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-2xl px-6 sm:px-10 py-8 sm:py-10 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="glass-sm w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                <Bot size={24} className="text-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-foreground text-xl sm:text-2xl leading-tight">
                    SNGCE AI Assistant
                  </h2>
                  <span className="inline-flex items-center gap-1 glass-sm px-2 py-0.5 rounded-full text-[10px] font-medium text-muted-foreground">
                    <Sparkles size={10} />
                    Groq AI
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Ask me anything — courses, fees, admissions, faculty, or
                  navigate the portal
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <input
                ref={heroInputRef}
                type="text"
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleHeroSubmit()}
                placeholder="e.g. What B.Tech courses does SNGCE offer?"
                data-ocid="home.chatbot_hero.input"
                className="flex-1 glass-sm px-4 py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground bg-transparent outline-none rounded-xl border-none"
              />
              <button
                type="button"
                onClick={handleHeroSubmit}
                disabled={!heroInput.trim()}
                data-ocid="home.chatbot_hero.submit_button"
                className="glass-btn px-4 sm:px-5 py-3 flex items-center gap-2 text-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Send size={16} />
                <span className="hidden sm:inline">Ask now</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => openChatbotWithMessage(chip.query)}
                  className="glass-sm px-3.5 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-semibold text-lg text-foreground/70 mb-6 text-center tracking-wide uppercase text-sm">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {navCards.map((card) => {
              const Icon = card.icon;
              const CardContent = (
                <div
                  className={`glass p-5 flex flex-col gap-3 group hover:scale-[1.02] transition-transform duration-200 cursor-pointer h-full${card.isHighlighted ? " border border-foreground/20" : ""}`}
                >
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
                <Link
                  key={card.label}
                  to={card.to as "/courses" | "/fees" | "/faculty" | "/login"}
                  data-ocid={card.ocid}
                >
                  {CardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus Infrastructure Section */}
      <section
        className="px-4 sm:px-6 pb-16"
        data-ocid="home.infrastructure.section"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-1">
              Our Campus &amp; Infrastructure
            </h2>
            <p className="text-muted-foreground text-sm">
              A world-class learning environment
            </p>
          </div>

          {/* Headline stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="glass rounded-2xl p-5 text-center">
              <p className="font-display font-bold text-3xl text-foreground">
                3,000+
              </p>
              <p className="text-foreground/70 text-sm font-medium mt-0.5">
                Students Enrolled
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Across 14 academic programmes
              </p>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <p className="font-display font-bold text-3xl text-foreground">
                128
              </p>
              <p className="text-foreground/70 text-sm font-medium mt-0.5">
                Teaching Faculty
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Student-Faculty Ratio 23:1
              </p>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <p className="font-display font-bold text-3xl text-foreground">
                40 Acres
              </p>
              <p className="text-foreground/70 text-sm font-medium mt-0.5">
                Campus Area
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                165,400 sq ft constructed area
              </p>
            </div>
          </div>

          {/* Facilities grid */}
          <div className="glass rounded-2xl p-6 mb-5">
            <h3 className="font-display font-semibold text-foreground text-base mb-4">
              Facilities &amp; Infrastructure
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FACILITIES.map((facility) => (
                <div
                  key={facility.label}
                  className="glass-sm rounded-xl p-3 flex flex-col gap-1.5"
                >
                  <span className="text-xl">{facility.emoji}</span>
                  <p className="font-semibold text-foreground text-xs">
                    {facility.label}
                  </p>
                  <p className="text-muted-foreground text-[11px] leading-snug">
                    {facility.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Accreditations */}
          <div className="flex flex-wrap gap-2 justify-center">
            {ACCREDITATIONS.map((acc) => (
              <span
                key={acc.label}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${acc.color}`}
              >
                {acc.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Updated stats strip */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "3,000+", label: "Students Enrolled" },
              { value: "128", label: "Teaching Faculty" },
              { value: "40 Acres", label: "Campus Area" },
              { value: "50+", label: "Labs & Facilities" },
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
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm mb-2">
                Quick Links
              </h3>
              <div className="flex flex-col gap-1">
                {(["courses", "fees", "faculty"] as const).map((section) => (
                  <Link
                    key={section}
                    to={`/${section}` as "/courses" | "/fees" | "/faculty"}
                    className="text-muted-foreground text-xs hover:text-foreground transition-colors capitalize"
                  >
                    {section}
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
                  <MapPin size={12} /> Kadayirippu P.O, Kolenchery, Ernakulam
                  682311
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
          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()}. Built with love by SNGCE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
