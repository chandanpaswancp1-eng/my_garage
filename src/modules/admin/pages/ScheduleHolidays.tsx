import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Button, Input } from '../../../components/UI';
import { Trash2 } from 'lucide-react';

export const ScheduleManager = () => {
  const { staff, updateStaffWeeklyOff, holidays, addHoliday, deleteHoliday } = useApp();
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoliday.name || !newHoliday.date) return;
    addHoliday(newHoliday);
    setNewHoliday({ name: '', date: '' });
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Schedule & Holidays</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Staff Weekly Off" />
          <CardContent className="p-0">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                    <th className="p-4 font-semibold">Staff Name</th>
                    <th className="p-4 font-semibold">Off Day</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900">{s.name}</td>
                      <td className="p-4">
                        <select
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600/50 outline-none"
                          value={s.weeklyOff || 'Saturday'}
                          onChange={(e) => updateStaffWeeklyOff(s.id, e.target.value)}
                        >
                          {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Public Holidays" />
          <CardContent>
            <form onSubmit={handleAddHoliday} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              <Input placeholder="Holiday Name" required value={newHoliday.name} onChange={e => setNewHoliday({ ...newHoliday, name: e.target.value })} />
              <div className="flex space-x-2">
                <Input type="date" className="flex-1" required value={newHoliday.date} onChange={e => setNewHoliday({ ...newHoliday, date: e.target.value })} />
                <Button type="submit" className="mb-4">Add</Button>
              </div>
            </form>
            <div className="space-y-2">
              {holidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(h => (
                <div key={h.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <div>
                    <p className="font-bold text-slate-900">{h.name}</p>
                    <p className="text-xs text-slate-500">{new Date(h.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => deleteHoliday(h.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
