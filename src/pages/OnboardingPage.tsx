import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Shield, Zap, Lock, BarChart3 } from "lucide-react";

export default function OnboardingPage() {
  const [hovered, setHovered] = useState<"student" | "instructor" | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16 flex flex-col noise-overlay">
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-20 items-center">
          <div className="w-px h-full" style={{ background: 'linear-gradient(180deg, transparent, #00FFD1, #BF5AF2, transparent)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-lg" style={{ background: 'linear-gradient(135deg, #00FFD1, #BF5AF2)', color: '#080810' }}>
              AX
            </div>
          </div>
        </div>

        <motion.div
          className="flex-1 flex items-center justify-center p-8 cursor-pointer relative overflow-hidden"
          animate={{ flex: hovered === "instructor" ? 0.4 : hovered === "student" ? 0.65 : 0.5 }}
          transition={{ duration: 0.4 }}
          onMouseEnter={() => setHovered("student")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => navigate("/check-in")}
        >
          <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg, #00FFD1, #BF5AF2)' }} />
          <div className="relative z-10 text-center max-w-sm">
            <motion.div animate={{ scale: hovered === "student" ? 1.1 : 1 }} transition={{ duration: 0.3 }}>
              <GraduationCap className="h-16 w-16 text-primary mx-auto mb-6" />
            </motion.div>
            <h2 className="font-display text-3xl font-bold mb-3">I'm a Student</h2>
            <p className="text-muted-foreground mb-6">Check in to classes, build your attendance record, and earn badges.</p>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: hovered === "student" ? 1 : 0, height: hovered === "student" ? "auto" : 0 }}
              className="space-y-2 overflow-hidden"
            >
              {[
                { icon: Zap, text: "Instant QR check-in" },
                { icon: Shield, text: "Privacy-preserving proofs" },
                { icon: Lock, text: "Tamper-proof records" },
              ].map(f => (
                <div key={f.text} className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                  <f.icon className="h-4 w-4 text-primary" /> {f.text}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div className="md:hidden h-px" style={{ background: 'linear-gradient(90deg, transparent, #00FFD1, #BF5AF2, transparent)' }} />

        <motion.div
          className="flex-1 flex items-center justify-center p-8 cursor-pointer relative overflow-hidden"
          animate={{ flex: hovered === "student" ? 0.4 : hovered === "instructor" ? 0.65 : 0.5 }}
          transition={{ duration: 0.4 }}
          onMouseEnter={() => setHovered("instructor")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => navigate("/instructor")}
        >
          <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg, #FF6B6B, #FFE600)' }} />
          <div className="relative z-10 text-center max-w-sm">
            <motion.div animate={{ scale: hovered === "instructor" ? 1.1 : 1 }} transition={{ duration: 0.3 }}>
              <BookOpen className="h-16 w-16 text-coral mx-auto mb-6" />
            </motion.div>
            <h2 className="font-display text-3xl font-bold mb-3">I'm an Instructor</h2>
            <p className="text-muted-foreground mb-6">Create events, generate QR codes, and track attendance analytics.</p>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: hovered === "instructor" ? 1 : 0, height: hovered === "instructor" ? "auto" : 0 }}
              className="space-y-2 overflow-hidden"
            >
              {[
                { icon: Zap, text: "One-click event creation" },
                { icon: BarChart3, text: "Real-time analytics" },
                { icon: Shield, text: "Smart contract deployment" },
              ].map(f => (
                <div key={f.text} className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                  <f.icon className="h-4 w-4 text-coral" /> {f.text}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="text-center py-4 text-xs text-muted-foreground">
        <Shield className="h-3 w-3 inline mr-1" /> Your personal identity is never stored on-chain
      </div>
    </div>
  );
}
