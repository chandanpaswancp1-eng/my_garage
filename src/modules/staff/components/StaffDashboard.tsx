import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Badge, Button } from '../../../components/UI';
import { Wrench, CheckCircle2 } from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { currentUser, bookings, vehicles, users, staff, updateBookingStatus } = useApp();
  
  if (!currentUser) return null;

  // Find staff record for current user
  const myStaff = staff.find(s => s.phone === currentUser.phone);
  const staffId = myStaff?.id || 's1';
  const myTasks = bookings.filter(b => b.mechanicId === staffId && b.status !== 'Completed');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Workspace</h2>
        <p className="text-slate-500 mt-1">Manage your assigned tasks and daily activities.</p>
      </div>
      
      <Card className="border-t-4 border-t-blue-600">
        <CardHeader title="Today's Assigned Services" />
        <CardContent className="p-0">
          {myTasks.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {myTasks.map(task => {
                const vehicle = vehicles.find(v => v.id === task.vehicleId);
                const customer = users.find(u => u.id === task.customerId);
                return (
                  <div key={task.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-slate-50 transition-colors">
                    <div className="mb-5 md:mb-0 w-full md:w-auto">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Wrench className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-lg text-slate-900">{task.type}</h4>
                        <Badge variant={task.status === 'In Progress' ? 'warning' : 'default'}>{task.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                          <p className="text-slate-500 font-medium mb-1 text-xs uppercase tracking-wider">Vehicle</p>
                          <p className="font-semibold text-slate-900">{vehicle?.model}</p>
                          <p className="text-slate-600">{vehicle?.number}</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                          <p className="text-slate-500 font-medium mb-1 text-xs uppercase tracking-wider">Customer</p>
                          <p className="font-semibold text-slate-900">{customer?.name}</p>
                          <p className="text-slate-600">{customer?.phone}</p>
                        </div>
                      </div>
                      {task.notes && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Customer Notes</p>
                          <p className="text-sm text-amber-900 font-medium italic">"{task.notes}"</p>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3 w-full md:w-auto mt-4 md:mt-0">
                      {task.status === 'Pending' && (
                        <Button onClick={() => updateBookingStatus(task.id, 'In Progress')} className="w-full md:w-auto">Start Work</Button>
                      )}
                      {task.status === 'In Progress' && (
                        <Button variant="success" onClick={() => updateBookingStatus(task.id, 'Completed')} className="w-full md:w-auto">
                          <CheckCircle2 className="w-5 h-5 mr-2" /> Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <p className="text-slate-800 font-bold text-xl">All caught up!</p>
              <p className="text-slate-500 mt-2">You have no pending tasks assigned.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
