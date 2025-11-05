'use client';

import type { Ticket, Label } from '@/types/ticket';
import { useAuth } from '@/contexts/AuthContext';
import { updateTicket, deleteTicket, getAllLabels } from '@/lib/firestore';
import { useState, useEffect } from 'react';
import EditTicketModal from './EditTicketModal';

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
    ticket.labels.includes(label.id)
  );

  const handleStatusChange = async (newStatus: Ticket['status']) => {
    await updateTicket(ticket.id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (confirm('Ticket wirklich löschen?')) {
      setIsDeleting(true);
      await deleteTicket(ticket.id);
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <>
      <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${isDeleting ? 'opacity-50' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 flex-1">{ticket.title}</h4>
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="text-gray-400 hover:text-blue-500"
              title="Bearbeiten"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500"
              title="Löschen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

      {ticket.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {ticket.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </span>
        {ticketLabels.map((label) => (
          <span
            key={label.id}
            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white"
            style={{ backgroundColor: label.color }}
          >
            {label.name}
          </span>
        ))}
      </div>

      <div className="flex gap-1">
        <button
          onClick={() => handleStatusChange('todo')}
          className={`flex-1 px-2 py-1 text-xs rounded ${
            ticket.status === 'todo'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todo
        </button>
        <button
          onClick={() => handleStatusChange('in-progress')}
          className={`flex-1 px-2 py-1 text-xs rounded ${
            ticket.status === 'in-progress'
              ? 'bg-purple-100 text-purple-700 font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Progress
        </button>
        <button
          onClick={() => handleStatusChange('done')}
          className={`flex-1 px-2 py-1 text-xs rounded ${
            ticket.status === 'done'
              ? 'bg-green-100 text-green-700 font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
