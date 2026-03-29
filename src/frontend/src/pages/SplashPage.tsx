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
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://sngce.ac.in/user/images/college1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.45) saturate(0.7)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.40)" }}
      />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-8">
        <p
          className="text-white/60 text-lg font-sans tracking-widest uppercase"
          style={{ opacity: 0, animation: "fadeInUp 0.8s ease 0.4s forwards" }}
        >
          Welcome to
        </p>
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
    </div>
  );
}
