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
                    ? "status-todo border-gray-300 bg-gray-100"
                    : "status-todo";
            case "in-progress":
                return isOver
                    ? "status-progress border-blue-300 bg-blue-100"
                    : "status-progress";
            case "done":
                return isOver
                    ? "status-done border-green-300 bg-green-100"
                    : "status-done";
            default:
                return isOver
                    ? "bg-gray-50 border-gray-300"
                    : "bg-white border-gray-200";
        }
    };

    const getBadgeColor = () => {
        switch (id) {
            case "todo":
                return "bg-gray-200 text-gray-700";
            case "in-progress":
                return "bg-blue-100 text-blue-700";
            case "done":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`rounded-xl border p-4 min-h-[200px] transition-all duration-200 shadow-soft ${getStatusClasses()} ${
                isOver ? "scale-[1.02]" : ""
            }`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-base text-primary-900">{title}</h3>
                <span
                    className={`text-xs font-medium px-2 py-1 rounded-md ${getBadgeColor()}`}
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
