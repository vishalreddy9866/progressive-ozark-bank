import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { 
    LayoutDashboard, Wallet, LogOut, Landmark, Loader2, 
    RefreshCcw, Search, Plus, X, Trash2, ArrowRightLeft, 
    History, Pencil, AlertCircle 
} from 'lucide-react';

function Dashboard() {
  // 1. STATE MANAGEMENT
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals & Sidebars
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [viewHistory, setViewHistory] = useState(null);

  // Data States
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [transactions, setTransactions] = useState([]);
  
  const [newAccount, setNewAccount] = useState({ accountHolderName: '', balance: '' });
  const [transferData, setTransferData] = useState({ fromId: null, fromName: '', toId: '', amount: '' });

  const handleLogout = () => {
    localStorage.removeItem('pob_token');
    window.location.href = '/'; 
  };

  // 2. FETCH LOGIC
  const fetchAccounts = async () => {
    const token = localStorage.getItem('pob_token');
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/accounts?page=${currentPage}&size=10&sort=id,desc`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      toast.error("Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, [currentPage]);

  // 3. CORE ACTIONS (Create, Delete, Transfer, Edit, History)
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (parseFloat(newAccount.balance) < 0) return toast.error("Balance cannot be negative.");
    
    try {
      await axios.post('http://localhost:8081/api/accounts', {
        ...newAccount,
        accountNumber: `POB-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        status: 'ACTIVE',
        balance: parseFloat(newAccount.balance)
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('pob_token')}` }});
      
      toast.success('Account Created!');
      setIsModalOpen(false);
      setNewAccount({ accountHolderName: '', balance: '' });
      fetchAccounts();
    } catch (err) { toast.error("Creation failed."); }
  };

  const handleDeleteAccount = async (id, name) => {
    if (!window.confirm(`Close account for ${name}?`)) return;
    try {
      await axios.delete(`http://localhost:8081/api/accounts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('pob_token')}` }
      });
      toast.success("Account Closed.");
      fetchAccounts(); 
    } catch (err) { toast.error("Delete failed."); }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8081/api/accounts/transfer?from=${transferData.fromId}&to=${transferData.toId}&amount=${transferData.amount}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('pob_token')}` }
      });
      toast.success("Transfer Successful!");
      setIsTransferModalOpen(false);
      fetchAccounts();
    } catch (err) { 
        const errorMessage = err.response?.data?.message || err.response?.data?.error || "Transfer Failed: Check recipient ID";
        toast.error(errorMessage); }
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/api/accounts/${editAccount.id}`, editAccount, {
        headers: { Authorization: `Bearer ${localStorage.getItem('pob_token')}` }
      });
      toast.success("Name updated!");
      setEditAccount(null);
      fetchAccounts();
    } catch (err) { toast.error("Update failed."); }
  };

  const fetchHistory = async (acc) => {
    setViewHistory(acc);
    try {
        const res = await axios.get(`http://localhost:8081/api/accounts/${acc.id}/transactions`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('pob_token')}` }
        });
        setTransactions(res.data);
    } catch (err) { toast.error("Could not load history."); }
  };

  const filteredAccounts = accounts.filter(acc => 
    (acc.accountHolderName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }}} />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg"><Landmark size={24} /></div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
              <p className="text-slate-400 text-sm">Progressive Ozark Bank | Secure Session</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold shadow-lg shadow-blue-600/20"><Plus size={18} /> New Account</button>
            <button onClick={handleLogout} className="bg-slate-900 border border-slate-800 p-2 px-4 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all flex items-center gap-2"
            ><LogOut size={18} /> <span>Logout</span></button>  </div>
       </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between mb-2"><Wallet className="text-blue-500" /><span className="text-xs text-blue-400 font-bold uppercase">Net Worth</span></div>
            <h3 className="text-2xl font-bold">${filteredAccounts.reduce((s, a) => s + (a.balance || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
          <div className="md:col-span-2 relative flex items-center">
            <Search className="absolute left-4 text-slate-500" size={20} />
            <input placeholder="Search accounts..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-xl font-semibold flex items-center gap-2"><LayoutDashboard className="text-blue-500" size={20} /> Managed Accounts</h2>
            <button onClick={fetchAccounts} className="text-slate-500 hover:text-white"><RefreshCcw size={18} className={loading ? "animate-spin" : ""} /></button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest border-b border-slate-800">
                <tr>
                    <th className="p-4 px-6 font-semibold">ID</th> 
                    <th className="p-4 px-6">Account</th>
                    <th className="p-4">Holder</th>
                    <th className="p-4 text-right">Balance</th>
                    <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAccounts.map((acc) => (
                  <tr key={acc.accountNumber} className="hover:bg-slate-800/30 group transition-all">
                    <td className="p-4 px-6 text-slate-500 text-xs">#{acc.id}</td>
                    <td className="p-4 px-6 font-mono text-blue-400">{acc.accountNumber}</td>
                    <td className="p-4 text-slate-200 font-medium">{acc.accountHolderName}</td>
                    <td className="p-4 px-6 text-right text-green-400 font-bold font-mono">${(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="p-4 text-center flex justify-center gap-2">
                        <button onClick={() => fetchHistory(acc)} className="p-2 hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 rounded-lg transition-colors"><History size={18}/></button>
                        <button onClick={() => { setTransferData({ ...transferData, fromId: acc.id, fromName: acc.accountHolderName }); setIsTransferModalOpen(true); }} className="p-2 hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 rounded-lg" title="Transfer"><ArrowRightLeft size={18} /></button>
                        <button onClick={() => setEditAccount(acc)} className="p-2 hover:bg-amber-500/10 text-slate-500 hover:text-amber-400 rounded-lg"><Pencil size={18}/></button>
                        <button onClick={() => handleDeleteAccount(acc.id, acc.accountHolderName)} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-lg"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-900/50">
            <span className="text-xs text-slate-500">Page {currentPage + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-30">Previous</button>
              <button disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 bg-blue-600 rounded-lg disabled:opacity-30">Next</button>
            </div>
          </div>
        </div>

        {/* --- TRANSFER MODAL --- */}
        {isTransferModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in duration-200">
              <button onClick={() => setIsTransferModalOpen(false)} className="absolute right-6 top-6 text-slate-500"><X size={24} /></button>
              <h2 className="text-2xl font-bold mb-2">Internal Transfer</h2>
              <p className="text-slate-400 text-sm mb-6">Source: <span className="text-blue-400 font-bold">{transferData.fromName}</span></p>
              <form onSubmit={handleTransfer} className="space-y-5">
                <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 outline-none focus:border-blue-500" placeholder="Recipient ID (e.g. 201)" value={transferData.toId} onChange={(e) => setTransferData({...transferData, toId: e.target.value})} />
                <input required type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 outline-none focus:border-blue-500" placeholder="Amount ($)" value={transferData.amount} onChange={(e) => setTransferData({...transferData, amount: e.target.value})} />
                <button type="submit" className="w-full bg-blue-600 py-4 rounded-xl font-bold">Confirm Transfer</button>
              </form>
            </div>
          </div>
        )}

        {/* --- EDIT MODAL --- */}
        {editAccount && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8 relative">
              <button onClick={() => setEditAccount(null)} className="absolute right-6 top-6 text-slate-500"><X size={24}/></button>
              <h2 className="text-2xl font-bold mb-4">Edit Holder</h2>
              <form onSubmit={handleUpdateAccount} className="space-y-4">
                <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-blue-500" value={editAccount.accountHolderName} onChange={(e) => setEditAccount({...editAccount, accountHolderName: e.target.value})} />
                <button type="submit" className="w-full bg-amber-600 py-3 rounded-xl font-bold">Save Changes</button>
              </form>
            </div>
          </div>
        )}

        {/* --- HISTORY SIDEBAR --- */}
        {viewHistory && (
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 shadow-2xl p-8 animate-in slide-in-from-right duration-300">
            <button onClick={() => setViewHistory(null)} className="absolute right-6 top-6 text-slate-500"><X size={24}/></button>
            <h2 className="text-2xl font-bold mb-2">Transaction History</h2>
            <p className="text-blue-400 font-mono mb-8">{viewHistory.accountNumber}</p>
            <div className="space-y-4">
              {transactions.length > 0 ? transactions.map((t, i) => (
                <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">{t.description}</span>
                    <span className={`font-bold ${t.type === 'CREDIT' ? 'text-green-400' : 'text-red-400'}`}>
                        {t.type === 'CREDIT' ? '+' : '-'}${t.amount}
                    </span>
                  </div>
                </div>
              )) : <p className="text-slate-500 text-center py-20 italic">No history found.</p>}
            </div>
          </div>
        )}

        {/* --- CREATE MODAL --- */}
        {isModalOpen && (
           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-slate-500"><X size={24} /></button>
              <h2 className="text-2xl font-bold mb-6">Open New Account</h2>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none" placeholder="Full Name" value={newAccount.accountHolderName} onChange={(e) => setNewAccount({...newAccount, accountHolderName: e.target.value})} />
                <input required type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none" placeholder="Initial Balance" value={newAccount.balance} onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})} />
                <button type="submit" className="w-full bg-blue-600 py-4 rounded-xl font-bold mt-4">Authorize & Create</button>
              </form>
            </div>
           </div>
        )}

        <div className="mt-12 text-center text-slate-700 text-xs uppercase tracking-widest">End-to-End Encrypted Session • TLS 1.3 • AES-256</div>
      </div>
    </div>
  );
}

export default Dashboard;