"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TicketCard from "./TicketCard";
import type { Ticket } from "@/types/ticket";

interface DraggableTicketCardProps {
    ticket: Ticket;
}

export default function DraggableTicketCard({
    ticket,
}: DraggableTicketCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: ticket.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? "none" : transition,
        opacity: isDragging ? 0.8 : 1,
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 50 : 1,
        cursor: isDragging ? "grabbing" : "grab",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`transition-all duration-200 ${isDragging ? "rotate-2 shadow-colorful" : ""}`}
        >
            <TicketCard ticket={ticket} />
        </div>
    );
}
