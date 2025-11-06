"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createTicket, getAllLabels } from "@/lib/firestore";
import type { TicketStatus, TicketPriority, Label } from "@/types/ticket";

interface CreateTicketModalProps {
    onClose: () => void;
}

export default function CreateTicketModal({ onClose }: CreateTicketModalProps) {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TicketStatus>("todo");
    const [priority, setPriority] = useState<TicketPriority>("medium");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

    useEffect(() => {
        if (user) {
            loadLabels();
        }
    }, [user]);

    const loadLabels = async () => {
        if (!user) return;
        const labels = await getAllLabels(user.uid);
        setAvailableLabels(labels);
    };

    const toggleLabel = (labelId: string) => {
        setSelectedLabels((prev) =>
            prev.includes(labelId)
                ? prev.filter((id) => id !== labelId)
                : [...prev, labelId],
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !user) return;

        setIsSubmitting(true);
        try {
            await createTicket(
                {
                    title: title.trim(),
                    description: description.trim(),
                    status,
                    priority,
                    labels: selectedLabels,
                    userId: user.uid,
                },
                user.uid,
            );
            onClose();
        } catch (error) {
            console.error("Error creating ticket:", error);
            alert("Fehler beim Erstellen des Tickets");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="glass-effect rounded-xl max-w-lg w-full p-8 shadow-large animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-primary-900">
                        Neues Ticket
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
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

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Titel *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-all duration-200"
                            placeholder="z.B. API-Endpoint für User-Login implementieren"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Beschreibung
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Weitere Details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value as TicketStatus)
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-all duration-200"
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="priority"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Priorität
                            </label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) =>
                                    setPriority(
                                        e.target.value as TicketPriority,
                                    )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-all duration-200"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {availableLabels.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Labels
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availableLabels.map((label) => (
                                    <button
                                        key={label.id}
                                        type="button"
                                        onClick={() => toggleLabel(label.id)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            selectedLabels.includes(label.id)
                                                ? "ring-2 ring-offset-2 ring-primary-900"
                                                : "opacity-70 hover:opacity-100"
                                        }`}
                                        style={{
                                            backgroundColor: label.color,
                                            color: "white",
                                        }}
                                    >
                                        {label.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                            className="btn-primary flex-1 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Erstelle...
                                </span>
                            ) : (
                                "Erstellen"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
