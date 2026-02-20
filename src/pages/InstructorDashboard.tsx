import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, QrCode, BarChart3, ExternalLink, Clock, MapPin, Calendar, Copy, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getEvents, saveEvent, type AttendXEvent } from "@/lib/store";
import { QRCodeSVG } from "qrcode.react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CHART_COLORS = ["#00FFD1", "#BF5AF2", "#FF6B6B", "#FFE600"];

export default function InstructorDashboard() {
  const [events, setEvents] = useState<AttendXEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", date: "", time: "", location: "", lat: "37.7749", lng: "-122.4194", duration: "60" });

  useEffect(() => { setEvents(getEvents()); }, []);

  const handleCreate = () => {
    if (!form.name || !form.date || !form.time) {
      toast({ title: "Error", description: "Fill in all required fields.", variant: "destructive" });
      return;
    }
    const ev = saveEvent({
      name: form.name,
      date: form.date,
      time: form.time,
      location: form.location || "Main Campus",
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      duration: parseInt(form.duration),
    });
    setEvents(getEvents());
    setForm({ name: "", date: "", time: "", location: "", lat: "37.7749", lng: "-122.4194", duration: "60" });
    setShowForm(false);
    toast({ title: "Event Created! 🎉", description: `App ID: ${ev.appId}` });
  };

  const totalCheckIns = events.reduce((s, e) => s + e.checkIns, 0);
  const activeEvents = events.filter(e => e.status === "active").length;
  const avgAttendance = events.length ? Math.round((totalCheckIns / events.reduce((s, e) => s + e.enrolled, 0)) * 100) || 0 : 0;
  const barData = events.slice(-6).map(e => ({ name: e.name.substring(0, 10), checkIns: e.checkIns }));
  const pieData = [
    { name: "Active", value: events.filter(e => e.status === "active").length || 1 },
    { name: "Upcoming", value: events.filter(e => e.status === "upcoming").length || 0 },
    { name: "Expired", value: events.filter(e => e.status === "expired").length || 0 },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 noise-overlay">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Create events, generate QR codes, and track attendance.</p>
        </motion.div>

        {/* Stats Bento */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Calendar className="h-5 w-5 text-primary" />, label: "Total Events", value: events.length },
            { icon: <Users className="h-5 w-5 text-secondary" />, label: "Total Check-ins", value: totalCheckIns },
            { icon: <Zap className="h-5 w-5 text-neon-green" />, label: "Active Now", value: activeEvents, pulse: true },
            { icon: <BarChart3 className="h-5 w-5 text-neon-yellow" />, label: "Avg Attendance", value: `${avgAttendance}%` },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bento-card p-5">
              <div className="flex items-center gap-2 mb-2">
                {s.icon}
                {s.pulse && <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />}
              </div>
              <p className="font-stat text-3xl counter-glow">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="font-heading font-bold mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Check-ins by Event</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fill: "#A0AEC0", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#A0AEC0", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0F1023", border: "1px solid rgba(234,234,255,0.1)", borderRadius: 12, color: "#fff" }} />
                <Bar dataKey="checkIns" fill="url(#barGrad)" radius={[6, 6, 0, 0]}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00FFD1" />
                      <stop offset="100%" stopColor="#00FFD1" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-heading font-bold mb-4">Event Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0F1023", border: "1px solid rgba(234,234,255,0.1)", borderRadius: 12, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i] }} /> {d.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Create event FAB */}
        <div className="mb-8">
          <Button onClick={() => setShowForm(!showForm)} className="btn-primary-glow rounded-full h-12 px-6">
            <Plus className="h-5 w-5 mr-2" /> Create Event
          </Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card-glow p-6 mb-8">
            <h3 className="font-display font-bold mb-4">New Event</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="text-xs text-muted-foreground">Event Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="CS 301 Lecture" className="bg-muted border-glass-border mt-1" /></div>
              <div><Label className="text-xs text-muted-foreground">Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Room 302" className="bg-muted border-glass-border mt-1" /></div>
              <div><Label className="text-xs text-muted-foreground">Date *</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-muted border-glass-border mt-1" /></div>
              <div><Label className="text-xs text-muted-foreground">Time *</Label><Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="bg-muted border-glass-border mt-1" /></div>
              <div><Label className="text-xs text-muted-foreground">Latitude</Label><Input value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} className="bg-muted border-glass-border mt-1" /></div>
              <div><Label className="text-xs text-muted-foreground">Longitude</Label><Input value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} className="bg-muted border-glass-border mt-1" /></div>
              <div><Label className="text-xs text-muted-foreground">Duration (min)</Label><Input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="bg-muted border-glass-border mt-1" /></div>
            </div>
            <Button onClick={handleCreate} className="btn-primary-glow mt-6 rounded-full">Deploy Smart Contract & Generate QR</Button>
          </motion.div>
        )}

        {/* QR Modal */}
        {selectedQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }} onClick={() => setSelectedQR(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card-glow p-8 text-center" onClick={e => e.stopPropagation()}>
              <h3 className="font-display font-bold mb-4">Event QR Code</h3>
              <div className="bg-white p-4 rounded-xl inline-block mb-4">
                <QRCodeSVG value={selectedQR} size={200} />
              </div>
              <p className="text-xs text-muted-foreground font-mono">Event ID: {selectedQR}</p>
              <Button variant="outline" className="mt-4 border-glass-border" onClick={() => setSelectedQR(null)}>Close</Button>
            </motion.div>
          </div>
        )}

        {/* Event list */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg mb-4">All Events</h3>
          {events.length === 0 && (
            <div className="glass-card p-8 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              No events yet. Create your first event above.
            </div>
          )}
          {events.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bento-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-heading font-bold truncate">{ev.name}</h4>
                  {ev.courseCode && <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-bold">{ev.courseCode}</span>}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    ev.status === "active" ? "bg-neon-green/20 text-neon-green" :
                    ev.status === "upcoming" ? "bg-primary/20 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {ev.status === "active" && <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />}
                    {ev.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{ev.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ev.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span>
                  <span className="flex items-center gap-1">
                    App ID: <span className="font-mono text-foreground">{ev.appId}</span>
                    <button onClick={() => copyToClipboard(ev.appId)} className="text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></button>
                  </span>
                </div>
                {/* Attendance progress */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(ev.checkIns / ev.enrolled) * 100}%`, background: 'linear-gradient(90deg, #00FFD1, #BF5AF2)' }} />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{ev.checkIns}/{ev.enrolled}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="outline" className="border-glass-border" onClick={() => setSelectedQR(ev.id)}>
                  <QrCode className="h-4 w-4" />
                </Button>
                <a href={`https://testnet.algoexplorer.io/application/${ev.appId}`} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="outline" className="border-glass-border">
                    <ExternalLink className="h-4 w-4" />
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
