"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Minimize2, Maximize2, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Message = {
    role: "user" | "ai";
    text: string;
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(true);
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", text: "Tactical AI initialized. Ready for mission queries." },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ message: userMsg }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setMessages((prev) => [...prev, { role: "ai", text: data.response }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { role: "ai", text: "ERROR: UPLINK FAILED. CHECK API KEY." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out font-mono text-sm",
                isOpen ? "w-96 h-[500px]" : "w-12 h-12"
            )}
        >
            <div className="relative w-full h-full">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            onClick={() => setIsOpen(true)}
                            className="absolute inset-0 bg-neonBlue/20 border border-neonBlue text-neonBlue rounded-full flex items-center justify-center hover:bg-neonBlue hover:text-black transition-all shadow-[0_0_15px_#00f0ff80]"
                        >
                            <Cpu className="w-6 h-6 animate-pulse" />
                        </motion.button>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 flex flex-col bg-black/90 border border-neonBlue/50 backdrop-blur-xl rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.15)]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-3 border-b border-neonBlue/30 bg-neonBlue/5">
                                <div className="flex items-center gap-2 text-neonBlue">
                                    <Cpu className="w-4 h-4" />
                                    <span className="font-bold tracking-wider">WINTEROPS TACTICAL AI</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                            >
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex gap-3 max-w-[90%]",
                                            msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded shrink-0 flex items-center justify-center border",
                                            msg.role === "ai"
                                                ? "bg-neonBlue/10 border-neonBlue/30 text-neonBlue"
                                                : "bg-white/10 border-white/30 text-white"
                                        )}>
                                            {msg.role === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded text-xs leading-relaxed",
                                            msg.role === "ai"
                                                ? "bg-neonBlue/5 border border-neonBlue/20 text-blue-100"
                                                : "bg-white/5 border border-white/10 text-gray-200"
                                        )}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded flex items-center justify-center border bg-neonBlue/10 border-neonBlue/30 text-neonBlue">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="text-xs text-neonBlue animate-pulse my-auto">
                                            PROCESSING_STRATEGY...
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSubmit} className="p-3 border-t border-neonBlue/30 flex gap-2 bg-black/50">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter command or query..."
                                    className="flex-1 bg-transparent border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors placeholder:text-gray-600"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-neonBlue/20 border border-neonBlue text-neonBlue p-2 rounded hover:bg-neonBlue hover:text-black transition-all disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
