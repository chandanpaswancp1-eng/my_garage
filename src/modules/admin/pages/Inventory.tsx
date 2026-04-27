import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Button, Input, Badge, formatNPR } from '../../../components/UI';
import { Trash2 } from 'lucide-react';

export const InventoryManager = () => {
  const { parts, addPart, updatePartStock, deletePart } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newPart, setNewPart] = useState({ name: '', category: '', price: 0, stock: 0 });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addPart(newPart);
    setShowAdd(false);
    setNewPart({ name: '', category: '', price: 0, stock: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
        <Button onClick={() => setShowAdd(!showAdd)} className="w-full sm:w-auto">{showAdd ? 'Cancel' : 'Add New Part'}</Button>
      </div>

      {showAdd && (
        <Card className="animate-in fade-in slide-in-from-top-4">
          <CardHeader title="Add New Part" />
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Part Name" required value={newPart.name} onChange={e => setNewPart({...newPart, name: e.target.value})} />
              <Input label="Category" required value={newPart.category} onChange={e => setNewPart({...newPart, category: e.target.value})} />
              <Input label="Price (NPR)" type="number" required value={newPart.price || ''} onChange={e => setNewPart({...newPart, price: Number(e.target.value)})} />
              <Input label="Initial Stock" type="number" required value={newPart.stock || ''} onChange={e => setNewPart({...newPart, stock: Number(e.target.value)})} />
              <div className="md:col-span-2">
                <Button type="submit" className="w-full sm:w-auto">Save Part</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 font-semibold">Part Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold text-center">Stock</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parts.map(part => (
                  <tr key={part.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{part.name}</td>
                    <td className="p-4 text-sm text-slate-500">{part.category}</td>
                    <td className="p-4 text-sm font-semibold">{formatNPR(part.price)}</td>
                    <td className="p-4 text-center">
                      <Badge variant={part.stock > 10 ? 'success' : part.stock > 0 ? 'warning' : 'danger'}>{part.stock}</Badge>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => updatePartStock(part.id, part.stock + 10)}>+10</Button>
                      <Button variant="danger" size="sm" onClick={() => deletePart(part.id)}><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
                {parts.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No parts in inventory.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
