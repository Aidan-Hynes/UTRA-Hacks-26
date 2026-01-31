"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type VoiceWidgetProps = {
    triggerSpeak: string | null; // Pass text here to auto-speak
};

export default function VoiceController({ triggerSpeak }: VoiceWidgetProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (triggerSpeak && !isMuted) {
            speak(triggerSpeak);
        }
    }, [triggerSpeak, isMuted]);

    const speak = async (text: string) => {
        if (isPlaying) return; // Prevent Overlap (simple queueing logic ideally needed)
        setIsPlaying(true);

        try {
            const response = await fetch("/api/voice", {
                method: "POST",
                body: JSON.stringify({ text }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch voice");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
                audioRef.current.onended = () => setIsPlaying(false);
            }
        } catch (err) {
            console.error(err);
            setIsPlaying(false);
        }
    };

    return (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <audio ref={audioRef} className="hidden" />

            {/* Visualizer (Simple Pulse) */}
            {isPlaying && (
                <div className="flex gap-1 h-4 items-end">
                    <div className="w-1 bg-neonBlue animate-[bounce_0.5s_infinite]" />
                    <div className="w-1 bg-neonBlue animate-[bounce_0.7s_infinite]" />
                    <div className="w-1 bg-neonBlue animate-[bounce_0.4s_infinite]" />
                </div>
            )}

            <button
                onClick={() => setIsMuted(!isMuted)}
                className={cn(
                    "p-2 rounded-full border transition-all",
                    isMuted
                        ? "bg-red-500/20 text-red-400 border-red-500/50"
                        : "bg-neonBlue/20 text-neonBlue border-neonBlue/50 hover:bg-neonBlue hover:text-black"
                )}
            >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
        </div>
    );
}
