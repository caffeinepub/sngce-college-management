import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, FileText, Lock, ShieldAlert, Unlock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import type { ClassifiedItem } from "./AdminDashboard";

const CLASSIFIED_KEY = "sngce_classified";

function loadItems(): ClassifiedItem[] {
  try {
    const raw = localStorage.getItem(CLASSIFIED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  "Internal Circular": "text-blue-400",
  "Exam Paper": "text-amber-400",
  "Confidential Notice": "text-red-400",
  "Staff Document": "text-green-400",
  "Administrative Order": "text-purple-400",
  "Financial Report": "text-cyan-400",
};

export function ClassifiedPage() {
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [items] = useState<ClassifiedItem[]>(loadItems);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [passwordInputs, setPasswordInputs] = useState<Record<string, string>>(
    {},
  );
  const [showPassIds, setShowPassIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoggedIn || (role !== "staff" && role !== "admin")) {
      navigate({ to: "/login" });
    }
  }, [isLoggedIn, role, navigate]);

  if (!isLoggedIn || (role !== "staff" && role !== "admin")) return null;

  const handleUnlock = (item: ClassifiedItem) => {
    const entered = (passwordInputs[item.id] ?? "").trim();
    if (entered === item.uniquePassword) {
      setUnlockedIds((prev) => {
        const next = new Set(prev);
        next.add(item.id);
        return next;
      });
      setErrorIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      toast.success("Document unlocked.");
    } else {
      setErrorIds((prev) => {
        const next = new Set(prev);
        next.add(item.id);
        return next;
      });
      toast.error("Incorrect password. Try again.");
    }
  };

  const handleLock = (id: string) => {
    setUnlockedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setPasswordInputs((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setErrorIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleShowPass = (id: string) => {
    setShowPassIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/assets/uploads/college1-3-1.jpg"
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="glass rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="glass-sm w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldAlert size={20} className="text-foreground/70" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              Classified Information
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter the unique password to unlock each document
            </p>
          </div>
          <div className="ml-auto">
            <div className="glass-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock size={12} />
              <span>{items.length} documents</span>
            </div>
          </div>
        </div>

        {/* Info notice */}
        <div className="glass-sm rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
          <Lock size={14} className="text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            These documents are classified. Each requires a unique password set
            exclusively by the{" "}
            <strong className="text-foreground/80">Admin</strong>. Staff members
            can only <em>unlock</em> documents using the password provided by
            the Admin — staff cannot set, change, or reset any document
            passwords.
          </p>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div
            className="glass rounded-2xl p-12 flex flex-col items-center gap-3 text-center"
            data-ocid="classified.empty_state"
          >
            <div className="glass-sm w-14 h-14 rounded-2xl flex items-center justify-center">
              <FileText size={24} className="text-foreground/30" />
            </div>
            <p className="text-foreground text-sm font-medium">
              No classified documents available.
            </p>
            <p className="text-muted-foreground/60 text-xs">
              Contact admin to add classified documents.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4" data-ocid="classified.list">
            {items.map((item, idx) => {
              const isUnlocked = unlockedIds.has(item.id);
              const isError = errorIds.has(item.id);
              const showPass = showPassIds.has(item.id);
              const colorClass =
                CATEGORY_COLORS[item.category] ?? "text-muted-foreground";

              return (
                <div
                  key={item.id}
                  className="glass rounded-2xl overflow-hidden"
                  data-ocid={`classified.item.${idx + 1}`}
                >
                  {/* Item header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-foreground text-sm">
                            {item.title}
                          </h3>
                          <span
                            className={`glass-sm px-2 py-0.5 rounded-full text-[10px] font-medium ${colorClass}`}
                          >
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/60">
                          {item.createdAt}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {isUnlocked ? (
                          <div className="flex items-center gap-1 glass-sm px-2.5 py-1 rounded-xl">
                            <Unlock size={12} className="text-green-400" />
                            <span className="text-[10px] text-green-400 font-medium">
                              Unlocked
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 glass-sm px-2.5 py-1 rounded-xl">
                            <Lock size={12} className="text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground font-medium">
                              Locked
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Unlocked content */}
                  {isUnlocked && (
                    <div className="px-5 pb-4">
                      <div className="glass-sm rounded-xl p-4 mb-3">
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLock(item.id)}
                        data-ocid={`classified.lock.button.${idx + 1}`}
                        className="glass-btn px-4 py-2 flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        <Lock size={13} />
                        Lock Document
                      </button>
                    </div>
                  )}

                  {/* Password input when locked */}
                  {!isUnlocked && (
                    <div className="px-5 pb-5">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type={showPass ? "text" : "password"}
                            value={passwordInputs[item.id] ?? ""}
                            onChange={(e) =>
                              setPasswordInputs((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleUnlock(item)
                            }
                            placeholder="Enter unique password to unlock"
                            data-ocid={`classified.password.input.${idx + 1}`}
                            className={`glass-sm w-full px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none rounded-xl border-0 focus:ring-1 ${
                              isError
                                ? "ring-1 ring-destructive/50 focus:ring-destructive"
                                : "focus:ring-foreground/20"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => toggleShowPass(item.id)}
                            data-ocid={`classified.showpassword.toggle.${idx + 1}`}
                            tabIndex={-1}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPass ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUnlock(item)}
                          data-ocid={`classified.unlock.button.${idx + 1}`}
                          className="glass-btn px-4 py-2 flex items-center gap-2 text-sm font-medium text-foreground shrink-0"
                        >
                          <Unlock size={14} />
                          Unlock
                        </button>
                      </div>
                      {isError && (
                        <p
                          className="text-xs text-destructive mt-1.5"
                          data-ocid={`classified.password.error_state.${idx + 1}`}
                        >
                          Incorrect password. Please try again.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
