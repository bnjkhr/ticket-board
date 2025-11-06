"use client";

import { useState } from "react";
import CreateTicketModal from "./CreateTicketModal";

export default function CreateTicketButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-primary group"
            >
                <span className="flex items-center gap-2">
                    <span className="text-lg group-hover:rotate-90 transition-transform duration-300">
                        ➕
                    </span>
                    <span>Neues Ticket</span>
                </span>
            </button>
            {isOpen && <CreateTicketModal onClose={() => setIsOpen(false)} />}
        </>
    );
}
