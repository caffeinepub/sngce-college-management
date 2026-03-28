import { useNavigate } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  FileText,
  Lock,
  Plus,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const CLASSIFIED_KEY = "sngce_classified";

const CATEGORIES = [
  "Internal Circular",
  "Exam Paper",
  "Confidential Notice",
  "Staff Document",
  "Administrative Order",
  "Financial Report",
];

export interface ClassifiedItem {
  id: string;
  title: string;
  category: string;
  content: string;
  uniquePassword: string;
  createdAt: string;
}

function loadItems(): ClassifiedItem[] {
  try {
    const raw = localStorage.getItem(CLASSIFIED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveItems(items: ClassifiedItem[]) {
  localStorage.setItem(CLASSIFIED_KEY, JSON.stringify(items));
}

export function AdminDashboard() {
  const { isLoggedIn, role, userName } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [items, setItems] = useState<ClassifiedItem[]>(loadItems);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [uniquePassword, setUniquePassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoggedIn || role !== "admin") {
      navigate({ to: "/login" });
    }
  }, [isLoggedIn, role, navigate]);

  if (!isLoggedIn || role !== "admin") return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !uniquePassword.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    const newItem: ClassifiedItem = {
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
    const updated = [newItem, ...items];
    setItems(updated);
    saveItems(updated);
    setTitle("");
    setCategory(CATEGORIES[0]);
    setContent("");
    setUniquePassword("");
    toast.success("Classified item added successfully.");
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveItems(updated);
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

  const inputClass =
    "glass-sm w-full px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none rounded-xl border-0 focus:ring-1 focus:ring-foreground/20";

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="glass rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="glass-sm w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldAlert size={20} className="text-foreground/70" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              {userName}
            </h1>
            <p className="text-muted-foreground text-sm">
              Admin Dashboard · Classified Information Manager
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="glass-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock size={12} />
              <span>{items.length} classified items</span>
            </div>
          </div>
        </div>

        {/* Add New Item Form */}
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
                <span className="text-muted-foreground/60">
                  (Admin-only — staff cannot set or change this)
                </span>
              </label>
              <div className="relative">
                <input
                  id="classified-password"
                  type={showNewPass ? "text" : "password"}
                  value={uniquePassword}
                  onChange={(e) => setUniquePassword(e.target.value)}
                  placeholder="Set a unique password for this document"
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

        {/* Classified Documents List */}
        <div>
          <h2 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2 px-1">
            <FileText size={15} className="text-foreground/70" />
            Classified Documents
          </h2>

          {items.length === 0 ? (
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
              <p className="text-muted-foreground/60 text-xs">
                Add your first item using the form above.
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
                        aria-label="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Content preview */}
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {item.content}
                    </p>

                    {/* Password reveal */}
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
                        aria-label={
                          isRevealed ? "Hide password" : "Show password"
                        }
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
      </div>
    </div>
  );
}
