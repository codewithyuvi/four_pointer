import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Copy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBlockHeight } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

function generateMockTxns(count: number) {
  const types = ["ATTEND_PROOF", "ATTEND_PROOF", "CONTRACT_DEPLOY", "ATTEND_PROOF"];
  const appIds = ["4821937", "7293104", "5610283"];
  return Array.from({ length: count }, (_, i) => ({
    id: 'TX' + Array.from({ length: 20 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]).join(''),
    block: 48291000 - i * 3,
    timestamp: new Date(Date.now() - i * 12000).toISOString(),
    appId: appIds[Math.floor(Math.random() * appIds.length)],
    type: types[Math.floor(Math.random() * types.length)],
  }));
}

export default function ExplorerPage() {
  const [blockHeight, setBlockHeight] = useState(getBlockHeight());
  const [txns] = useState(generateMockTxns(15));
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => setBlockHeight(h => h + 1), 4000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 noise-overlay">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Testnet Explorer</h1>
          <p className="text-muted-foreground">Live view of VAttend transactions on Algorand Testnet</p>
        </motion.div>

        {/* Block counter */}
        <div className="glass-card-glow p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
              <span className="font-heading font-bold text-sm">Live</span>
            </div>
            <span className="text-muted-foreground text-sm">Algorand Testnet</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-neon-yellow" />
            <span className="font-mono text-lg">Block #{blockHeight.toLocaleString()}</span>
          </div>
        </div>

        {/* Transactions table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="text-left p-4 font-heading text-xs text-muted-foreground">Txn ID</th>
                  <th className="text-left p-4 font-heading text-xs text-muted-foreground">Block</th>
                  <th className="text-left p-4 font-heading text-xs text-muted-foreground hidden sm:table-cell">Time</th>
                  <th className="text-left p-4 font-heading text-xs text-muted-foreground">App ID</th>
                  <th className="text-left p-4 font-heading text-xs text-muted-foreground">Type</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {txns.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-glass-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs text-primary truncate max-w-[120px]">{tx.id}</span>
                        <button onClick={() => copyToClipboard(tx.id)} className="text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></button>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs">{tx.block.toLocaleString()}</td>
                    <td className="p-4 text-xs text-muted-foreground hidden sm:table-cell">{new Date(tx.timestamp).toLocaleTimeString()}</td>
                    <td className="p-4 font-mono text-xs text-secondary">{tx.appId}</td>
                    <td className="p-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        tx.type === "ATTEND_PROOF" ? "bg-neon-green/20 text-neon-green" : "bg-secondary/20 text-secondary"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <a href={`https://testnet.algoexplorer.io/tx/${tx.id}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="https://testnet.algoexplorer.io" target="_blank" rel="noreferrer">
            <Button variant="outline" className="border-glass-border">
              <ExternalLink className="h-4 w-4 mr-2" /> View on AlgoExplorer
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
