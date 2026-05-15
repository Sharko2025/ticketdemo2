import { supabase } from './supabase';

export interface Ticket {
  id?: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  reporter: string;
  status: 'New' | 'In Progress' | 'Resolved';
  source: 'Web' | 'Telegram';
  created_at?: string;
}

/**
 * Inserts a new ticket into the Supabase database.
 */
export async function createTicket(ticket: Omit<Ticket, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('tickets')
    .insert([ticket])
    .select()
    .single();

  if (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }

  return data;
}

/**
 * Fetches all tickets from the Supabase database.
 */
export async function getTickets() {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }

  return data as Ticket[];
}

export const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Cannot login to email',
    description: 'User is getting a password error even after reset.',
    priority: 'High',
    reporter: 'John Doe',
    status: 'New',
    source: 'Web',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'VPN connection dropping',
    description: 'VPN disconnects every 5 minutes on Mac.',
    priority: 'Critical',
    reporter: 'Jane Smith',
    status: 'In Progress',
    source: 'Telegram',
    created_at: new Date().toISOString(),
  },
];
