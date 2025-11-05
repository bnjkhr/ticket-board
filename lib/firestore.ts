import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Ticket, Label } from '@/types/ticket';

// Tickets Collection
const ticketsCollection = collection(db, 'tickets');
const labelsCollection = collection(db, 'labels');

// Create Ticket
export async function createTicket(
  ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
) {
  const now = Timestamp.now();
  const docRef = await addDoc(ticketsCollection, {
    ...ticket,
    userId,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

// Update Ticket
export async function updateTicket(id: string, updates: Partial<Ticket>) {
  const ticketRef = doc(db, 'tickets', id);
  await updateDoc(ticketRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

// Delete Ticket
export async function deleteTicket(id: string) {
  const ticketRef = doc(db, 'tickets', id);
  await deleteDoc(ticketRef);
}

// Get All Tickets for a specific user
export async function getAllTickets(userId: string): Promise<Ticket[]> {
  const q = query(
    ticketsCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Ticket;
  });
}

// Subscribe to Tickets (real-time) for a specific user
export function subscribeToTickets(
  userId: string,
  callback: (tickets: Ticket[]) => void
) {
  const q = query(
    ticketsCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const tickets = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Ticket;
    });
    callback(tickets);
  });
}

// Labels CRUD
export async function createLabel(label: Omit<Label, 'id'>, userId: string) {
  const docRef = await addDoc(labelsCollection, {
    ...label,
    userId,
  });
  return docRef.id;
}

export async function getAllLabels(userId: string): Promise<Label[]> {
  const q = query(labelsCollection, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Label));
}

export async function deleteLabel(id: string) {
  const labelRef = doc(db, 'labels', id);
  await deleteDoc(labelRef);
}
