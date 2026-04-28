import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Button, formatNepaliDate } from '../../../components/UI';
import { Clock, CheckCircle2 } from 'lucide-react';

export const AttendancePanel: React.FC = () => {
  const { currentUser, staff, attendance, checkInStaff, checkOutStaff } = useApp();
  
  if (!currentUser) return null;

  const myStaff = staff.find(s => s.phone === currentUser.phone);
  const staffId = myStaff?.id || 's1';
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(a => a.staffId === staffId && a.date === today);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-2xl border-none bg-gradient-to-b from-white to-slate-50">
        <CardHeader title="Daily Attendance" />
        <CardContent className="text-center py-10 px-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center shadow-lg border border-slate-100 z-10">
              <Clock className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          <p className="text-sm font-semibold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full mb-8">
            {formatNepaliDate(new Date())}
          </p>
          
          {!todayRecord ? (
            <Button size="lg" className="w-full py-4 text-lg" onClick={() => checkInStaff(staffId)}>
              Check In Now
            </Button>
          ) : !todayRecord.checkOut ? (
            <div className="space-y-6">
              <div className="p-6 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl">
                <p className="text-sm font-medium uppercase tracking-wider mb-1 opacity-70">Checked In At</p>
                <p className="text-4xl font-extrabold">{todayRecord.checkIn}</p>
              </div>
              <Button size="lg" variant="danger" className="w-full py-4 text-lg" onClick={() => checkOutStaff(staffId)}>
                Check Out
              </Button>
            </div>
          ) : (
            <div className="p-8 bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <p className="font-bold text-xl mb-6">Shift Completed</p>
              <div className="flex justify-center items-center space-x-8 text-sm font-bold">
                <div className="text-center">
                  <p className="text-slate-500 uppercase tracking-wider text-[10px] mb-1">In</p>
                  <p className="text-slate-900 text-lg">{todayRecord.checkIn}</p>
                </div>
                <div className="h-10 w-px bg-slate-300"></div>
                <div className="text-center">
                  <p className="text-slate-500 uppercase tracking-wider text-[10px] mb-1">Out</p>
                  <p className="text-slate-900 text-lg">{todayRecord.checkOut}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
