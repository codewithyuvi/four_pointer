import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Zap, Lock, ArrowRight, ArrowDown, Star, Users, BarChart3, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlockchainNetwork from "@/components/BlockchainNetwork";
import { getBlockHeight } from "@/lib/store";

const subtitles = [
  "Prove You Were There.",
  "Stay Anonymous.",
  "Built on Algorand.",
  "No More Proxy Attendance.",
];

const stats = [
  { emoji: "🎓", label: "Classes Tracked", value: 2847 },
  { emoji: "✅", label: "Attendances Recorded", value: 48291 },
  { emoji: "🔒", label: "Privacy Preserved", value: 100, suffix: "%" },
  { emoji: "⛓️", label: "Tampered Records", value: 0 },
];

const steps = [
  { num: "01", title: "Create Event", desc: "Instructor creates a class with location parameters" },
  { num: "02", title: "Deploy Contract", desc: "Smart contract deployed on Algorand Testnet" },
  { num: "03", title: "Generate QR", desc: "Unique event QR code is generated for check-in" },
  { num: "04", title: "Student Scans", desc: "Scan QR or enter Event ID to begin verification" },
  { num: "05", title: "Verify Location", desc: "Geolocation confirms you're within range" },
  { num: "06", title: "Proof On-Chain", desc: "Anonymous proof recorded as Algorand transaction" },
];

const bentoFeatures = [
  { icon: Shield, title: "Privacy-First", desc: "Your identity is never stored on-chain. Only anonymized proof hashes.", large: true, gradient: "from-primary/20 to-secondary/10" },
  { icon: Lock, title: "Tamper-Proof", desc: "Blockchain-backed records that cannot be altered.", large: false, gradient: "from-secondary/20 to-coral/10" },
  { icon: Zap, title: "Instant Verification", desc: "Attendance confirmed in seconds.", large: false, gradient: "from-primary/20 to-neon-green/10" },
  { icon: Fingerprint, title: "Anti-Proxy", desc: "Location + wallet verification prevents proxy attendance.", large: true, gradient: "from-coral/20 to-neon-yellow/10" },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Track attendance patterns and generate reports.", large: false, gradient: "from-neon-yellow/20 to-primary/10" },
  { icon: Users, title: "Algorand Powered", desc: "Built on a carbon-negative L1 blockchain.", large: false, gradient: "from-primary/20 to-secondary/10" },
];

const testimonials = [
  { name: "Alex Rivera", role: "CS Student", institution: "MIT", text: "VAttend made attendance effortless. I love that my privacy is protected.", stars: 5, initials: "AR" },
  { name: "Prof. Chen", role: "Instructor", institution: "Stanford", text: "No more fake attendance. The analytics dashboard is incredibly useful.", stars: 5, initials: "PC" },
  { name: "Jordan Lee", role: "Engineering Student", institution: "Berkeley", text: "The blockchain verification gives me confidence that my records are permanent.", stars: 5, initials: "JL" },
  { name: "Dr. Patel", role: "Department Head", institution: "Georgia Tech", text: "We deployed VAttend across 15 courses. The results have been outstanding.", stars: 5, initials: "DP" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [isInView, target]);

  return <span ref={ref} className="font-stat text-4xl sm:text-5xl counter-glow">{count.toLocaleString()}{suffix}</span>;
}

function TypewriterEffect() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = subtitles[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.substring(0, text.length + 1));
        if (text.length === current.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setText(current.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setCurrentIndex((currentIndex + 1) % subtitles.length);
        }
      }
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, currentIndex]);

  return (
    <span className="gradient-text">
      {text}
      <span className="inline-block w-0.5 h-8 sm:h-10 bg-primary ml-1 align-middle" style={{ animation: 'typewriter-cursor 1s step-end infinite' }} />
    </span>
  );
}

export default function LandingPage() {
  const [blockHeight, setBlockHeight] = useState(getBlockHeight());

  useEffect(() => {
    const interval = setInterval(() => setBlockHeight(getBlockHeight()), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-16 noise-overlay">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <BlockchainNetwork />
        <div className="animated-grid-bg absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-24 sm:py-36 text-center z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-full mb-8 glow-pulse"
              style={{ background: 'linear-gradient(135deg, rgba(0,255,209,0.15), rgba(191,90,242,0.15))', border: '1px solid rgba(0,255,209,0.2)' }}
            >
              🏆 RIFT 2026 Hackathon · Algorand Track
            </motion.span>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold leading-[0.95] mb-6">
              <span className="block">VAttend</span>
            </h1>

            <div className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold mb-8 h-14 sm:h-16">
              <TypewriterEffect />
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body">
              A privacy-preserving attendance tracker powered by Algorand. No personal data on-chain — just cryptographic proof you were there.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/check-in">
                <Button size="lg" className="btn-primary-glow text-base px-8 rounded-full h-14 text-lg">
                  Student Portal <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/instructor">
                <Button size="lg" variant="outline" className="text-base px-8 border-glass-border hover:bg-muted rounded-full h-14 text-lg hover:border-primary/30">
                  Instructor Portal <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16"
          >
            <ArrowDown className="h-5 w-5 text-muted-foreground mx-auto animate-bounce" />
            <p className="text-xs text-muted-foreground mt-2">Scroll to explore</p>
          </motion.div>
        </div>

        {/* Morphing blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-[100px] animate-float" style={{ background: 'rgba(0,255,209,0.08)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[120px] animate-float" style={{ background: 'rgba(191,90,242,0.06)', animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]" style={{ background: 'rgba(255,107,107,0.03)' }} />
      </section>

      {/* Stats */}
      <section className="relative py-16 border-y border-border/30" style={{ background: 'rgba(15,16,35,0.5)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="text-2xl mb-2 block">{s.emoji}</span>
                <AnimatedCounter target={s.value} suffix={s.suffix} />
                <p className="text-xs text-muted-foreground mt-1 font-heading">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4">How It <span className="gradient-text">Works</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-body">
            Blockchain-verified attendance in six seamless steps.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bento-card p-6 group"
            >
              <span className="font-stat text-3xl gradient-text">{s.num}</span>
              <h3 className="font-heading font-bold text-lg mt-2 mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why AttendX - Bento Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4">Why <span className="gradient-text-warm">VAttend</span></h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">
          {bentoFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`bento-card card-3d p-6 flex flex-col justify-between overflow-hidden relative ${
                f.large ? "sm:col-span-2" : ""
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-30`} />
              <div className="relative z-10">
                <f.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-heading font-bold text-lg">{f.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground relative z-10">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 px-4"
        >
          <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4">Loved by <span className="gradient-text-purple">Everyone</span></h2>
        </motion.div>

        <div className="flex gap-4 px-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 min-w-[300px] max-w-[340px] snap-center shrink-0 card-3d"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-neon-yellow text-neon-yellow" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-xs" style={{ background: 'linear-gradient(135deg, #00FFD1, #BF5AF2)' }}>
                  <span className="text-black">{t.initials}</span>
                </div>
                <div>
                  <p className="font-heading font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role} · {t.institution}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card-glow p-10 sm:p-14 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-display font-bold mb-4">
              Ready to go <span className="gradient-text">on-chain</span>?
            </h2>
            <p className="text-muted-foreground mb-8 font-body">
              Join the future of verifiable, privacy-preserving attendance tracking.
            </p>
            <Link to="/about">
              <Button size="lg" className="btn-primary-glow rounded-full h-14 text-lg px-8">
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center font-display text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, #00FFD1, #BF5AF2)' }}>
              <span className="text-black">AX</span>
            </div>
            <span className="font-display font-bold text-foreground">VAttend</span>
          </div>
          <span>Built with ❤️ for RIFT 2026 · Algorand Testnet</span>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            Block #{blockHeight.toLocaleString()}
          </div>
        </div>
      </footer>
    </div>
  );
}
