'use client'
import React, { useEffect, useRef, useState } from "react";

export const MentalHealthAI = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<string[]>([]);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);


    const handleSend = async () => {
        if (!message.trim()) return;

        setChat((prev) => [...prev, `You: ${message}`]);

        const userMessage = message;
        setMessage("");

        const res = await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await res.json();

        // 답변이 너무 긴 경우에 가독성을위해 문단을 나눔
        const paragraphs = data.reply.split("\n\n");

        setChat(prev => [
            ...prev,
            ...paragraphs.map((p: string) => `AI: ${p}`)
        ]);
    };


    return (
        <main className="min-h-screen bg-gradient-to-b from-[#EEF2FF] to-white flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 flex flex-col gap-6 border border-indigo-100">
                {/* Header */}
                <header className="text-center flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-indigo-700">MindMate AI</h1>
                    <p className="text-gray-500 text-sm">
                        Conversational AI Mental Health Care Service
                    </p>
                </header>

                {/* Chat window */}
                <div className="h-[380px] overflow-y-auto bg-indigo-50 p-4 rounded-xl flex flex-col gap-3 border border-indigo-100">
                    {chat.length === 0 && (
                        <p className="text-gray-500 text-center text-sm">
                            Your conversations will appear here.
                        </p>
                    )}

                    {chat.map((c, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-xl max-w-[80%] text-sm shadow ${c.startsWith("You:") ? "text-black bg-white self-end" : "bg-indigo-600 text-white"}`}
                        >
                            {c}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Input area */}
                <form className="flex gap-2" onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }}>
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        placeholder="오늘 기분이 어떠신가요? 저에게 말해주세요."
                        className="flex-1 p-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />

                    <button
                        onClick={handleSend}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
                    >
                        Send
                    </button>
                </form>
            </div>
        </main>
    );
}
