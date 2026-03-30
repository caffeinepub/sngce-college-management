import { Outlet } from "@tanstack/react-router";
import { ChatbotWidget } from "./ChatbotWidget";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="min-h-screen relative flex flex-col">
      <Navbar />
      <main className="pt-16 flex-1">
        <Outlet />
      </main>
      <footer className="relative z-10 py-4 px-6 mt-auto">
        <div
          className="max-w-6xl mx-auto flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "16px",
            padding: "12px 24px",
          }}
        >
          <p className="text-sm text-white/70 font-medium tracking-wide">
            Built with <span className="text-red-400">♥</span> by{" "}
            <span className="text-white font-semibold">SNGCE</span>
          </p>
        </div>
      </footer>
      <ChatbotWidget />
    </div>
  );
}
