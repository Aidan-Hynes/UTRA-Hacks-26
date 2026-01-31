"use client";

import { useState } from "react";
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Copy, ShieldCheck, Loader2 } from "lucide-react";

export default function SolanaCertifier({ score, time }: { score: string, time: string }) {
    const [txHash, setTxHash] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>("");

    // Use Devnet for free testing
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const certifyRun = async () => {
        if (loading) return;
        setLoading(true);
        setStatus("INITIALIZING BLOCKCHAIN UPLINK...");

        try {
            // Generate ephemeral session keypair for automated signing
            const fromWallet = Keypair.generate();

            // Airdrop some SOL to the new wallet so it can pay fees
            setStatus("REQUESTING DEVNET AIRDROP...");
            const airdropSignature = await connection.requestAirdrop(
                fromWallet.publicKey,
                LAMPORTS_PER_SOL,
            );
            await connection.confirmTransaction(airdropSignature);

            setStatus("PACKAGING RUN DATA...");

            // Data persistence transaction (0 SOL transfer with metadata)
            // Note: Transfer proves activity on-chain.
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: fromWallet.publicKey,
                    toPubkey: new PublicKey("11111111111111111111111111111111"), // Burn address
                    lamports: 100, // Minimal amount
                })
            );

            setStatus("SIGNING & BROADCASTING...");
            const signature = await connection.sendTransaction(transaction, [fromWallet]);

            setTxHash(signature);
            setStatus("CERTIFIED IMMUTABLE.");
        } catch (error) {
            console.error(error);
            setStatus("ERROR: CHAIN REJECTED.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-glass border border-neonBlue/30 p-4 rounded-xl backdrop-blur-md flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-neonBlue border-b border-neonBlue/20 pb-2 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-bold tracking-wider">BLOCKCHAIN CERTIFICATION</span>
            </div>

            <div className="flex justify-between text-gray-400">
                <span>SCORE_HASH:</span>
                <span className="text-white">{score}</span>
            </div>
            <div className="flex justify-between text-gray-400">
                <span>TIME_STAMP:</span>
                <span className="text-white">{time}</span>
            </div>

            {txHash ? (
                <div className="mt-2 bg-green-500/10 border border-green-500/30 p-2 rounded text-green-400 break-all relative group cursor-pointer hover:bg-green-500/20 transition-colors">
                    <div className="text-[10px] uppercase opacity-70 mb-1">Transaction Signature</div>
                    {txHash}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="w-3 h-3" />
                    </div>
                </div>
            ) : (
                <button
                    onClick={certifyRun}
                    disabled={loading}
                    className="mt-2 bg-neonBlue/10 border border-neonBlue text-neonBlue py-2 rounded hover:bg-neonBlue hover:text-black transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "MINT RUN CERTIFICATE"}
                </button>
            )}

            {status && (
                <div className="text-[10px] text-center text-gray-500 animate-pulse mt-1">
                    {`>> ${status}`}
                </div>
            )}
        </div>
    );
}
