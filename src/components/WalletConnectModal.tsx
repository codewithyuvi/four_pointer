import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PeraWalletConnect } from "@perawallet/connect";
import type { Transaction } from "algosdk";

const walletOptions = [
  { name: "Pera Wallet", badge: "Most Popular", color: "#FFEE55" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onConnected: (addr: string) => void;
}

const peraWallet = new PeraWalletConnect();

export default function WalletConnectModal({ open, onClose, onConnected }: Props) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const handleSelect = async () => {
  try {
    const accounts = await peraWallet.connect();
    const addr = accounts[0];

    // ✅ create signer using SAME wallet session
    const peraSigner = async (txns: Transaction[], indexes: number[]) => {
      const txnsToSign = txns.map((txn, i) => ({
        txn,
        signers: indexes.includes(i) ? [addr] : [],
      }));

      const signed = await peraWallet.signTransaction([
        txnsToSign,
      ]);

      return signed[0]; // raw Uint8Array[]
    };

    // 🔥 VERY IMPORTANT
    onConnected(addr, peraSigner);

  } catch (err) {
    console.error(err);
  }
};

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card-glow p-8 w-full max-w-md"
          onClick={e => e.stopPropagation()}
        >
          {connected ? (
            <div className="text-center py-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
                <CheckCircle2 className="h-16 w-16 text-neon-green mx-auto mb-4" />
              </motion.div>
              <h3 className="font-display text-xl font-bold text-neon-green">Connected!</h3>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center animate-spin-slow" style={{ background: 'linear-gradient(135deg, #00FFD1, #BF5AF2)' }}>
                  <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                    <span className="font-display font-bold text-sm">A</span>
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold mb-1">Connect Your Wallet</h3>
                <p className="text-sm text-muted-foreground">Choose your Algorand wallet</p>
              </div>

              <div className="space-y-3">
                {walletOptions.map(w => (
                  <button
                    key={w.name}
                    onClick={() => !connecting && handleSelect(w.name)}
                    disabled={!!connecting}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-glass-border bg-muted/30 hover:bg-muted/60 hover:border-primary/30 transition-all duration-200 text-left disabled:opacity-50"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-sm" style={{ background: w.color + '20', color: w.color }}>
                      {w.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm">{w.name}</span>
                        {w.badge && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neon-yellow/20 text-neon-yellow font-bold">{w.badge}</span>}
                      </div>
                    </div>
                    {connecting === w.name && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
