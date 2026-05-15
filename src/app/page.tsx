import Link from 'next/link';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Send, 
  Zap, 
  MessageSquare, 
  Bot 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          TicketFlow
        </div>
        <div className="flex gap-4">
          <Link 
            href="/dashboard" 
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Agent Login
          </Link>
          <Link 
            href="/portal" 
            className="px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Submit Ticket
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap className="w-3 h-3" />
            AI-Powered Support System
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Simplify your IT <br />Support Workflow
          </h1>
          <p className="text-xl text-slate-500 mb-12 leading-relaxed">
            A modern, multi-channel ticketing system integrated with Gemini AI and Telegram. 
            Designed for speed, clarity, and real-time collaboration.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/portal" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group"
            >
              Get Started
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-3"
            >
              <LayoutDashboard className="w-5 h-5" />
              Agent Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900">User Portal</h3>
            <p className="text-slate-500 leading-relaxed">
              Clean and intuitive interface for users to report issues. Real-time status updates and simple forms.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900">Gemini AI</h3>
            <p className="text-slate-500 leading-relaxed">
              Automated ticket classification and priority assignment using Google's most advanced AI models.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <Send className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900">Telegram Bot</h3>
            <p className="text-slate-500 leading-relaxed">
              Submit tickets directly from Telegram. Instant notifications for agents and users on every update.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-medium">
          © 2024 TicketFlow IT Support System. Built with Next.js 14.
        </p>
      </footer>
    </div>
  );
}
