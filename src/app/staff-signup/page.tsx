"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Button, Input, Card, Select } from '../../components/UI';
import { Wrench, Phone, Lock, ChevronRight, User as UserIcon, Mail, Briefcase } from 'lucide-react';

export default function StaffSignupPage() {
  const { staffSignup } = useApp();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    position: 'Junior Mechanic',
    password: '',
    confirmPassword: ''
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    staffSignup({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      position: formData.position,
      salary: 0, // Will be set by Admin later
      joinedDate: new Date().toISOString().split('T')[0]
    });
    
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-500/30 mb-6">
            <Wrench className="w-10 h-10 text-white" />
          </Link>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Staff Registration</h2>
          <p className="mt-2 text-slate-500 font-medium">Join the Sewa Auto professional team</p>
        </div>

        <Card className="border-0 shadow-2xl shadow-slate-200/50 p-8 rounded-3xl bg-white/80 backdrop-blur-xl">
          <form className="space-y-4" onSubmit={handleSignup}>
            <Input
              label="Full Name"
              placeholder="Full Name"
              icon={<UserIcon className="w-5 h-5" />}
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="98XXXXXXXX"
                icon={<Phone className="w-5 h-5" />}
                value={formData.phone}
                onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="Email"
                icon={<Mail className="w-5 h-5" />}
                value={formData.email}
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <Select
              label="Applying for Position"
              value={formData.position}
              onChange={(e: any) => setFormData({ ...formData, position: e.target.value })}
              options={[
                { value: 'Junior Mechanic', label: 'Junior Mechanic' },
                { value: 'Senior Mechanic', label: 'Senior Mechanic' },
                { value: 'Service Advisor', label: 'Service Advisor' },
                { value: 'Inventory Manager', label: 'Inventory Manager' },
                { value: 'Accountant', label: 'Accountant' }
              ]}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={formData.confirmPassword}
              onChange={(e: any) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <Button type="submit" size="lg" className="w-full h-14 text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 mt-4">
              Register as Staff <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-slate-500 font-medium text-sm">
              Are you a customer? <Link href="/signup" className="text-blue-600 font-bold hover:underline">Customer Sign Up</Link>
            </p>
            <p className="text-slate-400 font-medium text-sm border-t border-slate-100 pt-3">
              Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
