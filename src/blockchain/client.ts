import { AttendenceTrackerClient } from "./AttendenceTrackerClient";
import { algorand } from "./algorand";

export function getClient(walletAddress: string, signer: any) {
  return new AttendenceTrackerClient({
    appId: 600011882,
    algorand,
    defaultSender: walletAddress,   // ✅ THIS IS REQUIRED
    defaultSigner: signer, // pass the wallet signer so the generated client can sign transactions
  } as any);
}
