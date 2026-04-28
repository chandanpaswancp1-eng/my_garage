import React, { useState } from 'react';
import { Modal, Button, Select, Input } from '../../../components/UI';
import { User, Vehicle } from '../../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customers: User[];
  vehicles: Vehicle[];
  addBooking: (booking: any) => void;
}

export const NewBookingModal: React.FC<Props> = ({ isOpen, onClose, customers, vehicles, addBooking }) => {
  const [nbCustomer, setNbCustomer] = useState('');
  const [nbVehicle, setNbVehicle] = useState('');
  const [nbType, setNbType] = useState('Full Servicing');
  const [nbDate, setNbDate] = useState('');
  const [nbNotes, setNbNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nbCustomer || !nbVehicle || !nbDate) return;
    
    addBooking({
      customerId: nbCustomer,
      vehicleId: nbVehicle,
      type: nbType,
      date: nbDate,
      notes: nbNotes,
      status: 'Pending'
    });
    
    onClose();
    setNbCustomer(''); setNbVehicle(''); setNbDate(''); setNbNotes('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Booking">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select 
          label="Select Customer"
          value={nbCustomer}
          onChange={e => { setNbCustomer(e.target.value); setNbVehicle(''); }}
          options={[{ value: '', label: '-- Select Customer --' }, ...customers.map(c => ({ value: c.id, label: `${c.name} (${c.phone})` }))]}
          required
        />
        <Select 
          label="Select Vehicle"
          value={nbVehicle}
          onChange={e => setNbVehicle(e.target.value)}
          disabled={!nbCustomer}
          options={[{ value: '', label: '-- Select Vehicle --' }, ...vehicles.filter(v => v.customerId === nbCustomer).map(v => ({ value: v.id, label: `${v.model} (${v.number})` }))]}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Service Type" value={nbType} onChange={e => setNbType(e.target.value)} options={[{value:'Full Servicing', label:'Full Servicing'}, {value:'Oil Change', label:'Oil Change'}, {value:'Repair', label:'Repair'}]} />
          <Input label="Date" type="date" value={nbDate} onChange={e => setNbDate(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">Create Booking</Button>
      </form>
    </Modal>
  );
};
