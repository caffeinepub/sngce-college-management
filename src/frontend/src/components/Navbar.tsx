import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, Menu, Moon, Sun, User, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, role, userName, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/fees", label: "Fees" },
    { to: "/faculty", label: "Faculty" },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glass-sm mx-3 mt-3 px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/home"
          data-ocid="nav.home.link"
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
            <span className="font-display font-bold text-xs text-foreground">
              SG
            </span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            SNGCE
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={`nav.${link.label.toLowerCase()}.link`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive(link.to)
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            data-ocid="nav.theme.toggle"
            className="glass-btn p-2 text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                to={
                  role === "student" ? "/student-dashboard" : "/staff-dashboard"
                }
                data-ocid="nav.dashboard.link"
                className="glass-btn px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground"
              >
                <User size={14} />
                <span className="hidden sm:inline">{userName}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                data-ocid="nav.logout.button"
                className="glass-btn p-2 text-muted-foreground hover:text-destructive"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              data-ocid="nav.login.link"
              className="glass-btn px-4 py-2 text-sm font-medium text-foreground"
            >
              Login
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            data-ocid="nav.menu.toggle"
            className="md:hidden glass-btn p-2 text-muted-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass mx-3 mt-1 px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              data-ocid={`nav.mobile.${link.label.toLowerCase()}.link`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(link.to)
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
