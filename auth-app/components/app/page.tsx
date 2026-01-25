"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brain, Shield, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
  dx: number;
  dy: number;
  opacityRange: [number, number];
}

export default function Home() {
  const router = useRouter();
  const [showTerminal, setShowTerminal] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // Terminal hide timer
  useEffect(() => {
    const timer = setTimeout(() => setShowTerminal(false), 4200);
    return () => clearTimeout(timer);
  }, []);

  // Generate visible twinkling particles
  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.8,
      duration: 30 + Math.random() * 40,
      dx: (Math.random() - 0.5) * 5,
      dy: (Math.random() - 0.5) * 5,
      opacityRange: [0.3, 0.8] as [number, number],
    }));
    setParticles(generated);
  }, []);

  // Safe year update
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Terminal Intro */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <div className="relative font-mono text-green-400 text-sm md:text-base max-w-xl w-full px-6 overflow-hidden">
              <TerminalLine delay={0}>$ initializing kuruluş_ai...</TerminalLine>
              <TerminalLine delay={0.8}>✓ neural core loaded</TerminalLine>
              <TerminalLine delay={1.6}>✓ security layer active</TerminalLine>
              <TerminalLine delay={2.4}>✓ scalability modules online</TerminalLine>
              <TerminalLine delay={3.0}>✓ starting the system</TerminalLine>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft color blobs */}
        <motion.div
          className="absolute top-0 left-1/4 w-[40rem] h-[40rem] rounded-full bg-purple-500/30 blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 60, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-[36rem] h-[36rem] rounded-full bg-cyan-400/28 blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 50, 0] }}
          transition={{ duration: 70, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[30rem] h-[30rem] rounded-full bg-indigo-400/30 blur-3xl"
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 80, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Visible twinkling star particles */}
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white z-[1]"
            style={{
              width: p.size,
              height: p.size,
              top: `${p.y}%`,
              left: `${p.x}%`,
              boxShadow: `0 0 ${p.size * 2}px rgba(255,255,255,0.5)`,
            }}
            animate={{
              x: [`0%`, `${p.dx}%`, `0%`],
              y: [`0%`, `${p.dy}%`, `0%`],
              opacity: [p.opacityRange[0], p.opacityRange[1], p.opacityRange[0]],
            }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Header & Features */}
      <HeaderAndFeatures year={year} router={router} />
    </div>
  );
}

/* ================== Components ================== */

function TerminalLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="mb-2"
    >
      {children}
    </motion.p>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Card className="bg-black/45 border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/70">
        <CardContent className="p-8">
          <div className="text-cyan-300 mb-5">{icon}</div>
          <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">{text}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function HeaderAndFeatures({
  year,
  router,
}: {
  year: number;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <>
      <header className="relative max-w-6xl mx-auto px-6 pt-32 pb-28 text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Kuruluş{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-xl">
            AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-8 text-lg md:text-xl text-zinc-200 max-w-2xl mx-auto leading-relaxed"
        >
          A quiet intelligence. A powerful core. Kuruluş AI builds systems that feel almost alive — precise, secure, and endlessly scalable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-14 flex justify-center gap-5"
        >
          {/* ✅ Main Get Started button */}
<Button
  onClick={() => router.push("/auth")}
  className="relative rounded-full px-10 py-3 text-base bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-xl shadow-cyan-500/30 overflow-hidden"
>
  <span className="relative z-10">  Get Started  </span>
</Button>

<Button
  variant="outline"
  className="rounded-full px-10 py-3 text-base border-zinc-500 text-zinc-100 backdrop-blur bg-black/40"
>
  Discover More
</Button>

        </motion.div>
      </header>

      <section className="relative max-w-6xl mx-auto px-6 pb-32 grid md:grid-cols-3 gap-8 z-10">
        <Feature
          icon={<Brain />}
          title="Synthetic Intelligence"
          text="Reasoning systems engineered to adapt, learn, and evolve beyond static logic."
        />
        <Feature
          icon={<Shield />}
          title="Best Security"
          text="Privacy and Safety designed to meet the highest professional standards."
        />
        <Feature
          icon={<Rocket />}
          title="Limitless Scale"
          text="Architected to expand silently from prototype to planetary-level systems."
        />
      </section>

      {/* ✅ Secondary Get Started button */}
<section className="relative border-t border-white/10 z-10">
  <div className="max-w-6xl mx-auto px-6 py-28 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <Sparkles className="mx-auto mb-6 text-cyan-300" size={44} />
      <h2 className="text-3xl md:text-4xl font-semibold">
        Advancing into the next phase of innovation.
      </h2>
      <p className="mt-5 text-zinc-300 max-w-xl mx-auto leading-relaxed">
        Kuruluş AI is not just software. It is an intelligence layer for what comes next.
      </p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Button
          onClick={() => router.push("/auth")}
          className="mt-12 rounded-full px-10 py-3 text-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 shadow-xl shadow-fuchsia-500/30"
        >
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  </div>
</section>


      <footer className="relative text-center text-sm text-zinc-400 py-12 z-10">
        © {year} Kuruluş AI PVT. LTD. All rights reserved.
      </footer>
    </>
  );
}
