"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateTicket, getAllLabels } from "@/lib/firestore";
import type {
    Ticket,
    TicketStatus,
    TicketPriority,
    Label,
} from "@/types/ticket";

interface EditTicketModalProps {
    ticket: Ticket;
    onClose: () => void;
}

export default function EditTicketModal({
    ticket,
    onClose,
}: EditTicketModalProps) {
    const { user } = useAuth();
    const [title, setTitle] = useState(ticket.title);
    const [description, setDescription] = useState(ticket.description);
    const [status, setStatus] = useState<TicketStatus>(ticket.status);
    const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
    const [selectedLabels, setSelectedLabels] = useState<string[]>(
        ticket.labels,
    );

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
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            await updateTicket(ticket.id, {
                title: title.trim(),
                description: description.trim(),
                status,
                priority,
                labels: selectedLabels,
            });
            onClose();
        } catch (error) {
            console.error("Error updating ticket:", error);
            alert("Fehler beim Aktualisieren des Tickets");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="glass-effect rounded-3xl max-w-lg w-full p-8 shadow-colorful animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center">
                            <span className="text-xl">✏️</span>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary-600 to-accent-600 bg-clip-text text-transparent">
                            Ticket bearbeiten
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

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            📝 Titel *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            📄 Beschreibung
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                🎯 Status
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value as TicketStatus)
                                }
                                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="todo">📋 To Do</option>
                                <option value="in-progress">
                                    🚀 In Progress
                                </option>
                                <option value="done">✅ Done</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="priority"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                ⚡ Priorität
                            </label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) =>
                                    setPriority(
                                        e.target.value as TicketPriority,
                                    )
                                }
                                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🔴 High</option>
                            </select>
                        </div>
                    </div>

                    {availableLabels.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                🏷️ Labels
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availableLabels.map((label) => (
                                    <button
                                        key={label.id}
                                        type="button"
                                        onClick={() => toggleLabel(label.id)}
                                        className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                                            selectedLabels.includes(label.id)
                                                ? "ring-2 ring-offset-2 ring-secondary-400 scale-105"
                                                : "opacity-70 hover:opacity-100 scale-100"
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
                            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-2xl hover:bg-gray-50 transition-all duration-200"
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                            className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Speichere...
                                </span>
                            ) : (
                                "💾 Speichern"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
