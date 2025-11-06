"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToTickets, updateTicket } from "@/lib/firestore";
import type { Ticket, TicketStatus } from "@/types/ticket";
import DroppableColumn from "./DroppableColumn";
import CreateTicketButton from "./CreateTicketButton";
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from "@dnd-kit/core";

export default function Board() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToTickets(user.uid, (newTickets) => {
            setTickets(newTickets);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const todoTickets = tickets.filter((t) => t.status === "todo");
    const inProgressTickets = tickets.filter((t) => t.status === "in-progress");
    const doneTickets = tickets.filter((t) => t.status === "done");

    const handleDragStart = (event: DragStartEvent) => {
        const ticket = tickets.find((t) => t.id === event.active.id);
        if (ticket) {
            setActiveTicket(ticket);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveTicket(null);
        const { active, over } = event;

        if (!over) return;

        // Extract status from droppable container id
        const newStatus = over.id as TicketStatus;
        const ticketId = active.id as string;

        const ticket = tickets.find((t) => t.id === ticketId);
        if (!ticket || ticket.status === newStatus) return;

        // Update ticket status
        await updateTicket(ticketId, { status: newStatus });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Lade Tickets...</div>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-primary-900">
                            Deine Tickets
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm">
                            {tickets.length}{" "}
                            {tickets.length === 1 ? "Ticket" : "Tickets"}{" "}
                            insgesamt
                        </p>
                    </div>
                    <CreateTicketButton />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DroppableColumn
                        id="todo"
                        title="To Do"
                        tickets={todoTickets}
                    />
                    <DroppableColumn
                        id="in-progress"
                        title="In Progress"
                        tickets={inProgressTickets}
                    />
                    <DroppableColumn
                        id="done"
                        title="Done"
                        tickets={doneTickets}
                    />
                </div>
            </div>
        </DndContext>
    );
}
