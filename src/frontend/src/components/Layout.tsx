import { Outlet } from "@tanstack/react-router";
import { ChatbotWidget } from "./ChatbotWidget";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <ChatbotWidget />
    </div>
  );
}
