"use client";

import { useState } from "react";
import CreateTicketModal from "./CreateTicketModal";

export default function CreateTicketButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-primary"
            >
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Neues Ticket</span>
                </span>
            </button>
            {isOpen && <CreateTicketModal onClose={() => setIsOpen(false)} />}
        </>
    );
}
