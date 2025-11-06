"use client";

import type { Ticket, Label } from "@/types/ticket";
import { useAuth } from "@/contexts/AuthContext";
import { updateTicket, deleteTicket, getAllLabels } from "@/lib/firestore";
import { useState, useEffect } from "react";
import EditTicketModal from "./EditTicketModal";

interface TicketCardProps {
    ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
    const { user } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [labels, setLabels] = useState<Label[]>([]);

    useEffect(() => {
        if (user) {
            loadLabels();
        }
    }, [user]);

    const loadLabels = async () => {
        if (!user) return;
        const allLabels = await getAllLabels(user.uid);
        setLabels(allLabels);
    };

    const ticketLabels = labels.filter((label) =>
        ticket.labels.includes(label.id),
    );

    const handleStatusChange = async (newStatus: Ticket["status"]) => {
        await updateTicket(ticket.id, { status: newStatus });
    };

    const handleDelete = async () => {
        if (confirm("Ticket wirklich löschen?")) {
            setIsDeleting(true);
            await deleteTicket(ticket.id);
        }
    };

    const priorityConfig = {
        low: {
            bg: "bg-gray-100",
            text: "text-gray-700",
            label: "Niedrig",
        },
        medium: {
            bg: "bg-warning-100",
            text: "text-warning-700",
            label: "Mittel",
        },
        high: {
            bg: "bg-danger-100",
            text: "text-danger-700",
            label: "Hoch",
        },
    };

    return (
        <>
            <div
                className={`glass-effect rounded-xl p-4 shadow-soft hover:shadow-medium transition-all duration-200 card-hover ${isDeleting ? "opacity-50 scale-95" : ""}`}
            >
                <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-primary-900 flex-1 pr-2 leading-tight">
                        {ticket.title}
                    </h4>
                    <div className="flex gap-1 ml-2">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            title="Bearbeiten"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 hover:bg-danger-100 hover:text-danger-600 flex items-center justify-center transition-colors"
                            title="Löschen"
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
                </div>

                {ticket.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                        {ticket.description}
                    </p>
                )}

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${priorityConfig[ticket.priority].bg} ${priorityConfig[ticket.priority].text}`}
                    >
                        {priorityConfig[ticket.priority].label}
                    </span>
                    {ticketLabels.map((label) => (
                        <span
                            key={label.id}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-white"
                            style={{ backgroundColor: label.color }}
                        >
                            {label.name}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                    <button
                        onClick={() => handleStatusChange("todo")}
                        className={`px-2 py-1.5 text-xs rounded-lg font-medium transition-all duration-200 ${
                            ticket.status === "todo"
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Todo
                    </button>
                    <button
                        onClick={() => handleStatusChange("in-progress")}
                        className={`px-2 py-1.5 text-xs rounded-lg font-medium transition-all duration-200 ${
                            ticket.status === "in-progress"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Progress
                    </button>
                    <button
                        onClick={() => handleStatusChange("done")}
                        className={`px-2 py-1.5 text-xs rounded-lg font-medium transition-all duration-200 ${
                            ticket.status === "done"
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Done
                    </button>
                </div>
            </div>

            {showEditModal && (
                <EditTicketModal
                    ticket={ticket}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </>
    );
}
