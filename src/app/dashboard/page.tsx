'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Ticket, getTickets } from '@/lib/tickets';
import { 
  Globe, 
  Send, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  ChevronLeft,
  RefreshCcw
} from 'lucide-react';

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Initial Fetch
  const fetchInitialTickets = useCallback(async () => {
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialTickets();

    // 2. Supabase Realtime Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTickets((prev) => [payload.new as Ticket, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTickets((prev) => 
              prev.map((t) => (t.id === payload.new.id ? (payload.new as Ticket) : t))
            );
          } else if (payload.eventType === 'DELETE') {
            setTickets((prev) => prev.filter((t) => t.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchInitialTickets]);

  // 3. Optimistic UI Update Handler
  const updateTicketStatus = async (id: string, newStatus: Ticket['status']) => {
    const previousTickets = [...tickets];

    // Optimistically update State
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to update ticket status, rolling back:', err);
      setTickets(previousTickets);
      alert('Failed to update status. Please try again.');
    }
  };

  const columns = [
    { title: 'New', status: 'New', icon: <AlertCircle className="w-5 h-5 text-blue-400" /> },
    { title: 'In Progress', status: 'In Progress', icon: <Clock className="w-5 h-5 text-amber-400" /> },
    { title: 'Resolved', status: 'Resolved', icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" /> },
  ] as const;

  return (
    <div className="dark-theme min-h-screen bg-[#020617] text-slate-200 p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Agent Dashboard
          </h1>
          <p className="text-slate-400 mt-1 tracking-tight">Real-time support ticket management.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setLoading(true); fetchInitialTickets(); }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">A</div>
        </div>
      </header>

      {loading && tickets.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading Real-time Data...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => (
            <div key={col.status} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-2">
                {col.icon}
                <h2 className="font-semibold text-lg">{col.title}</h2>
                <span className="ml-auto text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400">
                  {tickets.filter(t => t.status === col.status).length}
                </span>
              </div>
              
              <div className="flex flex-col gap-4 min-h-[600px] rounded-2xl bg-slate-900/40 p-4 border border-slate-800/30 backdrop-blur-md">
                {tickets
                  .filter((t) => t.status === col.status)
                  .map((ticket) => (
                    <TicketCard 
                      key={ticket.id} 
                      ticket={ticket} 
                      onUpdateStatus={updateTicketStatus}
                    />
                  ))}
                {tickets.filter(t => t.status === col.status).length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-800/50 rounded-2xl">
                    <p className="text-slate-600 text-sm italic">No tickets in this stage</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TicketCard({ 
  ticket, 
  onUpdateStatus 
}: { 
  ticket: Ticket, 
  onUpdateStatus: (id: string, status: Ticket['status']) => void 
}) {
  const priorityColors = {
    Low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    Medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    High: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    Critical: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const statusStyles = {
    'New': 'border-blue-500/20 hover:border-blue-500/50 bg-blue-500/5',
    'In Progress': 'border-amber-500/20 hover:border-amber-500/50 bg-amber-500/5',
    'Resolved': 'border-emerald-500/20 hover:border-emerald-500/50 bg-emerald-500/5',
  };

  return (
    <div className={`group p-5 rounded-xl border transition-all duration-300 hover:shadow-lg ${statusStyles[ticket.status]}`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </span>
        
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          {ticket.status !== 'New' && (
            <button 
              onClick={() => onUpdateStatus(ticket.id!, ticket.status === 'Resolved' ? 'In Progress' : 'New')}
              title="Move Back"
              className="p-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          
          {ticket.status !== 'Resolved' && (
            <button 
              onClick={() => onUpdateStatus(ticket.id!, ticket.status === 'New' ? 'In Progress' : 'Resolved')}
              title="Move Forward"
              className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:text-white hover:bg-blue-600 transition-all flex items-center gap-1"
            >
              <span className="text-[10px] font-bold px-1 uppercase tracking-tight">
                {ticket.status === 'New' ? 'Start' : 'Done'}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      
      <h3 className="font-semibold text-white mb-2 leading-tight group-hover:text-white transition-colors">
        {ticket.title}
      </h3>
      <p className="text-sm text-slate-400 line-clamp-2 mb-5 leading-relaxed">
        {ticket.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
        <div className="flex items-center gap-2">
          {ticket.source === 'Web' ? (
            <Globe className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <Send className="w-3.5 h-3.5 text-blue-400" />
          )}
          <span className="text-xs text-slate-500 font-medium">{ticket.reporter}</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">
          {ticket.created_at ? new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
        </span>
      </div>
    </div>
  );
}
