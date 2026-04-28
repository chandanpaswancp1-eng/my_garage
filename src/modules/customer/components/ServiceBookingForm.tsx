import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Button, Input, Select } from '../../../components/UI';
import { CheckCircle2 } from 'lucide-react';

export const ServiceBookingForm: React.FC = () => {
  const { currentUser, vehicles, addBooking } = useApp();
  const [type, setType] = useState('Full Servicing');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  if (!currentUser) return null;
  const myVehicles = vehicles.filter(v => v.customerId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (myVehicles.length === 0) return alert('No vehicle registered. Please contact the garage to register your vehicle.');
    addBooking({ 
      customerId: currentUser.id, 
      vehicleId: myVehicles[0].id, 
      type, 
      date, 
      notes, 
      status: 'Pending' 
    });
    setSuccess(true);
    setDate('');
    setNotes('');
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader title="Book a Service Appointment" />
        <CardContent>
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center">
              <CheckCircle2 className="w-6 h-6 mr-3 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="font-bold">Booking successful!</p>
                <p className="text-sm mt-0.5">We will contact you shortly to confirm.</p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Service Type"
              value={type}
              onChange={e => setType(e.target.value)}
              options={[
                { value: 'Full Servicing', label: 'Full Servicing' },
                { value: 'Oil Change', label: 'Oil Change' },
                { value: 'Brake Inspection', label: 'Brake Inspection' },
                { value: 'Tyre Rotation', label: 'Tyre Rotation' },
                { value: 'Wheel Alignment', label: 'Wheel Alignment' },
                { value: 'AC Service', label: 'AC Service' },
                { value: 'General Repair', label: 'General Repair' },
              ]}
            />
            <Input label="Preferred Date & Time" type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Notes</label>
              <textarea
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all text-sm"
                rows={4}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe any specific issues, weird noises, etc..."
              />
            </div>
            <Button type="submit" className="w-full py-3 text-base">Confirm Booking</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
