import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ to: "/home" });
    }, 3800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #0d0d0d 100%)",
      }}
    >
      {/* Background college image */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(60%) blur(2px)",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-8">
        {/* Welcome to */}
        <p
          className="text-white/60 text-lg font-sans tracking-widest uppercase"
          style={{
            opacity: 0,
            animation: "fadeInUp 0.8s ease 0.4s forwards",
          }}
        >
          Welcome to
        </p>

        {/* SNGCE */}
        <h1
          className="font-display font-bold text-white"
          style={{
            fontSize: "clamp(3rem, 10vw, 6rem)",
            opacity: 0,
            animation:
              "expandLetters 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.9s forwards",
          }}
        >
          SNGCE
        </h1>

        {/* Full name */}
        <p
          className="text-white/50 text-sm sm:text-base font-sans max-w-md leading-relaxed"
          style={{
            opacity: 0,
            animation: "subtitleFade 0.9s ease 2.0s forwards",
          }}
        >
          Sree Narayana Gurukulam College of Engineering
          <br />
          <span className="text-white/35 text-xs">
            Kadayirippu, Ernakulam, Kerala
          </span>
        </p>

        {/* Progress bar */}
        <div className="mt-8 w-40 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/40 rounded-full"
            style={{
              width: 0,
              animation: "progressBar 2.8s ease 0.5s forwards",
            }}
          />
        </div>
      </div>

      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "150px",
        }}
      />
    </div>
  );
}
