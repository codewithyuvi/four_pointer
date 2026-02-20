import { motion } from "framer-motion";
import { BookOpen, QrCode, MapPin, Lock, FileCheck, Award, Users, Code, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  { icon: BookOpen, title: "Instructor Creates Event", desc: "Smart contract deployed on Algorand Testnet with event parameters.", color: "text-primary" },
  { icon: QrCode, title: "Student Scans QR Code", desc: "Unique QR code links to the event — or enter the Event ID manually.", color: "text-primary" },
  { icon: MapPin, title: "Geolocation Verified", desc: "Student's location is checked to ensure they're within radius of the event.", color: "text-secondary" },
  { icon: Lock, title: "Proof Hash Generated", desc: "Student's wallet address is hashed into an anonymous, unlinkable proof.", color: "text-secondary" },
  { icon: FileCheck, title: "On-Chain Transaction", desc: "Proof recorded as an Algorand Application Call — immutable and verifiable.", color: "text-primary" },
  { icon: Award, title: "Verifiable Record", desc: "Student receives a tamper-proof attendance record viewable on Testnet.", color: "text-primary" },
];

const techStack = [
  { name: "Algorand", desc: "Layer-1 blockchain" },
  { name: "AlgoKit", desc: "Development toolkit" },
  { name: "React", desc: "Frontend framework" },
  { name: "TypeScript", desc: "Type safety" },
  { name: "Tailwind CSS", desc: "Styling" },
  { name: "Recharts", desc: "Analytics" },
  { name: "Framer Motion", desc: "Animations" },
];

const privacyFaq = [
  { q: "What is a privacy-preserving proof?", a: "A cryptographic hash that proves you attended without revealing your identity. Only the hash, timestamp, and App ID are stored on-chain." },
  { q: "How does hashing protect identity?", a: "Your wallet address is run through a one-way hash function. The output cannot be reversed to find your original address." },
  { q: "Can attendance be faked?", a: "No. Geolocation verification, wallet authentication, and on-chain immutability prevent proxy attendance and forgery." },
  { q: "Who can see what data?", a: "Only you can link your proof hash to your identity. Instructors see anonymous proofs. No personal data is ever stored on-chain." },
];

const contractCode = `# VAttend Smart Contract (PyTEAL)
from pyteal import *

def approval_program():
    # Record attendance proof on-chain
    on_attend = Seq([
        Assert(Txn.application_args.length() == Int(2)),
        App.globalPut(
            Txn.application_args[0],  # proof_hash
            Global.latest_timestamp()
        ),
        App.globalPut(
            Bytes("total_proofs"),
            App.globalGet(Bytes("total_proofs")) + Int(1)
        ),
        Approve()
    ])
    
    return Cond(
        [Txn.application_id() == Int(0), Approve()],
        [Txn.on_completion() == OnComplete.NoOp, on_attend],
    )`;

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 noise-overlay">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">How <span className="gradient-text">VAttend</span> Works</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A step-by-step breakdown of privacy-preserving attendance verification on the Algorand blockchain.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mb-20">
          <div className="absolute left-6 top-0 bottom-0 w-px hidden sm:block" style={{ background: 'linear-gradient(180deg, #00FFD1, #BF5AF2, rgba(0,255,209,0.1))' }} />
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 sm:gap-6"
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-glass-border">
                    <step.icon className={`h-5 w-5 ${step.color}`} />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-stat font-bold flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00FFD1, #BF5AF2)', color: '#080810' }}>
                    {i + 1}
                  </span>
                </div>
                <div className="bento-card p-5 flex-1">
                  <h3 className="font-heading font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card-glow p-8 mb-12">
          <h2 className="font-display font-bold text-2xl mb-6 text-center">Architecture Overview</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { icon: Users, label: "Frontend", desc: "React + Tailwind CSS", color: "text-primary" },
              { icon: Code, label: "Smart Contracts", desc: "PyTEAL / AlgoPy", color: "text-secondary" },
              { icon: Globe, label: "Network", desc: "Algorand Testnet", color: "text-primary" },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl bg-muted/30 border border-glass-border card-3d">
                <item.icon className={`h-6 w-6 ${item.color} mx-auto mb-2`} />
                <p className="font-heading text-sm font-bold">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Smart Contract Preview */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6 mb-12">
          <h2 className="font-display font-bold text-xl mb-4">📝 Smart Contract Preview</h2>
          <pre className="bg-muted/50 rounded-xl p-4 overflow-x-auto text-xs font-mono text-muted-foreground leading-relaxed">
            <code>{contractCode}</code>
          </pre>
          <p className="text-xs text-muted-foreground mt-3 italic">* Simplified for demonstration. Full contract available on GitHub.</p>
        </motion.div>

        {/* Privacy FAQ */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <h2 className="font-display font-bold text-2xl mb-6 text-center">🔒 Privacy Deep Dive</h2>
          <div className="space-y-3">
            {privacyFaq.map(item => (
              <div key={item.q} className="bento-card p-5">
                <h4 className="font-heading font-bold text-sm mb-2">{item.q}</h4>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <h2 className="font-display font-bold text-2xl mb-4 text-center">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map(t => (
              <div key={t.name} className="group relative">
                <span className="px-4 py-2 rounded-full bg-muted border border-glass-border text-sm font-heading animate-float inline-block" style={{ animationDelay: `${Math.random() * 2}s` }}>
                  {t.name}
                </span>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-card border border-glass-border text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {t.desc}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* README */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 mb-12">
          <h2 className="font-display font-bold text-2xl mb-4">📋 Project README</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-heading font-bold text-foreground">VAttend — Privacy-Preserving Attendance Tracker</h4>
              <p>Built for the RIFT 2026 Hackathon on the Algorand blockchain.</p>
            </div>
            <div>
              <h4 className="font-heading font-bold text-foreground">Problem Statement</h4>
              <p>Traditional attendance systems expose student identity and are vulnerable to fraud. VAttend uses zero-knowledge-inspired hashing and on-chain verification to solve both problems.</p>
            </div>
            <div>
              <h4 className="font-heading font-bold text-foreground">App ID (Testnet)</h4>
              <p className="font-mono text-primary">4821937 · 7293104 · 5610283</p>
            </div>
            <div>
              <h4 className="font-heading font-bold text-foreground">Team</h4>
              <p>Built with ❤️ by the VAttend Team</p>
            </div>
          </div>
        </motion.div>

        <div className="text-center">
          <Link to="/check-in">
            <Button size="lg" className="btn-primary-glow rounded-full h-14 text-lg px-8">Try VAttend Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
