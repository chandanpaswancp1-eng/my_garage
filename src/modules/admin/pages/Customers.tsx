import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardContent, Button, Input, Modal } from '../../../components/UI';
import { UserPlus, Plus } from 'lucide-react';

export const CustomerManager = () => {
  const { users, vehicles, addCustomer, addVehicle } = useApp();
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });
  const [newVehicle, setNewVehicle] = useState({ model: '', number: '' });

  const customers = users.filter(u => u.role === 'customer');

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(newCustomer);
    setShowAddCustomer(false);
    setNewCustomer({ name: '', phone: '', email: '' });
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle({ ...newVehicle, customerId: selectedCustomerId });
    setShowAddVehicle(false);
    setNewVehicle({ model: '', number: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Customers & Vehicles</h2>
        <Button onClick={() => setShowAddCustomer(true)} className="w-full sm:w-auto"><UserPlus className="w-4 h-4 mr-2" /> Add Customer</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="p-4 font-medium">Customer Name</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Vehicles</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map(customer => {
                  const customerVehicles = vehicles.filter(v => v.customerId === customer.id);
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-medium text-gray-900">{customer.name}</td>
                      <td className="p-4 text-sm text-gray-500">
                        <p>{customer.phone}</p>
                        <p className="truncate max-w-[150px]">{customer.email}</p>
                      </td>
                      <td className="p-4 text-sm">
                        {customerVehicles.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {customerVehicles.map(v => <li key={v.id} className="truncate max-w-[200px]">{v.model} ({v.number})</li>)}
                          </ul>
                        ) : <span className="text-gray-400 italic">No vehicles registered</span>}
                      </td>
                      <td className="p-4 text-right">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedCustomerId(customer.id); setShowAddVehicle(true); }}>
                          <Plus className="w-4 h-4 mr-1" /> Add Vehicle
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {customers.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500">No customers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showAddCustomer} onClose={() => setShowAddCustomer(false)} title="Add New Customer">
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <Input label="Full Name" required value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
          <Input label="Phone Number" required value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
          <Input label="Email (Optional)" type="email" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
          <Button type="submit" className="w-full">Save Customer</Button>
        </form>
      </Modal>

      <Modal isOpen={showAddVehicle} onClose={() => setShowAddVehicle(false)} title="Add Vehicle">
        <form onSubmit={handleAddVehicle} className="space-y-4">
          <Input label="Vehicle Model (e.g., Hyundai Creta)" required value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
          <Input label="Vehicle Number (e.g., BA 21 PA 1234)" required value={newVehicle.number} onChange={e => setNewVehicle({...newVehicle, number: e.target.value})} />
          <Button type="submit" className="w-full">Save Vehicle</Button>
        </form>
      </Modal>
    </div>
  );
};
