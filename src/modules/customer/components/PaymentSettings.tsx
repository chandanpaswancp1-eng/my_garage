import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardContent, Button, Badge, Input, Select, Modal } from '../../../components/UI';
import { Landmark, Plus, Trash2, Wallet } from 'lucide-react';
import { LinkedBank, LinkedWallet } from '../../../types';

export const PaymentSettings: React.FC = () => {
  const { currentUser, linkBank, unlinkBank, linkWallet, unlinkWallet } = useApp();
  const [showAddBank, setShowAddBank] = useState(false);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [newBank, setNewBank] = useState({ bankName: '', accountHolder: '', accountNumber: '', isDefault: false });
  const [newWallet, setNewWallet] = useState({ provider: 'eSewa' as LinkedWallet['provider'], phone: '', isDefault: false });

  if (!currentUser) return null;

  const handleLinkBank = (e: React.FormEvent) => {
    e.preventDefault();
    linkBank(currentUser.id, newBank);
    setShowAddBank(false);
    setNewBank({ bankName: '', accountHolder: '', accountNumber: '', isDefault: false });
  };

  const handleLinkWallet = (e: React.FormEvent) => {
    e.preventDefault();
    linkWallet(currentUser.id, newWallet);
    setShowAddWallet(false);
    setNewWallet({ provider: 'eSewa', phone: '', isDefault: false });
  };

  return (
    <div className="space-y-10 fade-in-up">
      {/* Linked Banks Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Bank Accounts</h2>
            <p className="text-sm text-slate-500">Manage your linked bank accounts for secure payments.</p>
          </div>
          <Button onClick={() => setShowAddBank(true)}>
            <Plus className="w-4 h-4 mr-2" /> Link Bank
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentUser.linkedBanks?.map((bank: LinkedBank) => (
            <Card key={bank.id} className="relative group border-slate-200 hover:border-primary/50 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Landmark className="w-6 h-6 text-primary" />
                  </div>
                  <button onClick={() => unlinkBank(currentUser.id, bank.id)} className="text-slate-300 hover:text-red-500 p-1">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">{bank.bankName}</p>
                  <p className="text-sm text-slate-500 font-medium mb-4">{bank.accountNumber.replace(/.(?=.{4})/g, '*')}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{bank.accountHolder}</p>
                    {bank.isDefault && <Badge variant="success">Default</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!currentUser.linkedBanks || currentUser.linkedBanks.length === 0) && (
            <div className="md:col-span-2 py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">No bank accounts linked.</p>
            </div>
          )}
        </div>
      </section>

      {/* Linked Wallets Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Digital Wallets</h2>
            <p className="text-sm text-slate-500">Fast and easy payments via mobile wallets.</p>
          </div>
          <Button variant="outline" onClick={() => setShowAddWallet(true)}>
            <Plus className="w-4 h-4 mr-2" /> Link Wallet
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentUser.linkedWallets?.map((wallet: LinkedWallet) => (
            <Card key={wallet.id} className="relative group border-slate-200 hover:border-amber-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <Wallet className="w-6 h-6 text-amber-600" />
                  </div>
                  <button onClick={() => unlinkWallet(currentUser.id, wallet.id)} className="text-slate-300 hover:text-red-500 p-1">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">{wallet.provider}</p>
                  <p className="text-sm text-slate-500 font-medium mb-4">{wallet.phone.replace(/.(?=.{3})/g, '*')}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="info">Wallet</Badge>
                    {wallet.isDefault && <Badge variant="success">Default</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!currentUser.linkedWallets || currentUser.linkedWallets.length === 0) && (
            <div className="md:col-span-2 py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">No wallets linked.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <Modal isOpen={showAddBank} onClose={() => setShowAddBank(false)} title="Link Bank Account">
        <form onSubmit={handleLinkBank} className="space-y-4">
          <Input label="Bank Name" required value={newBank.bankName} onChange={e => setNewBank({ ...newBank, bankName: e.target.value })} />
          <Input label="Account Holder" required value={newBank.accountHolder} onChange={e => setNewBank({ ...newBank, accountHolder: e.target.value })} />
          <Input label="Account Number" required value={newBank.accountNumber} onChange={e => setNewBank({ ...newBank, accountNumber: e.target.value })} />
          <div className="flex items-center gap-2"><input type="checkbox" checked={newBank.isDefault} onChange={e => setNewBank({ ...newBank, isDefault: e.target.checked })} /> Set as default</div>
          <Button type="submit" className="w-full">Link Account</Button>
        </form>
      </Modal>

      <Modal isOpen={showAddWallet} onClose={() => setShowAddWallet(false)} title="Link Digital Wallet">
        <form onSubmit={handleLinkWallet} className="space-y-4">
          <Select 
            label="Provider" 
            options={[{ label: 'eSewa', value: 'eSewa' }, { label: 'Khalti', value: 'Khalti' }, { label: 'IME Pay', value: 'IME Pay' }]} 
            value={newWallet.provider} 
            onChange={val => setNewWallet({ ...newWallet, provider: val as LinkedWallet['provider'] })} 
          />
          <Input label="Phone Number" required value={newWallet.phone} onChange={e => setNewWallet({ ...newWallet, phone: e.target.value })} />
          <div className="flex items-center gap-2"><input type="checkbox" checked={newWallet.isDefault} onChange={e => setNewWallet({ ...newWallet, isDefault: e.target.checked })} /> Set as default</div>
          <Button type="submit" className="w-full">Link Wallet</Button>
        </form>
      </Modal>
    </div>
  );
};
