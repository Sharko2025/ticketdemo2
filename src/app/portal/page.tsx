'use client';

import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle, 
  Loader2, 
  User, 
  FileText, 
  AlertTriangle 
} from 'lucide-react';
import { createTicket } from '@/lib/tickets';

export default function PortalPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    reporter: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await createTicket({
        title: formData.title,
        description: formData.description,
        priority: formData.priority as any,
        reporter: formData.reporter,
        status: 'New',
        source: 'Web',
      });
      setStatus('success');
    } catch (error) {
      console.error('Failed to submit ticket:', error);
      alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Ticket Submitted!</h2>
          <p className="text-slate-500 mb-8">
            Thank you for your report. Our team has been notified and will look into it shortly.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-200"
          >
            Submit Another Ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar Info */}
        <div className="md:w-1/3 bg-blue-600 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <Send className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Support Portal</h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Facing an issue? Fill out the form and our IT team will help you as soon as possible.
            </p>
          </div>
          <div className="hidden md:block text-xs text-blue-200 font-medium">
            © 2024 IT Support Team
          </div>
        </div>

        {/* Form Area */}
        <div className="md:w-2/3 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Ticket Title
              </label>
              <input 
                required
                type="text" 
                placeholder="Brief summary of the issue"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-slate-400" />
                Priority Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({...formData, priority: p})}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                      formData.priority === p 
                        ? 'bg-blue-50 border-blue-200 text-blue-600 ring-2 ring-blue-500/10' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Reporter Name
              </label>
              <input 
                required
                type="text" 
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                value={formData.reporter}
                onChange={(e) => setFormData({...formData, reporter: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea 
                required
                rows={4}
                placeholder="Please describe your problem in detail..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <button 
              disabled={status === 'loading'}
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Ticket'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
