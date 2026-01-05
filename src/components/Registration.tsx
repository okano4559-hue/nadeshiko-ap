"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface RegistrationProps {
    onRegister: (name: string) => void;
}

export function Registration({ onRegister }: RegistrationProps) {
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            localStorage.setItem("nadeshiko_user_name", name.trim());
            onRegister(name.trim());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center space-y-6">
            <div className="bg-nadeshiko-blue text-white p-4 rounded-full">
                <User size={48} />
            </div>
            <h2 className="text-2xl font-bold text-nadeshiko-blue">選手登録</h2>
            <p className="text-gray-600">選手名を入力してください。</p>

            <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
                <input
                    type="text"
                    placeholder="選手名 (例: 翼)"
                    className="w-full p-3 border-2 border-nadeshiko-blue rounded-lg text-lg focus:outline-none focus:ring-4 ring-nadeshiko-light/50 transition-all font-bold text-center text-nadeshiko-blue placeholder:text-gray-400 placeholder:font-normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-nadeshiko-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition active:scale-95"
                >
                    トレーニングを始める
                </button>
            </form>
        </div>
    );
}
