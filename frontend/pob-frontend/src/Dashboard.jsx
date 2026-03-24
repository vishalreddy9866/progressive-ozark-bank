import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Fixed: Merged imports into one clean block
import { 
    LayoutDashboard, 
    Wallet, 
    LogOut, 
    Landmark, 
    Loader2, 
    AlertCircle, 
    RefreshCcw, 
    Search, 
    Plus, 
    X, 
    Trash2 
} from 'lucide-react';

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    accountHolderName: '',
    accountType: 'SAVINGS',
    balance: ''
  });

  const handleLogout = () => {
    localStorage.removeItem('pob_token');
    window.location.href = '/'; 
  };

  const fetchAccounts = async () => {
    const token = localStorage.getItem('pob_token');
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/accounts?page=0&size=200&sort=id,desc', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data.content || response.data);
    } catch (err) {
      console.error("API ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id, name) => {
    if (!window.confirm(`Are you sure you want to close the account for ${name}?`)) {
      return;
    }
  
    const token = localStorage.getItem('pob_token');
    try {
      await axios.delete(`http://localhost:8081/api/accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAccounts(); 
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Could not delete account. Ensure backend @DeleteMapping is set up.");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pob_token');
    try {
      const payload = {
        ...newAccount,
        accountNumber: `POB-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        status: 'ACTIVE',
        balance: parseFloat(newAccount.balance)
      };

      await axios.post('http://localhost:8081/api/accounts', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsModalOpen(false); 
      setNewAccount({ accountHolderName: '', accountType: 'SAVINGS', balance: '' }); 
      fetchAccounts(); 
    } catch (err) {
      console.error("Create Error:", err);
      alert("Failed to create account.");
    }
  };

  const filteredAccounts = accounts.filter(acc => 
    (acc.accountHolderName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (acc.accountNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPortfolio = filteredAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg"><Landmark size={24} /></div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
              <p className="text-slate-400 text-sm">Progressive Ozark Bank | Secure Session</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-all font-semibold shadow-lg shadow-blue-600/20"
            >
              <Plus size={18} /> New Account
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 px-4 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 text-slate-400 hover:text-red-500 transition-all">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Stats & Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="text-blue-500" />
              <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">Net Worth</span>
            </div>
            <h3 className="text-2xl font-bold">
              ${totalPortfolio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          
          <div className="md:col-span-2 relative flex items-center">
            <Search className="absolute left-4 text-slate-500" size={20} />
            <input 
              type="text"
              placeholder="Search by holder name or account number..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Main Table Area */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <LayoutDashboard className="text-blue-500" size={20} /> Managed Accounts
            </h2>
            <div className="flex items-center gap-4">
               <span className="text-xs text-slate-500">{filteredAccounts.length} Records</span>
               <button onClick={fetchAccounts} className="text-slate-500 hover:text-white transition-all">
                <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" size={48} /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest border-b border-slate-800">
                  <tr>
                    <th className="p-4 px-6 font-semibold">Account Number</th>
                    <th className="p-4 font-semibold">Holder</th>
                    <th className="p-4 px-6 text-right font-semibold">Balance</th>
                    <th className="p-4 text-center font-semibold">Actions</th> 
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((acc) => (
                      <tr key={acc.accountNumber} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="p-4 px-6 font-mono text-blue-400 group-hover:text-blue-300">{acc.accountNumber}</td>
                        <td className="p-4 text-slate-200 font-medium">{acc.accountHolderName || "Standard Customer"}</td>
                        <td className="p-4 px-6 text-right text-green-400 font-bold font-mono">
                          ${acc.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                            <button 
                                // Fixed: using 'acc' instead of 'account'
                                onClick={() => handleDeleteAccount(acc.id, acc.accountHolderName)}
                                className="text-slate-500 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                title="Close Account"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      {/* Fixed: colSpan set to 4 */}
                      <td colSpan="4" className="p-12 text-center text-slate-600 italic">No matching records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal remains the same... */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-6">Open New Account</h2>
              <form onSubmit={handleCreateAccount} className="space-y-5">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                  <input 
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g. Maria Rodriguez"
                    value={newAccount.accountHolderName}
                    onChange={(e) => setNewAccount({...newAccount, accountHolderName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Opening Deposit ($)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 outline-none focus:border-blue-500 transition-colors"
                    placeholder="0.00"
                    value={newAccount.balance}
                    onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all mt-4 shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                  Authorize & Create
                </button>
              </form>
            </div>
          </div>
        )}
        
        <div className="mt-12 text-center text-slate-700 text-xs uppercase tracking-widest">
          End-to-End Encrypted Session • TLS 1.3 • AES-256
        </div>
      </div>
    </div>
  );
}

export default Dashboard;