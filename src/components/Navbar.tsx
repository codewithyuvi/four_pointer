import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wallet, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWallet, connectWallet, disconnectWallet } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import WalletConnectModal from "@/components/WalletConnectModal";
import { getClient } from "@/blockchain/client";
import { generateAttendanceHash } from "@/blockchain/utils/hash";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Instructor", to: "/instructor" },
  { label: "Check-In", to: "/check-in" },
  { label: "My Attendance", to: "/student" },
  { label: "About", to: "/about" },
];


export default function Navbar() {
  const [wallet, setWallet] = useState<string | null>(getWallet());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletModal, setWalletModal] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const [signer, setSigner] = useState<any>(null);

  const handleCheckIn = async () => {
  try {
    if (!wallet || typeof signer !== "function") {
      console.error("Wallet or signer missing");
      return;
    }

    const client = getClient(wallet, signer);

    const hash = await generateAttendanceHash(wallet, "event1");

    await client.send.checkIn({
      args: { hash },
    });

    toast({ title: "Check-In Successful ✅" });
  } catch (err) {
    console.error(err);
    // toast({ title: "Check-In Failed", description: String(err) });
  }
};


  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleConnect = useCallback(() => {
    setWalletModal(true);
  }, []);

  const handleWalletConnected = useCallback(
    (addr: string, signerFn: any) => {
      setWallet(addr);
      setSigner(() => signerFn);
      setWalletModal(false);
    },
    [setWallet, setSigner]
  );

  const handleDisconnect = () => {
    disconnectWallet();
    setWallet(null);
    toast({ title: "Wallet Disconnected" });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50" style={{ background: 'rgba(8, 8, 16, 0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display text-sm font-bold" style={{ background: 'linear-gradient(135deg, #00FFD1, #BF5AF2)' }}>
              <span className="text-black">VA</span>
            </div>
            <span className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">VAttend</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-coral" />
            </button>

            {wallet ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-glass-border bg-muted/50">
                  <span className="w-2 h-2 rounded-full bg-neon-green" />
                  <span className="text-xs font-mono text-primary">{wallet}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={handleDisconnect} className="text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button size="sm" className="btn-primary-glow rounded-full" onClick={handleConnect}>
                <Wallet className="h-4 w-4 mr-2" /> Connect Wallet
              </Button>
            )}{wallet && (
              <Button
                size="sm"
                className="btn-primary-glow rounded-full"
                onClick={handleCheckIn}
              >
                Present
              </Button>
            )}
          </div>



          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-border/50"
                style={{ background: 'rgba(8, 8, 16, 0.95)', backdropFilter: 'blur(20px)' }}
              >
                <div className="px-4 py-4 space-y-2">
                  {navLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === link.to
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground"
                        }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-border/50">
                    {wallet ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-neon-green" />
                          <span className="text-xs font-mono text-primary">{wallet}</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={handleDisconnect}><LogOut className="h-4 w-4" /></Button>
                      </div>
                    ) : (
                      <Button size="sm" className="btn-primary-glow w-full rounded-full" onClick={handleConnect}>
                        <Wallet className="h-4 w-4 mr-2" /> Connect Wallet
                      </Button>
                    )}
                    {/* button here for check in after wallet connected */}
                    {wallet && (
                      <Button
                        size="sm"
                        className="btn-primary-glow rounded-full"
                        onClick={handleCheckIn}
                      >
                        Present
                      </Button>
                    )}

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <WalletConnectModal
        open={walletModal}
        onClose={() => setWalletModal(false)}
        onConnected={handleWalletConnected}
      />
    </>
  );
}
