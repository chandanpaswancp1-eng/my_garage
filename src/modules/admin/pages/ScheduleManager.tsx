import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Button, Badge } from '../../../components/UI';
import { Trash2, Plus } from 'lucide-react';

export const ScheduleManager: React.FC = () => {
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
        {/* Staff Weekly Off */}
        <Card>
          <CardHeader title="Staff Weekly Off Schedule" />
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                    <th className="p-4 font-medium">Staff Name</th>
                    <th className="p-4 font-medium">Position</th>
                    <th className="p-4 font-medium">Weekly Off Day</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-semibold text-slate-900">{s.name}</td>
                      <td className="p-4 text-sm text-slate-500">{s.position}</td>
                      <td className="p-4">
                        <select
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all"
                          value={s.weeklyOff ?? 'Saturday'}
                          onChange={e => updateStaffWeeklyOff(s.id, e.target.value)}
                        >
                          {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {staff.length === 0 && (
                    <tr><td colSpan={3} className="p-8 text-center text-slate-500">No staff found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Public Holidays */}
        <Card>
          <CardHeader title="Public Holidays" />
          <CardContent>
            <form onSubmit={handleAddHoliday} className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
                placeholder="Holiday Name (e.g., Dashain)"
                required
                value={newHoliday.name}
                onChange={e => setNewHoliday({ ...newHoliday, name: e.target.value })}
              />
              <input
                className="w-full sm:w-40 px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
                type="date"
                required
                value={newHoliday.date}
                onChange={e => setNewHoliday({ ...newHoliday, date: e.target.value })}
              />
              <Button type="submit" className="whitespace-nowrap w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </form>

            <div className="space-y-3">
              {[...holidays]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(h => (
                  <div key={h.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50">
                    <div>
                      <p className="font-semibold text-slate-900">{h.name}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(h.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => deleteHoliday(h.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              {holidays.length === 0 && (
                <p className="text-center text-slate-500 py-6 text-sm">No upcoming holidays.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
