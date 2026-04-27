import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Input, Card, Badge } from '../components/UI';
import { Wrench, Phone, Lock, ChevronRight, User as UserIcon, Shield, Briefcase } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { users, setCurrentUser } = useApp();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.phone === identifier || u.email === identifier);
    if (user) {
      setCurrentUser(user);
      navigate('/');
    } else {
      alert('Account not found. Please check your email/number or try a demo account.');
    }
  };

  const selectDemoUser = (role: 'admin' | 'customer' | 'staff') => {
    const demoUser = users.find(u => u.role === role);
    if (demoUser) {
      setCurrentUser(demoUser);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-500/30 mb-6">
            <Wrench className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back</h2>
          <p className="mt-2 text-slate-500 font-medium">Log in to manage your vehicle or business</p>
        </div>

        <Card className="border-0 shadow-2xl shadow-slate-200/50 p-8 rounded-3xl bg-white/80 backdrop-blur-xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <Input
                label="Email or Phone Number"
                placeholder="email@example.com or 98XXXXXXXX"
                icon={<Phone className="w-5 h-5" />}
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                <span className="text-slate-500 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 font-bold hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" size="lg" className="w-full h-14 text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20">
              Sign In <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-slate-400">
              <span className="bg-white px-4">Demo Accounts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { role: 'admin',    label: 'Admin Owner', icon: Shield,    color: 'bg-slate-900', phone: '9800000000' },
              { role: 'customer', label: 'Customer',    icon: UserIcon,  color: 'bg-blue-600',  phone: '9841000001' },
              { role: 'staff',    label: 'Staff Member', icon: Briefcase, color: 'bg-amber-600', phone: '9841000002' }
            ].map((demo) => (
              <button
                key={demo.role}
                onClick={() => selectDemoUser(demo.role as any)}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-slate-100 border border-transparent hover:border-slate-200 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`${demo.color} p-2.5 rounded-xl`}>
                    <demo.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-slate-900">{demo.label}</p>
                    <p className="text-xs text-slate-400 font-bold tracking-wider">{demo.phone}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge variant="info">Select</Badge>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <p className="text-center text-slate-400 font-medium text-sm">
          Don't have an account? <a href="#" className="text-blue-600 font-bold hover:underline">Request Access</a>
        </p>
      </div>
    </div>
  );
};
