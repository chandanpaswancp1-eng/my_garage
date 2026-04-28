import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardContent, Button, Input, Modal } from '../../../components/UI';
import { UserPlus, Plus, Edit2, Trash2, History } from 'lucide-react';
import { User, Vehicle } from '../../../types';

export const CustomerManager = () => {
  const { users, vehicles, addCustomer, addVehicle, updateCustomer, updateVehicle, deleteCustomer, deleteVehicle } = useApp();
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showEditVehicle, setShowEditVehicle] = useState(false);
  
  // Delete Confirmation State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<'customer' | 'vehicle' | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string } | null>(null);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', vatNumber: '' });
  const [editCustomerData, setEditCustomerData] = useState({ name: '', phone: '', email: '', vatNumber: '' });
  const [newVehicle, setNewVehicle] = useState({ model: '', number: '', nextServiceKM: '' });
  const [editVehicleData, setEditVehicleData] = useState({ model: '', number: '', nextServiceKM: '' });

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedCustomerForLogs, setSelectedCustomerForLogs] = useState<User | null>(null);

  const customers = users.filter(u => u.role === 'customer');

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(newCustomer);
    setShowAddCustomer(false);
    setNewCustomer({ name: '', phone: '', email: '', vatNumber: '' });
  };

  const handleEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, editCustomerData);
      setShowEditCustomer(false);
      setSelectedCustomer(null);
    }
  };

  const confirmDeleteCustomer = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteType('customer');
    setShowDeleteConfirm(true);
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle({ 
      ...newVehicle, 
      customerId: selectedCustomerId,
      nextServiceKM: newVehicle.nextServiceKM ? Number(newVehicle.nextServiceKM) : undefined
    });
    setShowAddVehicle(false);
    setNewVehicle({ model: '', number: '', nextServiceKM: '' });
  };

  const handleEditVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVehicle) {
      updateVehicle(selectedVehicle.id, {
        ...editVehicleData,
        nextServiceKM: editVehicleData.nextServiceKM ? Number(editVehicleData.nextServiceKM) : undefined
      });
      setShowEditVehicle(false);
      setSelectedVehicle(null);
    }
  };

  const confirmDeleteVehicle = (id: string, model: string) => {
    setItemToDelete({ id, name: model });
    setDeleteType('vehicle');
    setShowDeleteConfirm(true);
  };

  const executeDelete = () => {
    if (!itemToDelete || !deleteType) return;
    
    if (deleteType === 'customer') {
      deleteCustomer(itemToDelete.id);
    } else {
      deleteVehicle(itemToDelete.id);
    }
    
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setDeleteType(null);
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
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="p-4 font-medium">Customer Name</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Vehicles</th>
                  <th className="p-4 font-medium">Last Login</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map(customer => {
                  const customerVehicles = vehicles.filter(v => v.customerId === customer.id);
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50/50 group">
                      <td className="p-4 font-medium text-gray-900">{customer.name}</td>
                      <td className="p-4 text-sm text-gray-500">
                        <p>{customer.phone}</p>
                        <p className="truncate max-w-[150px]">{customer.email}</p>
                      </td>
                      <td className="p-4 text-sm">
                        {customerVehicles.length > 0 ? (
                          <div className="space-y-2">
                            {customerVehicles.map(v => (
                              <div key={v.id} className="flex items-center space-x-2 bg-gray-50 px-2 py-1 rounded border border-gray-100 w-fit max-w-[300px] group/v">
                                <div className="flex-1 min-w-0">
                                  <p className="truncate font-medium">{v.model} ({v.number})</p>
                                  {v.nextServiceKM && <p className="text-[10px] text-blue-600 font-bold uppercase">Next Service: {v.nextServiceKM} KM</p>}
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover/v:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => {
                                      setSelectedVehicle(v);
                                      setEditVehicleData({ 
                                        model: v.model, 
                                        number: v.number, 
                                        nextServiceKM: v.nextServiceKM ? v.nextServiceKM.toString() : ''
                                      });
                                      setShowEditVehicle(true);
                                    }}
                                    className="text-gray-400 hover:text-blue-600 p-1"
                                    title="Edit Vehicle"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button 
                                    onClick={() => confirmDeleteVehicle(v.id, v.model)}
                                    className="text-gray-400 hover:text-red-600 p-1"
                                    title="Delete Vehicle"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : <span className="text-gray-400 italic">No vehicles registered</span>}
                      </td>
                       <td className="p-4 text-sm text-gray-500">
                        {customer.lastLogin ? (
                          <>
                            <p className="font-medium text-slate-700">{new Date(customer.lastLogin).toLocaleDateString()}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(customer.lastLogin).toLocaleTimeString()}</p>
                          </>
                        ) : <span className="text-slate-400 italic">Never</span>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedCustomerForLogs(customer);
                              setShowActivityModal(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-white rounded-md transition-all border border-transparent hover:border-slate-200"
                            title="View Activity Logs"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          <Button size="sm" variant="outline" onClick={() => { setSelectedCustomerId(customer.id); setShowAddVehicle(true); }}>
                            <Plus className="w-4 h-4 mr-1" /> Vehicle
                          </Button>
                          <div className="flex items-center space-x-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
                            <button 
                              onClick={() => { 
                                setSelectedCustomer(customer); 
                                setEditCustomerData({ name: customer.name, phone: customer.phone, email: customer.email || '', vatNumber: customer.vatNumber || '' });
                                setShowEditCustomer(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-md transition-all"
                              title="Edit Customer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => confirmDeleteCustomer(customer.id, customer.name)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-md transition-all"
                              title="Delete Customer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {customers.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">No customers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Deletion">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-800">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-bold">Are you absolutely sure?</p>
              <p className="text-sm opacity-90">
                You are about to delete <span className="font-bold underline">{itemToDelete?.name}</span>.
                {deleteType === 'customer' && " This will also permanently remove all their vehicles and service history."}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={executeDelete}>Yes, Delete it</Button>
          </div>
        </div>
      </Modal>

      {/* Add Customer Modal */}
      <Modal isOpen={showAddCustomer} onClose={() => setShowAddCustomer(false)} title="Add New Customer">
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <Input label="Full Name" required value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
          <Input label="Phone Number" required value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
          <Input label="Email (Optional)" type="email" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
          <Input label="VAT / PAN Number (Optional)" value={newCustomer.vatNumber} onChange={e => setNewCustomer({...newCustomer, vatNumber: e.target.value})} />
          <Button type="submit" className="w-full">Save Customer</Button>
        </form>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal isOpen={showEditCustomer} onClose={() => setShowEditCustomer(false)} title="Edit Customer">
        <form onSubmit={handleEditCustomer} className="space-y-4">
          <Input label="Full Name" required value={editCustomerData.name} onChange={e => setEditCustomerData({...editCustomerData, name: e.target.value})} />
          <Input label="Phone Number" required value={editCustomerData.phone} onChange={e => setEditCustomerData({...editCustomerData, phone: e.target.value})} />
          <Input label="Email (Optional)" type="email" value={editCustomerData.email} onChange={e => setEditCustomerData({...editCustomerData, email: e.target.value})} />
          <Input label="VAT / PAN Number (Optional)" value={editCustomerData.vatNumber} onChange={e => setEditCustomerData({...editCustomerData, vatNumber: e.target.value})} />
          <Button type="submit" className="w-full">Update Customer</Button>
        </form>
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal isOpen={showAddVehicle} onClose={() => setShowAddVehicle(false)} title="Add Vehicle">
        <form onSubmit={handleAddVehicle} className="space-y-4">
          <Input label="Vehicle Model (e.g., Hyundai Creta)" required value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
          <Input label="Vehicle Number (e.g., BA 21 PA 1234)" required value={newVehicle.number} onChange={e => setNewVehicle({...newVehicle, number: e.target.value})} />
          <Input label="Next Service Due (Kilometer)" type="number" value={newVehicle.nextServiceKM} onChange={e => setNewVehicle({...newVehicle, nextServiceKM: e.target.value})} />
          <Button type="submit" className="w-full">Save Vehicle</Button>
        </form>
      </Modal>

      {/* Edit Vehicle Modal */}
      <Modal isOpen={showEditVehicle} onClose={() => setShowEditVehicle(false)} title="Edit Vehicle">
        <form onSubmit={handleEditVehicle} className="space-y-4">
          <Input label="Vehicle Model" required value={editVehicleData.model} onChange={e => setEditVehicleData({...editVehicleData, model: e.target.value})} />
          <Input label="Vehicle Number" required value={editVehicleData.number} onChange={e => setEditVehicleData({...editVehicleData, number: e.target.value})} />
          <Input label="Next Service Due (Kilometer)" type="number" value={editVehicleData.nextServiceKM} onChange={e => setEditVehicleData({...editVehicleData, nextServiceKM: e.target.value})} />
          <Button type="submit" className="w-full">Update Vehicle</Button>
        </form>
      </Modal>
      <Modal isOpen={showActivityModal} onClose={() => setShowActivityModal(false)} title={`Activity History: \${selectedCustomerForLogs?.name}`}>
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {selectedCustomerForLogs?.activityLogs && selectedCustomerForLogs.activityLogs.length > 0 ? (
            selectedCustomerForLogs.activityLogs.map((log) => (
              <div key={log.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-900">{log.action}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600">{log.details}</p>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium italic">No activity recorded for this customer yet.</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
