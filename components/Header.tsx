"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LabelManager from "./LabelManager";

export default function Header() {
    const [showLabelManager, setShowLabelManager] = useState(false);
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        if (confirm("Wirklich abmelden?")) {
            await logout();
        }
    };

    return (
        <>
            <header className="glass-effect shadow-soft sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary-900 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-xl font-semibold text-primary-900">
                                Ticket Board
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowLabelManager(true)}
                                className="btn-secondary text-sm"
                            >
                                Labels
                            </button>
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    {user?.email}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm px-3 py-1.5 text-gray-600 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all duration-200"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            {showLabelManager && (
                <LabelManager onClose={() => setShowLabelManager(false)} />
            )}
        </>
    );
}
