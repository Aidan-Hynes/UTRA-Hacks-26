"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Power } from "lucide-react";

// CONFIGURATION
const STREAM_URL = "http://192.168.38.209:81/stream"; // Your ESP32 IP
const DETECTION_INTERVAL_MS = 100; // Run detection every 100ms

type DetectedObject = {
    color: "Red" | "Black" | "Green" | "Yellow";
    rect: { x: number; y: number; w: number; h: number };
    angle: number;
};

export default function TeslaVision() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeNavColor, setActiveNavColor] = useState<string | null>(null);
    const [activeNavAngle, setActiveNavAngle] = useState(0);

    const videoRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Toggle Stream
    const toggleStream = () => setIsPlaying(!isPlaying);

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(runDetection, DETECTION_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [isPlaying]);

    // Helper: Convert RGB to HSV
    // Returns h [0-180], s [0-255], v [0-255]
    const rgbToHsv = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, v = max;
        const d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max !== min) {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 180, s * 255, v * 255];
    };

    const runDetection = () => {
        const img = videoRef.current;
        const canvas = canvasRef.current;
        if (!img || !canvas || !img.complete || img.naturalWidth === 0) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        // 1. Draw current video frame to canvas
        const w = 320;
        const h = 240;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        try {
            // 2. Scan pixels using HSV logic
            const frameData = ctx.getImageData(0, 0, w, h);
            const data = frameData.data;

            let sumX = { Red: 0, Green: 0, Black: 0, Yellow: 0 };
            let count = { Red: 0, Green: 0, Black: 0, Yellow: 0 };

            // Optimized Loop: Skip every 4th pixel for speed
            for (let i = 0; i < data.length; i += 16) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                const [hue, sat, val] = rgbToHsv(r, g, b);

                // BLACK DETECTION: Low Value (Brightness)
                // Adjust this threshold (40-60 usually works for black objects)
                if (val < 60) {
                    sumX.Black += (i / 4) % w;
                    count.Black++;
                }
                // COLORS: High Saturation & Value
                else if (sat > 80 && val > 80) {
                    // RED
                    if (hue < 10 || hue > 160) {
                        sumX.Red += (i / 4) % w;
                        count.Red++;
                    }
                    // GREEN
                    else if (hue > 35 && hue < 95) {
                        sumX.Green += (i / 4) % w;
                        count.Green++;
                    }
                    // YELLOW
                    else if (hue > 15 && hue < 35) {
                        sumX.Yellow += (i / 4) % w;
                        count.Yellow++;
                    }
                }
            }

            // Logic: If enough pixels of a color, assume object
            const THRESHOLD = 100;

            let foundColor = null;
            let foundAngle = 0;

            // Priority Logic
            if (count.Green > THRESHOLD) {
                foundColor = "Green";
                const centerX = sumX.Green / count.Green;
                foundAngle = (centerX - w / 2) / (w / 2) * 45;
            }
            else if (count.Red > THRESHOLD) {
                foundColor = "Red";
                const centerX = sumX.Red / count.Red;
                foundAngle = (centerX - w / 2) / (w / 2) * 45;
            }
            else if (count.Black > THRESHOLD) {
                foundColor = "Black";
                const centerX = sumX.Black / count.Black;
                foundAngle = (centerX - w / 2) / (w / 2) * 45;
            }

            // State Update
            setActiveNavColor(foundColor);
            if (foundColor) {
                setActiveNavAngle(foundAngle);
            } else {
                setActiveNavAngle(0);
            }

        } catch (e) {
            console.error("Vision Error:", e);
        }
    };

    return (
        <div className="flex h-full w-full bg-black/20">

            {/* LEFT: Camera Feed */}
            <div className="flex-1 relative border-r border-white/10 group">
                <img
                    ref={videoRef}
                    src={isPlaying ? STREAM_URL : ""}
                    className="w-full h-full object-cover opacity-80"
                    crossOrigin="anonymous"
                    alt=""
                />

                <div className="absolute top-3 left-3 flex gap-2">
                    <div className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider backdrop-blur-md border border-white/10
                    ${isPlaying ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                        CAM_01: {isPlaying ? "LIVE" : "OFFLINE"}
                    </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />

                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <button
                            onClick={toggleStream}
                            className="flex items-center gap-2 text-neonBlue hover:text-white transition-all text-xs tracking-widest border-b border-neonBlue pb-1 hover:border-white"
                        >
                            <Power className="w-3 h-3" />
                            INIT_VISION_SYSTEM
                        </button>
                    </div>
                )}
            </div>

            {/* RIGHT: Tesla-Style HUD */}
            <div className="w-[40%] bg-gray-900/80 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 right-0 p-3 z-10 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
                    <div className="text-[10px] text-gray-400 font-mono">
                        <div>V_NAV_SYSTEM_V2</div>
                        <div className="text-white font-bold">{activeNavColor ? activeNavColor.toUpperCase() : "IDLE"}</div>
                    </div>
                    <div className="text-xs font-mono text-neonBlue">{Math.round(activeNavAngle)}°</div>
                </div>

                <div className="flex-1 relative perspective-container">
                    <div
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[120%] origin-bottom transition-all duration-300
                  ${activeNavColor === 'Green' ? 'bg-gradient-to-t from-green-500/30 to-transparent' :
                                activeNavColor === 'Red' ? 'bg-gradient-to-t from-red-500/30 to-transparent' :
                                    activeNavColor === 'Black' ? 'bg-gradient-to-t from-gray-200/20 to-transparent' :
                                        'bg-gradient-to-t from-gray-700/20 to-transparent'}`}
                        style={{
                            transform: `translateX(-50%) skewX(${activeNavAngle * -1.5}deg)`,
                            clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)"
                        }}
                    >
                        <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-white/20"></div>
                        <div className="absolute top-0 bottom-0 right-2 w-0.5 bg-white/20"></div>
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 transform scale-75">
                        <div className="w-14 h-20 bg-gray-200 rounded-xl shadow-2xl relative border border-white/50">
                            <div className="absolute top-2 left-2 right-2 h-8 bg-gray-800 rounded-md opacity-80"></div>
                            <div className="absolute bottom-1 left-1 w-1.5 h-2.5 bg-red-500 rounded-sm shadow-[0_0_5px_red]"></div>
                            <div className="absolute bottom-1 right-1 w-1.5 h-2.5 bg-red-500 rounded-sm shadow-[0_0_5px_red]"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
