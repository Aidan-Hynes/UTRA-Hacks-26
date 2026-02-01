"use client";

import { Activity, Battery, Wifi, Shield, Disc, Map, Layout, Zap } from "lucide-react";
import Link from 'next/link';
import TeslaVision from "../components/features/TeslaVision";

export default function Home() {
    return (
        <main className="h-screen w-full bg-[#0a0a0a] text-white flex flex-col p-2 gap-2">
            {/* Header */}
            <header className="h-14 border border-white/10 rounded-lg bg-black/40 backdrop-blur flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Disc className="w-6 h-6 text-cyan-400 animate-spin-slow" />
                    <span className="font-bold tracking-widest text-lg">WINTEROPS // COMMAND</span>
                </div>

                <nav className="flex gap-6 text-xs font-mono">
                    <Link href="/" className="text-cyan-400 border-b border-cyan-400">DASHBOARD</Link>
                    <Link href="/vision" className="text-gray-400 hover:text-white transition-colors">VISION SYSTEM</Link>
                    <span className="text-gray-600 cursor-not-allowed">SETTINGS</span>
                </nav>

                <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1 text-green-400">
                        <Wifi className="w-3 h-3" />
                        <span>ONLINE</span>
                    </div>
                    <div className="flex items-center gap-1 text-cyan-400">
                        <Battery className="w-3 h-3" />
                        <span>98%</span>
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-2 min-h-0">

                {/* LEFT COL: Robot Status */}
                <div className="col-span-3 row-span-6 bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col gap-4">
                    <h2 className="text-xs font-bold text-gray-400 tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4" /> SYSTEM STATUS
                    </h2>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 p-3 rounded border border-white/5">
                            <div className="text-[10px] text-gray-500">CPU LOAD</div>
                            <div className="text-xl font-mono text-cyan-400">12%</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded border border-white/5">
                            <div className="text-[10px] text-gray-500">TEMP</div>
                            <div className="text-xl font-mono text-green-400">42°C</div>
                        </div>
                    </div>

                    <div className="flex-1 bg-white/5 rounded border border-white/5 p-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="text-xs font-mono text-gray-400 mb-1">ROBOT_ARM_STATE</div>
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500 w-[60%] animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER: Vision System */}
                <div className="col-span-6 row-span-4 bg-black/40 border border-white/10 rounded-lg relative overflow-hidden group">
                    <div className="w-full h-full p-2">
                        <TeslaVision />
                    </div>
                </div>

                {/* RIGHT: Controls */}
                <div className="col-span-3 row-span-6 bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col gap-4">
                    <h2 className="text-xs font-bold text-gray-400 tracking-wider flex items-center gap-2">
                        <Shield className="w-4 h-4" /> MISSION CONTROL
                    </h2>

                    <button className="w-full py-3 bg-red-500/10 border border-red-500/50 text-red-500 font-mono text-xs hover:bg-red-500 hover:text-white transition-all rounded">
                        EMERGENCY STOP
                    </button>

                    <div className="mt-auto">
                        <div className="text-[10px] text-gray-500 mb-2">ACTIVE MODULES</div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs p-2 bg-white/5 rounded">
                                <span>SNOWFLAKE</span>
                                <span className="text-green-400">●</span>
                            </div>
                            <div className="flex items-center justify-between text-xs p-2 bg-white/5 rounded">
                                <span>SOLANA</span>
                                <span className="text-green-400">●</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM CENTER: Logs */}
                <div className="col-span-6 row-span-2 bg-black/40 border border-white/10 rounded-lg p-3 font-mono text-[10px] text-gray-400 overflow-y-auto">
                    <div className="mb-1 text-cyan-500">[SYSTEM] Initialization complete.</div>
                    <div className="mb-1">[INFO] Gemini AI connected.</div>
                    <div className="mb-1">[INFO] Vision System: Standby.</div>
                    <div className="mb-1 text-yellow-500">[WARN] Battery levels optimal.</div>
                </div>

            </div>
        </main>
    )
}
