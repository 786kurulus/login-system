"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  dx: number;
  dy: number;
  blur: number;
}

export default function ForgotResetPassword() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [shake, setShake] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputsRef = useRef<HTMLInputElement[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Mount flag
  useEffect(() => setMounted(true), []);

  // Initialize particles
  useEffect(() => {
    const numParticles = 70;
    particlesRef.current = Array.from({ length: numParticles }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 6,
      opacity: 0.3 + Math.random() * 0.5,
      dx: (Math.random() - 0.5) * 0.03,
      dy: (Math.random() - 0.5) * 0.03,
      blur: 4 + Math.random() * 6,
    }));

    const animate = () => {
      particlesRef.current.forEach((p, idx) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = 100;
        if (p.x > 100) p.x = 0;
        if (p.y < 0) p.y = 100;
        if (p.y > 100) p.y = 0;

        const el = document.querySelectorAll(".particle")[idx] as HTMLElement;
        if (el) {
          el.style.left = `${p.x}vw`;
          el.style.top = `${p.y}vh`;
        }
      });
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // OTP verification
  useEffect(() => setOtpVerified(otp.every((d) => d !== "")), [otp]);

  // Resend cooldown
  useEffect(() => {
    if (!resendCooldown) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  // Send OTP code
  const sendCode = async () => {
    setError("");
    if (!email.trim()) {
      setError("Email is required");
      triggerShake();
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email");
      triggerShake();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to send code");
      setStep("reset");
      setResendCooldown(30);
      setError("");
      setOtpError("");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      triggerShake();
    }
    setLoading(false);
  };

  // Handle reset + auto-login
  const handleReset = async () => {
    setError("");
    setOtpError("");

    if (!otpVerified) {
      setOtpError("Please enter the 6-digit OTP");
      triggerShake();
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      triggerShake();
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      triggerShake();
      return;
    }

    if (newPassword !== repeatPassword) {
      setError("Passwords do not match");
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp.join(""), newPassword }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          setOtpError("Incorrect OTP");
          triggerShake();
          setLoading(false);
          return;
        }
        throw new Error("Reset failed");
      }

      // Auto-login
      await signIn("credentials", {
        email,
        password: newPassword,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      triggerShake();
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center px-4 overflow-hidden">

      {/* Particles */}
      {mounted &&
        particlesRef.current.map((p, i) => (
          <span
            key={i}
            className="particle absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              top: `${p.y}vh`,
              left: `${p.x}vw`,
              opacity: p.opacity,
              background: "white",
              filter: `blur(${p.blur}px)`,
              boxShadow: `0 0 ${p.blur}px rgba(255,255,255,0.7)`,
            }}
          />
        ))}

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl p-8 bg-white/20 backdrop-blur-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Kuruluş AI
        </h1>

        {step === "email" && (
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white outline-none"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={sendCode}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-purple-600 font-semibold"
            >
              Send Code
            </button>
          </div>
        )}

        {step === "reset" && (
          <div className="space-y-2">
            {/* OTP */}
            <div className={`flex justify-center gap-3 ${shake ? "animate-shake" : ""}`}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputsRef.current[i] = el! }} // ✅ Fixed TypeScript error
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={d}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    if (!v) return;
                    const next = [...otp];
                    next[i] = v[0];
                    if (v.length > 1) {
                      const paste = v.split("");
                      for (let j = i; j < 6 && paste.length > 0; j++) {
                        next[j] = paste.shift()!;
                      }
                      setOtp([...next]);
                      inputsRef.current[Math.min(i + v.length, 5)]?.focus();
                      return;
                    }
                    setOtp(next);
                    if (i < 5) inputsRef.current[i + 1]?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      if (otp[i] === "" && i > 0) {
                        inputsRef.current[i - 1]?.focus();
                      } else {
                        const next = [...otp];
                        next[i] = "";
                        setOtp(next);
                      }
                    }
                  }}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-white/20 border border-white/30 text-white outline-none"
                />
              ))}
            </div>
            {otpError && <p className="text-red-400 text-sm text-center">{otpError}</p>}

            {/* Resend code */}
            <div className="text-center">
              <button
                onClick={sendCode}
                disabled={resendCooldown > 0}
                className="text-sm text-white/70 underline disabled:opacity-50"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
              </button>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showRepeat ? "text" : "password"}
                placeholder="Repeat password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowRepeat(!showRepeat)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
              >
                {showRepeat ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-purple-600 font-semibold disabled:opacity-50"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
