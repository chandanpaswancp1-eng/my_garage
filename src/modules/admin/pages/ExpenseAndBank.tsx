import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardContent, Button, Badge, Input, Select, Modal, formatNPR } from '../../../components/UI';
import { Trash2, Plus, Download, ArrowDownRight, ArrowUpRight, QrCode, Landmark, Wallet, CheckCircle } from 'lucide-react';
import { ExpenseCategory, LinkedBank, LinkedWallet } from '../../../types';

// ==================== Expense Manager ====================

export const ExpenseManager: React.FC = () => {
  const { expenses, addExpense, deleteExpense } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', amount: 0, category: 'Rent' as ExpenseCategory, date: new Date().toISOString().split('T')[0] });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || newExpense.amount <= 0) return;
    addExpense(newExpense);
    setShowAdd(false);
    setNewExpense({ title: '', amount: 0, category: 'Rent', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Expenses & P&L</h2>
        <Button onClick={() => setShowAdd(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Add Expense
        </Button>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Record New Expense">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Expense Title / Description" required value={newExpense.title} onChange={e => setNewExpense({ ...newExpense, title: e.target.value })} />
          <Input label="Amount (NPR)" type="number" required min="1" value={newExpense.amount || ''} onChange={e => setNewExpense({ ...newExpense, amount: Number(e.target.value) })} />
          <Select
            label="Category"
            value={newExpense.category}
            onChange={e => setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })}
            options={[
              { value: 'Rent', label: 'Rent' },
              { value: 'Utilities', label: 'Utilities (Electricity, Water, Internet)' },
              { value: 'Equipment', label: 'Tools & Equipment' },
              { value: 'Inventory', label: 'Inventory / Parts Purchase' },
              { value: 'Other', label: 'Other Expenses' },
            ]}
          />
          <Input label="Date" type="date" required value={newExpense.date} onChange={e => setNewExpense({ ...newExpense, date: e.target.value })} />
          <Button type="submit" variant="success" className="w-full">Save Expense</Button>
        </form>
      </Modal>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
                  <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm text-slate-500">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-slate-900">{expense.title}</td>
                    <td className="p-4"><Badge variant="info">{expense.category}</Badge></td>
                    <td className="p-4 font-bold text-red-600">{formatNPR(expense.amount)}</td>
                    <td className="p-4">
                      <Button variant="danger" size="sm" onClick={() => deleteExpense(expense.id)}><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No expenses recorded.</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ==================== Bank & Transactions ====================

export const BankAndTransactions: React.FC = () => {
  const { transactions, addTransaction, settings, updateSettings, linkGarageBank, unlinkGarageBank, linkGarageWallet, unlinkGarageWallet } = useApp();
  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [showAddWallet, setShowAddWallet] = useState(false);
  
  const [newBank, setNewBank] = useState({ bankName: '', accountHolder: '', accountNumber: '', isDefault: false });
  const [newWallet, setNewWallet] = useState({ provider: 'eSewa' as LinkedWallet['provider'], phone: '', isDefault: false });
  
  const [newTx, setNewTx] = useState({ date: new Date().toISOString().split('T')[0], description: '', amount: 0, type: 'Credit' as 'Credit' | 'Debit', source: 'Manual' as 'Manual' | 'System' });

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    linkGarageBank(newBank);
    setShowAddBank(false);
    setNewBank({ bankName: '', accountHolder: '', accountNumber: '', isDefault: false });
  };

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    linkGarageWallet(newWallet);
    setShowAddWallet(false);
    setNewWallet({ provider: 'eSewa', phone: '', isDefault: false });
  };
  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || newTx.amount <= 0) return;
    addTransaction(newTx);
    setShowAddTx(false);
    setNewTx({ date: new Date().toISOString().split('T')[0], description: '', amount: 0, type: 'Credit', source: 'Manual' });
  };

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateSettings({ qrCodeUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleExportCSV = () => {
    const csv = ['Date,Description,Source,Type,Amount (NPR)',
      ...[...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(tx => `${tx.date},"${tx.description}",${tx.source},${tx.type},${tx.amount}`)
    ].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const totalBalance = transactions.reduce((acc, tx) => tx.type === 'Credit' ? acc + tx.amount : acc - tx.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Bank & Transactions</h2>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button onClick={handleExportCSV} variant="outline" className="flex-1 sm:flex-none"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
          <Button onClick={() => setShowAddTx(!showAddTx)} className="flex-1 sm:flex-none"><Plus className="w-4 h-4 mr-2" /> Add Manual</Button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <p className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-sm">Available Bank Balance</p>
            <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight">{formatNPR(totalBalance)}</h3>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl border border-white/10"><Landmark className="w-10 h-10 text-blue-400" /></div>
        </div>
      </div>

      {/* Garage Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Linked Bank Accounts</h3>
            <Button size="sm" variant="outline" onClick={() => setShowAddBank(true)}><Plus className="w-4 h-4 mr-2" /> Add Bank</Button>
          </div>
          <CardContent className="p-6 space-y-4">
            {settings.linkedBanks?.map(bank => (
              <div key={bank.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center">
                  <div className="p-2 bg-white rounded-lg shadow-sm mr-3 text-blue-600"><Landmark className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-slate-900">{bank.bankName}</p>
                    <p className="text-xs text-slate-500">{bank.accountNumber}</p>
                  </div>
                </div>
                <button onClick={() => unlinkGarageBank(bank.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
            {(!settings.linkedBanks || settings.linkedBanks.length === 0) && <p className="text-center text-slate-400 py-4 italic">No bank accounts linked.</p>}
          </CardContent>
        </Card>

        <Card>
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Linked Digital Wallets</h3>
            <Button size="sm" variant="outline" onClick={() => setShowAddWallet(true)}><Plus className="w-4 h-4 mr-2" /> Add Wallet</Button>
          </div>
          <CardContent className="p-6 space-y-4">
            {settings.linkedWallets?.map(wallet => (
              <div key={wallet.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center">
                  <div className="p-2 bg-white rounded-lg shadow-sm mr-3 text-amber-600"><Wallet className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-slate-900">{wallet.provider}</p>
                    <p className="text-xs text-slate-500">{wallet.phone}</p>
                  </div>
                </div>
                <button onClick={() => unlinkGarageWallet(wallet.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
            {(!settings.linkedWallets || settings.linkedWallets.length === 0) && <p className="text-center text-slate-400 py-4 italic">No wallets linked.</p>}
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={showAddBank} onClose={() => setShowAddBank(false)} title="Link Garage Bank">
        <form onSubmit={handleAddBank} className="space-y-4">
          <Input label="Bank Name" required value={newBank.bankName} onChange={e => setNewBank({ ...newBank, bankName: e.target.value })} />
          <Input label="Account Holder" required value={newBank.accountHolder} onChange={e => setNewBank({ ...newBank, accountHolder: e.target.value })} />
          <Input label="Account Number" required value={newBank.accountNumber} onChange={e => setNewBank({ ...newBank, accountNumber: e.target.value })} />
          <Button type="submit" className="w-full">Link Account</Button>
        </form>
      </Modal>

      <Modal isOpen={showAddWallet} onClose={() => setShowAddWallet(false)} title="Link Garage Wallet">
        <form onSubmit={handleAddWallet} className="space-y-4">
          <Select 
            label="Provider" 
            options={[{ label: 'eSewa', value: 'eSewa' }, { label: 'Khalti', value: 'Khalti' }, { label: 'IME Pay', value: 'IME Pay' }]} 
            value={newWallet.provider} 
            onChange={val => setNewWallet({ ...newWallet, provider: val as LinkedWallet['provider'] })} 
          />
          <Input label="Phone Number" required value={newWallet.phone} onChange={e => setNewWallet({ ...newWallet, phone: e.target.value })} />
          <Button type="submit" className="w-full">Link Wallet</Button>
        </form>
      </Modal>

      {/* Payment Settings */}
      <Card>
        <div className="px-6 py-5 border-b border-slate-100"><h3 className="text-lg font-semibold text-slate-800">Legacy QR & Bank Details</h3></div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Payment QR Code</label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden flex-shrink-0">
                {settings.qrCodeUrl ? <img src={settings.qrCodeUrl} alt="QR" className="w-full h-full object-contain" /> : <QrCode className="w-8 h-8 text-slate-400" />}
              </div>
              <div className="flex-1">
                <input type="file" accept="image/*" onChange={handleQRUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" />
                <p className="text-xs text-slate-400 mt-2">Fonepay, eSewa, or Khalti QR code.</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bank Details Text</label>
            <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all text-sm" rows={5} value={settings.bankDetails} onChange={e => updateSettings({ bankDetails: e.target.value })} />
          </div>
        </div>
      </Card>

      {/* Add Transaction Form */}
      {showAddTx && (
        <Card>
          <div className="px-6 py-5 border-b border-slate-100"><h3 className="text-lg font-semibold text-slate-800">Record Manual Transaction</h3></div>
          <div className="p-6">
            <form onSubmit={handleAddTx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Date" type="date" required value={newTx.date} onChange={e => setNewTx({ ...newTx, date: e.target.value })} />
              <Select label="Transaction Type" value={newTx.type} onChange={e => setNewTx({ ...newTx, type: e.target.value as 'Credit' | 'Debit' })} options={[{ value: 'Credit', label: 'Money In (Credit)' }, { value: 'Debit', label: 'Money Out (Debit)' }]} />
              <Input label="Description" required value={newTx.description} onChange={e => setNewTx({ ...newTx, description: e.target.value })} placeholder="e.g., Owner Capital Injection" />
              <Input label="Amount (NPR)" type="number" required min="1" value={newTx.amount || ''} onChange={e => setNewTx({ ...newTx, amount: Number(e.target.value) })} />
              <div className="md:col-span-2"><Button type="submit" variant="success" className="w-full sm:w-auto">Save Transaction</Button></div>
            </form>
          </div>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <div className="px-6 py-5 border-b border-slate-100"><h3 className="text-lg font-semibold text-slate-800">Transaction History</h3></div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                  <th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Description</th><th className="p-4 font-medium">Source</th><th className="p-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm text-slate-500">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-slate-900">
                      <div className="flex items-center">
                        {tx.type === 'Credit' ? <ArrowDownRight className="w-4 h-4 text-emerald-500 mr-2" /> : <ArrowUpRight className="w-4 h-4 text-red-500 mr-2" />}
                        {tx.description}
                      </div>
                    </td>
                    <td className="p-4"><Badge variant={tx.source === 'System' ? 'info' : 'default'}>{tx.source}</Badge></td>
                    <td className={`p-4 font-bold text-right ${tx.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'Credit' ? '+' : '-'}{formatNPR(tx.amount)}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">No transactions recorded.</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
