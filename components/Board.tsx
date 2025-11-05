'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToTickets } from '@/lib/firestore';
import type { Ticket } from '@/types/ticket';
import TicketCard from './TicketCard';
import CreateTicketButton from './CreateTicketButton';

export default function Board() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToTickets(user.uid, (newTickets) => {
      setTickets(newTickets);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const todoTickets = tickets.filter((t) => t.status === 'todo');
  const inProgressTickets = tickets.filter((t) => t.status === 'in-progress');
  const doneTickets = tickets.filter((t) => t.status === 'done');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Lade Tickets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Deine Tickets</h2>
        <CreateTicketButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Todo Column */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">To Do</h3>
            <span className="text-sm text-gray-500">{todoTickets.length}</span>
          </div>
          <div className="space-y-3">
            {todoTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
            {todoTickets.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">
                Keine Tickets
              </p>
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">In Progress</h3>
            <span className="text-sm text-gray-500">{inProgressTickets.length}</span>
          </div>
          <div className="space-y-3">
            {inProgressTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
            {inProgressTickets.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">
                Keine Tickets
              </p>
            )}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Done</h3>
            <span className="text-sm text-gray-500">{doneTickets.length}</span>
          </div>
          <div className="space-y-3">
            {doneTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
            {doneTickets.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">
                Keine Tickets
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
