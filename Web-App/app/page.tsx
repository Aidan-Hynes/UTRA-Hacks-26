"use client";

import { Activity, Battery, Crosshair, Map, Timer, Wifi, Wind } from "lucide-react";
import { useState, useEffect } from "react";
import ChatWidget from "@/components/ChatWidget";
import VoiceController from "@/components/VoiceController";
import SolanaCertifier from "@/components/SolanaCertifier";
import SnowflakeOptimizer from "@/components/SnowflakeOptimizer";

export default function Home() {
    const [time, setTime] = useState<string>("00:00:00");
    const [batteryLevel, setBatteryLevel] = useState(100);
    const [logs, setLogs] = useState<string[]>([
        "10:24:01 [SYS] Biathlon Sequence Initiated...",
        "10:24:02 [MOT] Encoders calibrated.",
        "10:24:03 [VIS] Color Sensor: SEARCHING..."
    ]);
    const [voiceTrigger, setVoiceTrigger] = useState<string | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simStep, setSimStep] = useState(0);

    // Clock
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Simulation Logic
    const runSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setSimStep(0);

        const steps = [
            { t: 100, log: "[SYS] MISSION START. Navigating to Battery zone.", voice: "Mission Start. Proceeding to battery pickup." },
            { t: 3000, log: "[MOT] Battery GRIPPED. Moving to Drop Zone.", voice: "Battery acquired. Analyzing path options." },
            { t: 6000, log: "[VIS] Color Detected: GREEN (Target Course).", voice: "Green path detected. Initiating Target Sequence." },
            { t: 9000, log: "[SENS] Inclination: 15 deg. Climbing Ramp.", voice: "Climbing ramp. Stabilizing." },
            { t: 12000, log: "[VIS] Target Found. Distance: 3.5m", voice: "Target locked. Prepare to fire." },
            { t: 15000, log: "[ACT] FIRE! Hit: Blue Zone (300 pts).", voice: "Shot fired. Direct hit! Maximum points awarded." },
            { t: 18000, log: "[SYS] Returning to Base. Mission Complete.", voice: "Mission Complete. Returning to base." },
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                console.log("Step:", step.log);
                setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} ${step.log}`]);
                setVoiceTrigger(step.voice);
                setSimStep(index + 1);
                setTimeout(() => setVoiceTrigger(null), 1000);
            }, step.t);
        });

        setTimeout(() => setIsSimulating(false), 19000);
    };

    return (
        <main className="flex h-screen w-full flex-col bg-[url('/bg-grid.svg')] bg-cover bg-center p-3 gap-3 relative overflow-y-auto min-h-[600px]">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm -z-10" />

            <VoiceController triggerSpeak={voiceTrigger} />

            {/* Header */}
            <header className="flex items-center justify-between border-b border-neonBlue/30 pb-2">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-1 bg-neonBlue shadow-[0_0_10px_#00f0ff]" />
                    <h1 className="text-2xl font-bold tracking-widest uppercase text-white">
                        WINTEROPS <span className="text-neonBlue">BIATHLON</span> SYSTEM
                    </h1>
                </div>
                <div className="flex items-center gap-6 text-xs font-mono text-gray-400">
                    <div className="flex items-center gap-2">
                        <Wifi className="w-3 h-3 text-neonGreen animate-pulse" />
                        <span>SIGNAL: STRONG</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-neonBlue" />
                        <span>SYS: ONLINE</span>
                    </div>
                    <div className="text-lg text-white font-bold">{time}</div>
                </div>
            </header>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-12 grid-rows-6 gap-3 flex-1 min-h-0">

                {/* Left Column: Stats */}
                <div className="col-span-3 row-span-6 col-start-1 row-start-1 flex flex-col gap-3 h-full overflow-y-auto pr-1">
                    {/* Robot Status Card */}
                    <div className="bg-glass border border-white/10 p-6 rounded-xl backdrop-blur-md flex-1 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-50"><Battery className="w-6 h-6 text-neonGreen" /></div>
                        <h2 className="text-gray-400 text-xs tracking-widest uppercase mb-4">Core Systems</h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm">BATTERY</span>
                                    <span className="text-sm text-neonGreen">98%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-800 rounded-full">
                                    <div className="h-full w-[98%] bg-neonGreen rounded-full shadow-[0_0_8px_#00ff9d]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm">MOTOR HEAT</span>
                                    <span className="text-sm text-neonBlue">34°C</span>
                                </div>
                                <div className="h-2 w-full bg-gray-800 rounded-full">
                                    <div className="h-full w-[30%] bg-neonBlue rounded-full shadow-[0_0_8px_#00f0ff]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mission History (MongoDB) */}
                    <div className="bg-glass border border-white/10 p-6 rounded-xl backdrop-blur-md flex-[1.5] relative overflow-hidden">
                        <h2 className="text-gray-400 text-xs tracking-widest uppercase mb-4 flex justify-between items-center">
                            <span>Mission Log</span>
                            <span className="text-[10px] bg-neonGreen/10 text-neonGreen px-1 rounded border border-neonGreen/30">MONGODB</span>
                        </h2>

                        <div className="overflow-y-auto max-h-[160px] text-xs font-mono">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-500 border-b border-white/10">
                                        <th className="pb-2">RUN ID</th>
                                        <th className="pb-2">SCORE</th>
                                        <th className="pb-2">TIME</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300">
                                    {/* Recent Mission Data */}
                                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-2 text-neonBlue">#RUN_042</td>
                                        <td className="py-2 font-bold">1850</td>
                                        <td className="py-2">4m 12s</td>
                                    </tr>
                                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-2 text-neonBlue">#RUN_041</td>
                                        <td className="py-2 font-bold">1200</td>
                                        <td className="py-2">5m 00s</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Snowflake Optimizer */}
                    <SnowflakeOptimizer />
                </div>

                {/* Center: Map/Vis */}
                <div className="col-span-6 row-span-4 col-start-4 row-start-1 bg-glass border border-white/10 rounded-xl backdrop-blur-md relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[#0a0a0a]" />
                    {/* Grid Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

                    {/* Central "Radar" UI */}
                    <div className="relative z-10 w-64 h-64 border-2 border-neonBlue/30 rounded-full flex items-center justify-center animate-spin-slow">
                        <div className="w-56 h-56 border border-dashed border-neonBlue/20 rounded-full" />
                        <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-neonBlue/20 -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute top-1/2 left-1/2 h-full w-[1px] bg-neonBlue/20 -translate-x-1/2 -translate-y-1/2" />
                    </div>

                    {/* Simulation Dot */}
                    {isSimulating && (
                        <div
                            className="absolute z-30 w-4 h-4 bg-neonGreen rounded-full shadow-[0_0_15px_#00ff9d] transition-all duration-[3000ms] ease-in-out"
                            style={{
                                top: simStep < 2 ? '80%' : simStep < 4 ? '50%' : '20%',
                                left: simStep < 2 ? '50%' : simStep < 4 ? '30%' : '50%',
                            }}
                        />
                    )}

                    <div className="absolute z-20 text-xs text-neonBlue font-mono bottom-4 right-4">
                        {isSimulating ? "LIVE_TRACKING // SEQ_ACTIVE" : "MAP_DATA_UNAVAILABLE // WAITING_FOR_UPLINK"}
                    </div>

                    {isSimulating && simStep > 2 && (
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-green-500/20 text-neonGreen px-2 py-1 text-xs rounded border border-green-500/50">PATH: TARGET</span>
                        </div>
                    )}
                </div>

                {/* Bottom Center: Logs */}
                <div className="col-span-6 row-span-2 col-start-4 row-start-5 bg-black border-t-2 border-neonBlue p-4 font-mono text-xs text-green-400 overflow-y-auto">
                    {logs.map((log, i) => (
                        <p key={i}>{log}</p>
                    ))}
                </div>

                {/* Right Column: Controls */}
                <div className="col-span-3 row-span-6 col-start-10 row-start-1 flex flex-col gap-3 h-full overflow-y-auto pl-1">
                    {/* Mission Control (Top) */}
                    <div className="bg-glass border border-white/10 p-4 rounded-xl backdrop-blur-md flex-none">
                        <h2 className="text-gray-400 text-[10px] tracking-widest uppercase mb-2">Mission Control</h2>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={runSimulation}
                                disabled={isSimulating}
                                className="bg-neonBlue/20 border border-neonBlue text-neonBlue py-2 px-3 rounded hover:bg-neonBlue hover:text-black transition-all font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex justify-between items-center text-xs"
                            >
                                {isSimulating ? "MISSION ACTIVE" : "START SIMULATION"}
                                {isSimulating && <Activity className="w-3 h-3 animate-spin" />}
                            </button>
                            <button className="bg-white/5 border border-white/10 text-gray-400 py-2 px-3 rounded hover:bg-white/10 transition-all font-bold tracking-wide text-xs">
                                EMERGENCY STOP
                            </button>
                        </div>
                    </div>

                    {/* Target Info (Middle - Auto Height) */}
                    <div className="bg-glass border border-white/10 p-4 rounded-xl backdrop-blur-md flex flex-col items-center justify-center text-center flex-none min-h-[150px]">
                        <Crosshair className={`w-8 h-8 text-neonRed mb-2 ${isSimulating && simStep > 4 ? "animate-ping" : "opacity-30"}`} />
                        <h3 className="text-lg font-bold text-white">TARGET SYSTEM</h3>
                        <p className="text-neonRed text-xs mt-1">{isSimulating && simStep > 4 ? "Target Locked" : "Scanning..."}</p>
                    </div>

                    {/* Blockchain Certifier (Bottom) */}
                    <div className="flex-none">
                        <SolanaCertifier score={isSimulating ? "1850" : "PENDING"} time={time} />
                    </div>
                </div>

            </div>

            <ChatWidget />
        </main>
    );
}
