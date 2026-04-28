import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Input, Card } from '../components/UI';
import { Wrench, Phone, Lock, ChevronRight, User as UserIcon, Mail } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    signup({
      name: formData.name,
      phone: formData.phone,
      email: formData.email
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-500/30 mb-6">
            <Wrench className="w-10 h-10 text-white" />
          </Link>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-slate-500 font-medium">Join Nepal's most advanced auto service</p>
        </div>

        <Card className="border-0 shadow-2xl shadow-slate-200/50 p-8 rounded-3xl bg-white/80 backdrop-blur-xl">
          <form className="space-y-5" onSubmit={handleSignup}>
            <div className="space-y-3">
              <Input
                label="Full Name"
                placeholder="John Doe"
                icon={<UserIcon className="w-5 h-5" />}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                placeholder="98XXXXXXXX"
                icon={<Phone className="w-5 h-5" />}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="email@example.com"
                icon={<Mail className="w-5 h-5" />}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full h-14 text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20">
              Sign Up <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-slate-500 font-medium text-sm">
              Are you a mechanic? <Link to="/staff-signup" className="text-blue-600 font-bold hover:underline">Join our team</Link>
            </p>
            <p className="text-slate-400 font-medium text-sm border-t border-slate-100 pt-3">
              Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
