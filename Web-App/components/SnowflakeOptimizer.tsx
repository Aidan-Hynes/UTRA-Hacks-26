"use client";

import { useState } from "react";
import { CloudSnow, Database, CheckCircle2, ChevronRight, Terminal } from "lucide-react";

export default function SnowflakeOptimizer() {
    const [status, setStatus] = useState<"idle" | "connecting" | "querying" | "optimized">("idle");
    const [terminalLines, setTerminalLines] = useState<string[]>([]);

    // Execute optimization query sequence
    const runOptimizer = () => {
        if (status !== "idle") return;
        setStatus("connecting");
        setTerminalLines([]);

        const sequence = [
            { t: 500, msg: "> CONNECTING TO WAREHOUSE 'COMPUTE_WH'..." },
            { t: 1500, msg: "> CONNECTION ESTABLISHED. SESSION #SF_9921" },
            { t: 2500, msg: "> EXECUTING: SELECT * FROM TERRAIN_MODELS\n  WHERE TYPE IN ('ICE', 'RAMP_15') \n  AND FRICTION_COEFF < 0.5" },
            { t: 4500, msg: "> QUERY COMPLETED IN 0.42s. ROWS: 14,020" },
            { t: 5500, msg: "> AGGREGATING OPTIMAL PARAMETERS..." },
            { t: 6500, msg: "> DATA RECEIVED: \n  - SPEED_LIMIT: 85%\n  - GRIP_THRESHOLD: 0.72\n  - TURN_RADIUS: 45cm" },
        ];


        sequence.forEach(step => {
            setTimeout(() => {
                setTerminalLines(prev => [...prev, step.msg]);
                if (step.msg.includes("EXECUTING")) setStatus("querying");
            }, step.t);
        });

        setTimeout(() => setStatus("optimized"), 7000);
    };

    return (
        <div className="bg-glass border border-white/10 p-6 rounded-xl backdrop-blur-md relative overflow-hidden flex flex-col gap-4 min-h-[200px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 text-sky-300">
                    <CloudSnow className="w-5 h-5" />
                    <span className="font-bold tracking-wider text-sm">SNOWFLAKE DATA CLOUD</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                    <Database className="w-3 h-3" />
                    <span>WAREHOUSE: ONLINE</span>
                </div>
            </div>

            {/* Content Area */}
            {status === "idle" ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                    <p className="text-xs text-gray-400">
                        Optimize robot parameters using historical run data (1.2TB) stored in Snowflake.
                    </p>
                    <button
                        onClick={runOptimizer}
                        className="bg-sky-500/20 border border-sky-500 text-sky-300 py-2 px-6 rounded hover:bg-sky-500 hover:text-white transition-all font-bold text-xs tracking-wide flex items-center gap-2"
                    >
                        INITIALIZE OPTIMIZER
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex-1 font-mono text-[10px] text-sky-200 bg-black/40 p-3 rounded border border-white/5 overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Terminal className="w-3 h-3" />
                        <span>CONSOLE_OUTPUT</span>
                    </div>
                    {terminalLines.map((line, idx) => (
                        <div key={idx} className="whitespace-pre-wrap mb-1 animate-in fade-in slide-in-from-left-2">
                            {line}
                        </div>
                    ))}
                    {status === "querying" && <div className="animate-pulse text-sky-500">_</div>}
                </div>
            )}

            {/* Success Overlay */}
            {status === "optimized" && (
                <div className="absolute top-2 right-2">
                    <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded text-[10px] border border-green-500/30 animate-in zoom-in">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>PARAMS UPDATED</span>
                    </div>
                </div>
            )}
        </div>
    );
}
