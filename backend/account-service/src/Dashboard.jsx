import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Wallet, LogOut, Landmark, Loader2, AlertCircle, RefreshCcw, Search } from 'lucide-react';
import axios from 'axios';

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // STEP 1: Search State
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('pob_token');
    window.location.href = '/'; 
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem('pob_token');
      
      if (!token) {
        window.location.href = '/';
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8081/api/accounts?page=0&size=200', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAccounts(response.data.content || []);
        
      } catch (err) {
        console.error("Fetch Error:", err);
        setError('Session expired or unauthorized. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // STEP 2: Filtering Logic
  // This calculates a new list every time 'searchTerm' or 'accounts' changes
  const filteredAccounts = accounts.filter((acc) => {
    const search = searchTerm.toLowerCase();
    return (
      acc.accountHolderName?.toLowerCase().includes(search) ||
      acc.accountNumber?.toLowerCase().includes(search)
    );
  });

  // STEP 3: Dynamic Total Balance
  // Now sums only the accounts currently visible in your search
  const totalBalance = filteredAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Landmark size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
              <p className="text-slate-400 text-sm">Progressive Ozark Bank | Secure Session</p>
            </div>
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
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-600/20 p-2 rounded-lg"><Wallet className="text-blue-500" /></div>
              <span className="text-blue-400 text-xs font-medium uppercase tracking-wider">Net Worth</span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Total Portfolio Balance</p>
            <h3 className="text-2xl font-bold">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Search Input UI */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input 
            type="text"
            placeholder="Search by holder name or account number (e.g. POB-e9aa)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Account Data Table Area */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={20} className="text-blue-500" />
              <h2 className="text-xl font-semibold">Managed Accounts</h2>
            </div>
            <span className="bg-blue-600/10 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-600/20">
              {filteredAccounts.length} Records Found
            </span>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="animate-pulse">Retrieving encrypted account data...</p>
              </div>
            ) : error ? (
              <div className="py-20 flex flex-col items-center justify-center text-red-500 gap-3">
                <AlertCircle size={48} />
                <p className="font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="text-sm flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-md hover:bg-slate-700">
                  <RefreshCcw size={14} /> Retry Connection
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/30 text-slate-400 text-xs uppercase tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Account Number</th>
                      <th className="px-6 py-4 font-semibold">Account Holder</th>
                      <th className="px-6 py-4 font-semibold text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {/* STEP 4: Changed mapping from 'accounts' to 'filteredAccounts' */}
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((account) => (
                        <tr key={account.accountNumber} className="hover:bg-slate-800/20 transition-colors group">
                          <td className="px-6 py-4 font-mono text-sm text-blue-400 group-hover:text-blue-300">
                            {account.accountNumber}
                          </td>
                          <td className="px-6 py-4 text-slate-200 font-medium">
                            {account.accountHolderName}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-green-400 font-bold font-mono">
                              ${account.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                          No matching records found for "{searchTerm}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center text-slate-600 text-xs">
          End-to-End Encrypted Session • Protocol TLS 1.3
        </div>
      </div>
    </div>
  );
}

export default Dashboard;