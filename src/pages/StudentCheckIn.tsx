import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, MapPin, CheckCircle2, ExternalLink, Loader2, Hash, Wallet, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getEvents, submitAttendance } from "@/lib/store";

type Step = "scan" | "verifying" | "wallet" | "submitting" | "success";

export default function StudentCheckIn() {
  const [step, setStep] = useState<Step>("scan");
  const [eventId, setEventId] = useState("");
  const [txnId, setTxnId] = useState("");
  const [proofHash, setProofHash] = useState("");
  const [distance, setDistance] = useState(0);
  const { toast } = useToast();

  const handleScan = () => {
    const events = getEvents();
    if (events.length > 0) {
      setEventId(events[events.length - 1].id);
    }
    startVerification(events.length > 0 ? events[events.length - 1].id : eventId);
  };

  const handleManual = () => {
    if (!eventId.trim()) {
      toast({ title: "Enter an Event ID", variant: "destructive" });
      return;
    }
    startVerification(eventId);
  };

  const startVerification = (id: string) => {
    const events = getEvents();
    const ev = events.find(e => e.id === id);
    if (!ev) {
      toast({ title: "Event not found", description: "Check the Event ID and try again.", variant: "destructive" });
      return;
    }
    setDistance(Math.floor(10 + Math.random() * 80));
    setStep("verifying");
    setTimeout(() => {
      setStep("wallet");
      setTimeout(() => {
        setStep("submitting");
        setTimeout(() => {
          const { txnId: tid, record } = submitAttendance(ev.id, ev.name);
          setTxnId(tid);
          setProofHash(record.proofHash);
          setStep("success");
          toast({ title: "Attendance Recorded! 🎉" });
        }, 1800);
      }, 1500);
    }, 2000);
  };

  const reset = () => { setStep("scan"); setEventId(""); setTxnId(""); setProofHash(""); };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 flex items-center justify-center noise-overlay">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === "scan" && (
            <motion.div key="scan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h1 className="text-3xl font-display font-bold text-center mb-2">Check In</h1>
              <p className="text-center text-muted-foreground mb-8">Scan a QR code or enter an Event ID</p>

              {/* Scanner */}
              <div className="glass-card-glow p-6 mb-6">
                <div className="relative aspect-square rounded-xl overflow-hidden" style={{ background: 'rgba(15,16,35,0.8)', border: '2px dashed hsla(234, 20%, 30%, 0.5)' }}>
                  <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                  <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-primary rounded-br-lg" />
                  <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-neon-green to-transparent scan-line" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <ScanLine className="h-14 w-14 text-primary/30 mx-auto mb-2 pulse-ring" />
                      <p className="text-xs text-muted-foreground font-heading">Camera preview</p>
                    </div>
                  </div>
                </div>
                <Button onClick={handleScan} className="btn-primary-glow w-full mt-4 rounded-full h-12">
                  <ScanLine className="h-4 w-4 mr-2" /> Simulate QR Scan
                </Button>
              </div>

              {/* Manual entry */}
              <div className="glass-card p-6">
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2"><Hash className="h-4 w-4" /> Enter Event ID manually</p>
                <div className="flex gap-2">
                  <Input
                    value={eventId}
                    onChange={e => setEventId(e.target.value.toUpperCase())}
                    placeholder="e.g. EVT001"
                    className="bg-muted border-glass-border font-mono"
                  />
                  <Button onClick={handleManual} variant="outline" className="border-glass-border shrink-0">
                    Go
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "verifying" && (
            <motion.div key="verifying" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-card-glow p-10 text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                {/* Radar sweep */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 radar-sweep" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0,255,209,0.15) 30deg, transparent 60deg)' }} />
                </div>
                <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-primary" />
                </div>
                {/* Random blips */}
                <div className="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <div className="absolute bottom-4 left-2 w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              <h2 className="font-display font-bold text-xl mb-2">Verifying Location...</h2>
              <p className="text-sm text-muted-foreground">You are <span className="text-primary font-mono">{distance}m</span> away. Required: within 100m</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Radio className="h-3 w-3 text-neon-green animate-pulse" />
                <span className="text-xs text-neon-green font-mono">Signal acquired</span>
              </div>
            </motion.div>
          )}

          {step === "wallet" && (
            <motion.div key="wallet" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-card-glow p-10 text-center">
              <Wallet className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h2 className="font-display font-bold text-xl mb-2">Generating Proof...</h2>
              <p className="text-sm text-muted-foreground mb-4">Creating your anonymous identity hash</p>
              <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs text-primary/70 overflow-hidden">
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Hashing wallet → proof...
                </motion.span>
              </div>
            </motion.div>
          )}

          {step === "submitting" && (
            <motion.div key="submitting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-card-glow p-10 text-center">
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-6 animate-spin" />
              <h2 className="font-display font-bold text-xl mb-2">Submitting to Algorand...</h2>
              <p className="text-sm text-muted-foreground">Broadcasting anonymous proof to Testnet</p>
              <div className="mt-4 flex justify-center gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card-glow p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
              >
                <CheckCircle2 className="h-20 w-20 text-neon-green mx-auto mb-6" />
              </motion.div>
              <h2 className="font-display font-bold text-2xl mb-2">Attendance Recorded! 🎉</h2>
              <p className="text-sm text-muted-foreground mb-6">Your anonymous proof is live on Algorand Testnet.</p>

              <div className="space-y-3 mb-6">
                <div className="bg-muted/50 rounded-lg p-3 text-left">
                  <p className="text-[10px] text-muted-foreground mb-1 font-heading">Transaction ID</p>
                  <p className="text-xs font-mono text-primary break-all">{txnId}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-left">
                  <p className="text-[10px] text-muted-foreground mb-1 font-heading">Proof Hash</p>
                  <p className="text-xs font-mono text-secondary break-all">{proofHash}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <a href={`https://testnet.algoexplorer.io/tx/${txnId}`} target="_blank" rel="noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full border-glass-border">
                    <ExternalLink className="h-4 w-4 mr-2" /> View on Testnet
                  </Button>
                </a>
                <Button onClick={reset} className="btn-primary-glow flex-1 rounded-full">
                  New Check-In
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
