'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableTicketCard from './DraggableTicketCard';
import type { Ticket } from '@/types/ticket';

interface DroppableColumnProps {
  id: string;
  title: string;
  tickets: Ticket[];
}

export default function DroppableColumn({ id, title, tickets }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-lg border-2 p-4 min-h-[200px] transition-colors ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">{tickets.length}</span>
      </div>
      <SortableContext items={tickets.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <DraggableTicketCard key={ticket.id} ticket={ticket} />
          ))}
          {tickets.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              Keine Tickets
            </p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
