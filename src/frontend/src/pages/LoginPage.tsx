import { useNavigate } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Info,
  LogIn,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

function getTabFromSearch(): "student" | "staff" | "admin" {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  if (tab === "staff") return "staff";
  if (tab === "admin") return "admin";
  return "student";
}

const DEMO_STUDENTS: Record<
  string,
  { password: string; name: string; dept: string }
> = {
  STU001: {
    password: "pass123",
    name: "Arjun Menon",
    dept: "Computer Science",
  },
  STU002: {
    password: "pass123",
    name: "Priya Nair",
    dept: "Electronics & Communication",
  },
  STU003: {
    password: "pass123",
    name: "Rahul Krishnan",
    dept: "Mechanical Engineering",
  },
};

const DEMO_STAFF: Record<string, { password: string; name: string }> = {
  STAFF001: { password: "pass123", name: "Dr. Rajan Pillai" },
  STAFF002: { password: "pass123", name: "Prof. Suja Thomas" },
};

const DEMO_ADMIN: Record<string, { password: string; name: string }> = {
  ADMIN001: { password: "admin123", name: "Principal Admin" },
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggedIn, role } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"student" | "staff" | "admin">(
    getTabFromSearch,
  );
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      if (role === "student") navigate({ to: "/student-dashboard" });
      else if (role === "admin") navigate({ to: "/admin-dashboard" });
      else navigate({ to: "/staff-dashboard" });
    }
  }, [isLoggedIn, role, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    if (activeTab === "student") {
      const student = DEMO_STUDENTS[id.toUpperCase()];
      if (!student || student.password !== password) {
        setError("Invalid Student ID or password.");
        setLoading(false);
        return;
      }
      login("student", student.name, id.toUpperCase());
      toast.success(`Welcome back, ${student.name}!`);
      navigate({ to: "/student-dashboard" });
    } else if (activeTab === "admin") {
      const admin = DEMO_ADMIN[id.toUpperCase()];
      if (!admin || admin.password !== password) {
        setError("Invalid Admin ID or password.");
        setLoading(false);
        return;
      }
      login("admin", admin.name);
      toast.success(`Welcome, ${admin.name}!`);
      navigate({ to: "/admin-dashboard" });
    } else {
      const staff = DEMO_STAFF[id.toUpperCase()];
      if (!staff || staff.password !== password) {
        setError("Invalid Staff ID or password.");
        setLoading(false);
        return;
      }
      login("staff", staff.name);
      toast.success(`Welcome, ${staff.name}!`);
      navigate({ to: "/staff-dashboard" });
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
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

      <div className="w-full max-w-md px-4 py-10">
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="glass-sm w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {activeTab === "student" ? (
                <GraduationCap size={24} className="text-foreground/70" />
              ) : activeTab === "admin" ? (
                <ShieldAlert size={24} className="text-foreground/70" />
              ) : (
                <ShieldCheck size={24} className="text-foreground/70" />
              )}
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Sign In
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Access your SNGCE portal
            </p>
          </div>

          <div className="glass-sm flex rounded-xl p-1 mb-6">
            {(["student", "staff", "admin"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setError("");
                  setId("");
                  setPassword("");
                }}
                data-ocid={`login.${tab}.tab`}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "student" ? (
                  <GraduationCap size={15} />
                ) : tab === "admin" ? (
                  <ShieldAlert size={15} />
                ) : (
                  <ShieldCheck size={15} />
                )}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="user-id"
                className="text-xs font-medium text-muted-foreground mb-1.5 block"
              >
                {activeTab === "student"
                  ? "Student ID"
                  : activeTab === "admin"
                    ? "Admin ID"
                    : "Staff ID"}
              </label>
              <input
                id="user-id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder={
                  activeTab === "student"
                    ? "e.g. STU001"
                    : activeTab === "admin"
                      ? "e.g. ADMIN001"
                      : "e.g. STAFF001"
                }
                data-ocid="login.id.input"
                required
                autoComplete="username"
                className="glass-sm w-full px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none rounded-xl border-0"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-xs font-medium text-muted-foreground mb-1.5 block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  data-ocid="login.password.input"
                  required
                  autoComplete="current-password"
                  className="glass-sm w-full px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none rounded-xl border-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  data-ocid="login.showpassword.toggle"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-xs text-destructive text-center"
                data-ocid="login.error_state"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !id || !password}
              data-ocid="login.submit_button"
              className="glass-btn py-3 w-full flex items-center justify-center gap-2 font-semibold text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <span
                  className="flex items-center gap-2"
                  data-ocid="login.loading_state"
                >
                  <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn size={16} /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-5 glass-sm rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-2.5">
              <Info size={13} />
              <span className="font-medium">Demo Credentials</span>
            </div>
            {activeTab === "student" ? (
              <div className="flex flex-col gap-1 text-xs">
                {Object.entries(DEMO_STUDENTS).map(([sid, s]) => (
                  <button
                    key={sid}
                    type="button"
                    onClick={() => {
                      setId(sid);
                      setPassword(s.password);
                    }}
                    className="flex items-center justify-between hover:text-foreground text-muted-foreground transition-colors group"
                  >
                    <span className="font-mono">{sid}</span>
                    <span className="text-muted-foreground/60">{s.name}</span>
                    <span className="glass-sm px-2 py-0.5 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      Use
                    </span>
                  </button>
                ))}
                <p className="text-muted-foreground/50 text-[10px] mt-1">
                  Password: pass123 for all
                </p>
              </div>
            ) : activeTab === "admin" ? (
              <div className="flex flex-col gap-1 text-xs">
                {Object.entries(DEMO_ADMIN).map(([sid, s]) => (
                  <button
                    key={sid}
                    type="button"
                    onClick={() => {
                      setId(sid);
                      setPassword(s.password);
                    }}
                    className="flex items-center justify-between hover:text-foreground text-muted-foreground transition-colors group"
                  >
                    <span className="font-mono">{sid}</span>
                    <span className="text-muted-foreground/60">{s.name}</span>
                    <span className="glass-sm px-2 py-0.5 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      Use
                    </span>
                  </button>
                ))}
                <p className="text-muted-foreground/50 text-[10px] mt-1">
                  Password: admin123
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 text-xs">
                {Object.entries(DEMO_STAFF).map(([sid, s]) => (
                  <button
                    key={sid}
                    type="button"
                    onClick={() => {
                      setId(sid);
                      setPassword(s.password);
                    }}
                    className="flex items-center justify-between hover:text-foreground text-muted-foreground transition-colors group"
                  >
                    <span className="font-mono">{sid}</span>
                    <span className="text-muted-foreground/60">{s.name}</span>
                    <span className="glass-sm px-2 py-0.5 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      Use
                    </span>
                  </button>
                ))}
                <p className="text-muted-foreground/50 text-[10px] mt-1">
                  Password: pass123 for all
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
