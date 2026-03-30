import { Outlet } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useState } from "react";
import { ChatbotWidget } from "./ChatbotWidget";
import { Navbar } from "./Navbar";

export function Layout() {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const { downloadSourceCodeZip } = await import(
        "../utils/downloadSourceCode"
      );
      await downloadSourceCodeZip();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      <Navbar />
      <main className="pt-16 flex-1">
        <Outlet />
      </main>
      <footer className="relative z-10 py-4 px-6 mt-auto">
        <div
          className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3"
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

          <button
            type="button"
            data-ocid="footer.download_button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 text-xs font-medium text-white/80 hover:text-white transition-all duration-200 px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            {downloading ? "Preparing ZIP..." : "Download Source Code (ZIP)"}
          </button>
        </div>
      </footer>
      <ChatbotWidget />
    </div>
  );
}
