export type TicketStatus = 'todo' | 'in-progress' | 'done';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Label {
  id: string;
  name: string;
  color: string;
  userId: string; // Owner of the label
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  labels: string[]; // Array of label IDs
  userId: string; // Owner of the ticket
  createdAt: Date;
  updatedAt: Date;
}
