import React from 'react';
import { LayoutDashboard, Wallet, ArrowUpRight, LogOut } from 'lucide-react';

function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem('pob_token');
    window.location.href = '/'; // Send back to login
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Admin</h1>
            <p className="text-slate-400">Progressive Ozark Bank | Secure Session</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-red-500/10 hover:border-red-500/50 text-slate-400 hover:text-red-500 px-4 py-2 rounded-lg transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-600/20 p-2 rounded-lg"><Wallet className="text-blue-500" /></div>
              <span className="text-green-500 text-sm font-medium">+2.5%</span>
            </div>
            <p className="text-slate-400 text-sm">Total Balance</p>
            <h3 className="text-2xl font-bold">$1,250,000.00</h3>
          </div>
          {/* Add more stats here as you build out the backend */}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <LayoutDashboard className="mx-auto mb-4 text-slate-700" size={48} />
          <h2 className="text-xl font-semibold">Account Data Loading...</h2>
          <p className="text-slate-500">Your 200+ account records will appear here shortly.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;