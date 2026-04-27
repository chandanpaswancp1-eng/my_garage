import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardContent, Button, Badge, Input, Modal, formatNPR } from '../../../components/UI';
import { Plus, Trash2 } from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const { parts, addPart, updatePartStock, deletePart } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newPart, setNewPart] = useState({ name: '', category: '', price: 0, stock: 0 });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addPart(newPart);
    setShowAdd(false);
    setNewPart({ name: '', category: '', price: 0, stock: 0 });
  };

  const lowStockParts = parts.filter(p => p.stock <= 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
        <Button onClick={() => setShowAdd(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Add New Part
        </Button>
      </div>

      {lowStockParts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 font-semibold text-sm mb-1">⚠ Low Stock Alert</p>
          <p className="text-amber-700 text-sm">{lowStockParts.map(p => `${p.name} (${p.stock} left)`).join(', ')}</p>
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Part">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Part Name" required value={newPart.name} onChange={e => setNewPart({ ...newPart, name: e.target.value })} />
          <Input label="Category" required value={newPart.category} onChange={e => setNewPart({ ...newPart, category: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (NPR)" type="number" required value={newPart.price || ''} onChange={e => setNewPart({ ...newPart, price: Number(e.target.value) })} />
            <Input label="Initial Stock" type="number" required value={newPart.stock || ''} onChange={e => setNewPart({ ...newPart, stock: Number(e.target.value) })} />
          </div>
          <Button type="submit" className="w-full">Save Part</Button>
        </form>
      </Modal>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                  <th className="p-4 font-medium">Part Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parts.map(part => (
                  <tr key={part.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{part.name}</td>
                    <td className="p-4 text-sm text-slate-500">{part.category}</td>
                    <td className="p-4 text-sm font-medium text-slate-700">{formatNPR(part.price)}</td>
                    <td className="p-4">
                      <Badge variant={part.stock > 10 ? 'success' : part.stock > 0 ? 'warning' : 'danger'}>{part.stock} units</Badge>
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => updatePartStock(part.id, part.stock + 10)}>+10 Stock</Button>
                      <Button variant="danger" size="sm" onClick={() => deletePart(part.id)}><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
                {parts.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No parts found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
