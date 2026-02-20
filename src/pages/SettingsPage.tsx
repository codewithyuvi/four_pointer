import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Palette, Eye, Bell, Wallet, Shield, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSettings, saveSettings, getWallet } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(getSettings());
  const wallet = getWallet();
  const { toast } = useToast();

  const update = (partial: Partial<typeof settings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    saveSettings(partial);
    toast({ title: "Settings saved" });
  };

  const accentColors = [
    { name: "Mint", value: "#00FFD1" },
    { name: "Purple", value: "#BF5AF2" },
    { name: "Coral", value: "#FF6B6B" },
    { name: "Yellow", value: "#FFE600" },
    { name: "Green", value: "#39FF14" },
    { name: "Blue", value: "#3396FF" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 noise-overlay">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
            <Settings className="h-7 w-7 text-primary" /> Settings
          </h1>
        </motion.div>

        {/* Profile */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-heading font-bold text-sm mb-4 flex items-center gap-2"><Eye className="h-4 w-4 text-muted-foreground" /> Profile</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Display Name (off-chain only)</Label>
              <Input value={settings.displayName} onChange={e => update({ displayName: e.target.value })} placeholder="Anonymous" className="bg-muted border-glass-border mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Institution</Label>
              <Input value={settings.institution} onChange={e => update({ institution: e.target.value })} placeholder="University" className="bg-muted border-glass-border mt-1" />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-heading font-bold text-sm mb-4 flex items-center gap-2"><Palette className="h-4 w-4 text-muted-foreground" /> Appearance</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Theme</Label>
              <div className="flex gap-2">
                {(["dark", "darker", "oled"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => update({ theme: t })}
                    className={`px-4 py-2 rounded-lg text-xs font-heading capitalize ${settings.theme === t ? 'bg-primary text-primary-foreground' : 'bg-muted border border-glass-border'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Accent Color</Label>
              <div className="flex gap-2">
                {accentColors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => update({ accentColor: c.name.toLowerCase() })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${settings.accentColor === c.name.toLowerCase() ? 'border-foreground scale-110' : 'border-transparent'}`}
                    style={{ background: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Animation Intensity</Label>
              <div className="flex gap-2">
                {(["full", "reduced", "minimal"] as const).map(a => (
                  <button
                    key={a}
                    onClick={() => update({ animationIntensity: a })}
                    className={`px-4 py-2 rounded-lg text-xs font-heading capitalize ${settings.animationIntensity === a ? 'bg-primary text-primary-foreground' : 'bg-muted border border-glass-border'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-heading font-bold text-sm mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /> Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-heading">Show attendance publicly</p>
                <p className="text-xs text-muted-foreground">Let others see your records</p>
              </div>
              <Toggle checked={settings.showAttendancePublicly} onChange={v => update({ showAttendancePublicly: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-heading">Allow instructor to see wallet</p>
                <p className="text-xs text-muted-foreground">Share wallet address with instructors</p>
              </div>
              <Toggle checked={settings.allowInstructorSeeWallet} onChange={v => update({ allowInstructorSeeWallet: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-heading">Anonymous analytics</p>
                <p className="text-xs text-muted-foreground">Participate in aggregate analytics</p>
              </div>
              <Toggle checked={settings.participateAnalytics} onChange={v => update({ participateAnalytics: v })} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-heading font-bold text-sm mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /> Notifications</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            {["Event starting soon", "Attendance recorded", "Weekly summary"].map(item => (
              <div key={item} className="flex items-center justify-between">
                <span>{item}</span>
                <Toggle checked={true} onChange={() => {}} />
              </div>
            ))}
          </div>
        </div>

        {/* Wallet */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-heading font-bold text-sm mb-4 flex items-center gap-2"><Wallet className="h-4 w-4 text-muted-foreground" /> Wallet</h3>
          {wallet ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-green" />
              <span className="font-mono text-sm text-primary">{wallet}</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No wallet connected</p>
          )}
        </div>

        {/* Data */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-heading font-bold text-sm mb-4">Data Management</h3>
          <div className="flex gap-3">
            <Button variant="outline" className="border-glass-border text-sm">
              <Download className="h-4 w-4 mr-2" /> Export Data
            </Button>
            <Button variant="outline" className="border-coral/30 text-coral text-sm hover:bg-coral/10">
              <Trash2 className="h-4 w-4 mr-2" /> Clear Local Data
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Note: Blockchain records are permanent and cannot be deleted.</p>
        </div>
      </div>
    </div>
  );
}
