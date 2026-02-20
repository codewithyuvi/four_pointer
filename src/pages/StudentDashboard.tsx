import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ExternalLink, Flame, CheckCircle2, Calendar, Trophy, Copy, Filter } from "lucide-react";
import { getAttendanceRecords, getBadges, type AttendanceRecord, type Badge } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    setRecords(getAttendanceRecords());
    setBadges(getBadges());
  }, []);

  const streak = Math.min(records.length, 7);
  const attendanceScore = Math.min(100, Math.round((records.length / 10) * 100));
  const filteredRecords = filter === "all" ? records : records.filter(r => r.courseCode === filter);
  const courses = [...new Set(records.map(r => r.courseCode).filter(Boolean))];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 noise-overlay">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-glow p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00FFD1, #BF5AF2)' }}>
                <div className="w-[72px] h-[72px] rounded-full bg-card flex items-center justify-center">
                  <span className="font-display font-bold text-2xl">S</span>
                </div>
              </div>
              <div className="absolute -inset-2 rounded-full border border-primary/20 pulse-ring" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h1 className="text-2xl font-display font-bold">Student Dashboard</h1>
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Your identity is never stored on-chain</p>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(234 30% 14%)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="36" fill="none" stroke="url(#gauge-grad)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${attendanceScore * 2.26} 226`} />
                  <defs><linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#00FFD1" /><stop offset="1" stopColor="#BF5AF2" /></linearGradient></defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-stat text-2xl counter-glow">{attendanceScore}%</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Score</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <CheckCircle2 className="h-6 w-6 text-primary" />, label: "Total Verified", value: records.length },
            { icon: <Flame className="h-6 w-6 text-coral" />, label: "Day Streak", value: streak },
            { icon: <Calendar className="h-6 w-6 text-secondary" />, label: "Courses", value: courses.length },
            { icon: <Trophy className="h-6 w-6 text-neon-yellow" />, label: "Badges Earned", value: badges.filter(b => b.unlocked).length },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bento-card p-5 text-center">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className="font-stat text-3xl counter-glow">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <div className="glass-card p-6 mb-8">
          <h3 className="font-display font-bold text-lg mb-4">Achievement Badges</h3>
          <div className="flex flex-wrap gap-3">
            {badges.map(b => (
              <motion.div
                key={b.id}
                whileHover={{ scale: 1.1 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
                  b.unlocked
                    ? "border-primary/30 bg-primary/10"
                    : "border-glass-border bg-muted/30 opacity-40 grayscale"
                }`}
              >
                <span className="text-lg">{b.emoji}</span>
                <span className="text-xs font-heading font-bold">{b.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Privacy Audit */}
        <div className="glass-card p-6 mb-8">
          <h3 className="font-display font-bold text-lg mb-4">🛡️ Privacy Audit</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-heading font-bold text-neon-green mb-2">✓ Stored On-Chain</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                {["Proof Hash", "Timestamp", "App ID", "Block Number"].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-heading font-bold text-coral mb-2">✗ Never Stored</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                {["Your Name", "Email Address", "Student ID", "Face / Biometrics", "Raw Location"].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral" />
                    <span className="line-through">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Records */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Attendance History</h3>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="bg-muted border border-glass-border rounded-lg px-3 py-1.5 text-xs font-heading"
              >
                <option value="all">All Courses</option>
                {courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {filteredRecords.length === 0 && (
            <div className="glass-card p-8 text-center text-muted-foreground">
              No attendance records yet. Check in to an event to get started.
            </div>
          )}

          {filteredRecords.map((r, i) => (
            <motion.div
              key={r.txnId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bento-card p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-heading font-bold truncate">{r.eventName}</h4>
                    {r.courseCode && <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-bold">{r.courseCode}</span>}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      r.status === 'verified' ? 'bg-neon-green/20 text-neon-green' :
                      r.status === 'pending' ? 'bg-neon-yellow/20 text-neon-yellow' : 'bg-coral/20 text-coral'
                    }`}>
                      {r.status === 'verified' ? 'Verified ✅' : r.status === 'pending' ? 'Pending' : 'Failed'}
                    </span>
                  </div>
                  <div className="space-y-0.5 text-xs text-muted-foreground">
                    <p>{r.instructor && `${r.instructor} · `}{r.date} · {new Date(r.timestamp).toLocaleTimeString()}</p>
                    <p className="flex items-center gap-1">
                      Proof: <span className="font-mono text-foreground/70 truncate max-w-[200px] inline-block align-middle">{r.proofHash}</span>
                      <button onClick={() => copyToClipboard(r.proofHash)} className="text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></button>
                    </p>
                    <p className="flex items-center gap-1">
                      Txn: <span className="font-mono text-primary truncate max-w-[200px] inline-block align-middle">{r.txnId}</span>
                      <button onClick={() => copyToClipboard(r.txnId)} className="text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></button>
                    </p>
                  </div>
                </div>
                <a href={`https://testnet.algoexplorer.io/tx/${r.txnId}`} target="_blank" rel="noreferrer" className="shrink-0">
                  <Button size="sm" variant="outline" className="border-glass-border text-xs">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" /> Testnet
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
