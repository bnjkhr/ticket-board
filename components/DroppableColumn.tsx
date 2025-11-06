"use client";

import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableTicketCard from "./DraggableTicketCard";
import type { Ticket } from "@/types/ticket";

interface DroppableColumnProps {
    id: string;
    title: string;
    tickets: Ticket[];
}

export default function DroppableColumn({
    id,
    title,
    tickets,
}: DroppableColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id });

    const getStatusClasses = () => {
        switch (id) {
            case "todo":
                return isOver
                    ? "status-todo border-primary-400 bg-primary-50"
                    : "status-todo";
            case "in-progress":
                return isOver
                    ? "status-progress border-secondary-400 bg-secondary-50"
                    : "status-progress";
            case "done":
                return isOver
                    ? "status-done border-success-400 bg-success-50"
                    : "status-done";
            default:
                return isOver
                    ? "bg-primary-50 border-primary-400"
                    : "bg-white border-gray-200";
        }
    };

    const getBadgeColor = () => {
        switch (id) {
            case "todo":
                return "bg-primary-100 text-primary-700";
            case "in-progress":
                return "bg-secondary-100 text-secondary-700";
            case "done":
                return "bg-success-100 text-success-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`rounded-2xl border-2 p-4 min-h-[200px] transition-all duration-300 shadow-medium ${getStatusClasses()} ${
                isOver ? "scale-105 shadow-colorful" : "card-hover"
            }`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900">{title}</h3>
                <span
                    className={`text-sm font-semibold px-2 py-1 rounded-full ${getBadgeColor()}`}
                >
                    {tickets.length}
                </span>
            </div>
            <SortableContext
                items={tickets.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {tickets.map((ticket) => (
                        <DraggableTicketCard key={ticket.id} ticket={ticket} />
                    ))}
                    {tickets.length === 0 && (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2 opacity-50">
                                {id === "todo"
                                    ? "📝"
                                    : id === "in-progress"
                                      ? "⚡"
                                      : "🎉"}
                            </div>
                            <p className="text-sm text-gray-400 font-medium">
                                {id === "todo"
                                    ? "Noch keine To-Do Tickets"
                                    : id === "in-progress"
                                      ? "Keine Tickets in Arbeit"
                                      : "Noch nichts erledigt"}
                            </p>
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}
