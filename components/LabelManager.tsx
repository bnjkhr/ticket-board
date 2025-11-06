"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllLabels, createLabel, deleteLabel } from "@/lib/firestore";
import type { Label } from "@/types/ticket";

interface LabelManagerProps {
    onClose: () => void;
}

const PRESET_COLORS = [
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#6366F1",
    "#14B8A6",
    "#F97316",
    "#84CC16",
];

export default function LabelManager({ onClose }: LabelManagerProps) {
    const { user } = useAuth();
    const [labels, setLabels] = useState<Label[]>([]);
    const [newLabelName, setNewLabelName] = useState("");
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadLabels();
        }
    }, [user]);

    const loadLabels = async () => {
        if (!user) return;
        const fetchedLabels = await getAllLabels(user.uid);
        setLabels(fetchedLabels);
        setIsLoading(false);
    };

    const handleCreateLabel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLabelName.trim() || !user) return;

        await createLabel(
            {
                name: newLabelName.trim(),
                color: selectedColor,
                userId: user.uid,
            },
            user.uid,
        );

        setNewLabelName("");
        await loadLabels();
    };

    const handleDeleteLabel = async (id: string) => {
        if (confirm("Label wirklich löschen?")) {
            await deleteLabel(id);
            await loadLabels();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="glass-effect rounded-3xl max-w-md w-full p-8 shadow-colorful animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-pink-500 rounded-2xl flex items-center justify-center">
                            <span className="text-xl"></span>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-pink-600 bg-clip-text text-transparent">
                            Labels verwalten
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleCreateLabel} className="space-y-5 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Neues Label
                        </label>
                        <input
                            type="text"
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200"
                            placeholder="z.B. Bug, Feature, Frontend..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Farbe
                        </label>
                        <div className="flex gap-3 flex-wrap">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-10 h-10 rounded-2xl border-2 transition-all duration-200 hover:scale-110 ${
                                        selectedColor === color
                                            ? "border-gray-900 scale-110 shadow-medium"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!newLabelName.trim()}
                        className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        Label erstellen
                    </button>
                </form>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        📂 Vorhandene Labels
                    </h3>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <div className="w-5 h-5 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
                        </div>
                    ) : labels.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2 opacity-50"></div>
                            <p className="text-sm text-gray-400 font-medium">
                                Noch keine Labels vorhanden
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {labels.map((label) => (
                                <div
                                    key={label.id}
                                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-6 h-6 rounded-xl shadow-sm"
                                            style={{
                                                backgroundColor: label.color,
                                            }}
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            {label.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleDeleteLabel(label.id)
                                        }
                                        className="w-7 h-7 rounded-xl bg-gray-100 text-gray-400 hover:bg-danger-100 hover:text-danger-600 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
