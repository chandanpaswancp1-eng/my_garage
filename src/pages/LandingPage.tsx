import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Shield, Zap, Star, ChevronRight, PlayCircle, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/UI';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Sewa<span className="text-blue-600">Auto</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">About Us</a>
            <a href="#reviews" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Reviews</a>
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>Login</Button>
            <Button size="sm" onClick={() => navigate('/login')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="fade-in-up">
            <Badge variant="info" className="mb-6 px-4 py-1.5 text-sm">Now serving 5000+ vehicles</Badge>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
              Modern Care for Your <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">Vehicle</span>.
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Experience Nepal's most advanced automobile service management. Real-time tracking, transparent billing, and expert care—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-xl shadow-blue-500/25" onClick={() => navigate('/login')}>
                Book a Service Now <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold">
                <PlayCircle className="mr-2 w-5 h-5 text-blue-600" /> Watch Demo
              </Button>
            </div>
            <div className="mt-12 flex items-center space-x-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                ))}
              </div>
              <div>
                <div className="flex text-amber-400 mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm font-bold text-slate-900">4.9/5 Rating <span className="font-medium text-slate-500">from 2k+ owners</span></p>
              </div>
            </div>
          </div>
          <div className="relative fade-in-up delay-200">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 transform rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop" alt="Garage" className="rounded-2xl" />
              <div className="absolute -bottom-8 -left-8 glass-panel p-6 rounded-2xl shadow-xl border border-white/50 max-w-xs animate-bounce-slow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-emerald-500 p-2 rounded-lg"><Zap className="w-5 h-5 text-white" /></div>
                  <p className="font-bold text-slate-900">Fast Servicing</p>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">Most services completed in under 4 hours with live updates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Everything You Need</h2>
            <p className="text-slate-500 text-lg">Powerful features to keep your business running smoothly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Shield, title: 'Expert Mechanics', desc: 'Certified professionals with years of experience across all major brands.' },
              { icon: Zap, title: 'Real-time Updates', desc: 'Get notified as your vehicle moves through each stage of servicing.' },
              { icon: Users, title: 'Customer Portal', desc: 'Full access to your service history, invoices, and future maintenance alerts.' }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 hover:bg-blue-600 hover:text-white group transition-all duration-300">
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-blue-500">
                  <f.icon className="w-7 h-7 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-500 group-hover:text-blue-50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {[
            { label: 'Vehicles Served', value: '10k+' },
            { label: 'Happy Owners', value: '8.5k+' },
            { label: 'Expert Staff', value: '50+' },
            { label: 'Success Rate', value: '99.9%' }
          ].map((s, i) => (
            <div key={i} className="text-white">
              <p className="text-5xl font-black mb-2">{s.value}</p>
              <p className="text-blue-100 font-medium uppercase tracking-widest text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[100px]" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
            Ready to give your car the <br/><span className="text-blue-500 text-glow">premium care</span> it deserves?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Button size="lg" className="h-16 px-12 text-xl font-black bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/20">
              Book Appointment Now
            </Button>
            <p className="text-slate-400 font-bold flex items-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" /> No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <Wrench className="w-6 h-6 text-blue-600" />
                <span className="text-2xl font-black text-slate-900">Sewa<span className="text-blue-600">Auto</span></span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Empowering automobile businesses and vehicle owners with state-of-the-art management solutions.
              </p>
            </div>
            {[
              { title: 'Company', links: ['About', 'Careers', 'Privacy Policy', 'Contact'] },
              { title: 'Product', links: ['Features', 'Pricing', 'Documentation', 'Changelog'] },
              { title: 'Contact', links: ['+977 1 4400000', 'hello@sewaauto.com', 'Kathmandu, Nepal'] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-black text-slate-900 mb-6 uppercase tracking-wider text-sm">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-50 pt-8 text-center text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} Sewa Automobile Pvt. Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Badge Component
const Badge: React.FC<{ children: React.ReactNode, variant?: 'info' | 'default', className?: string }> = ({ children, variant, className }) => {
  const styles = variant === 'info' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-bold transition-colors ${styles} ${className}`}>
      {children}
    </span>
  );
};
