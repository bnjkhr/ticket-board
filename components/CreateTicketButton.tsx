'use client';

import { useState } from 'react';
import CreateTicketModal from './CreateTicketModal';

export default function CreateTicketButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        + Neues Ticket
      </button>
      {isOpen && <CreateTicketModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
