"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './landing.css';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const router = useRouter();
  const { currentUser } = useApp();
  const container = useRef<HTMLDivElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: 'user' | 'bot', text: string}[]>([
    { sender: 'bot', text: 'Hello! Welcome to Sewa Auto Mobiles. How can we help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') router.push('/admin');
      else if (currentUser.role === 'customer') router.push('/customer');
      else if (currentUser.role === 'staff') router.push('/staff');
    }
  }, [currentUser, router]);

  // GSAP Animations
  useGSAP(() => {
    // 1. Hero Zoom out and fade
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#heroSection",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,
      }
    });

    heroTl.to("#heroBg", { scale: 1, opacity: 0.8, duration: 1 }, 0);
    heroTl.to("#heroTitle", { scale: 2, opacity: 0, duration: 1 }, 0);
    heroTl.to("#heroSubtitle", { y: -100, opacity: 0, duration: 1 }, 0);

    // 2. Text Reveal (Scrollytelling text)
    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#revealSection",
        start: "top top",
        end: "+=200%",
        scrub: 1,
        pin: true
      }
    });

    revealTl.to(".text-reveal", { opacity: 1, color: "#fff", duration: 1 });
    revealTl.to(".text-reveal", { scale: 1.5, opacity: 0, filter: "blur(10px)", duration: 1 });

    // 3. Performance Grid / Services
    const perfTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#perfSection",
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true
      }
    });

    if (document.querySelectorAll('.perf-card').length > 0) {
      perfTl.to(".perf-card", { y: 0, opacity: 1, stagger: 0.2, duration: 1 });
    }
    if (document.getElementById('perfBg')) {
      perfTl.to("#perfBg", { scale: 1.2, duration: 2 }, 0);
    }

    // 4. Parallax Banner
    gsap.to("#parallaxBanner", {
      y: 200,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // 5. Gallery Items fade up
    const galleryItems = gsap.utils.toArray('.gallery-item');
    if (galleryItems.length > 0) {
      gsap.to(galleryItems, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".gallery-grid",
          start: "top 80%",
        }
      });
    }

    // 6. Generic fade-up for static glass panels or CTA
    const fadeElements = gsap.utils.toArray('.fade-up-on-scroll');
    fadeElements.forEach((el: any) => {
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }, { scope: container });

  const sendMessage = () => {
    if (inputValue.trim()) {
      setMessages(prev => [...prev, { sender: 'user', text: inputValue }]);
      setInputValue('');
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Thank you for reaching out! A representative will be with you shortly.' }]);
      }, 1000);
    }
  };

  if (currentUser) return null; // Prevent flash of landing page while redirecting

  return (
    <div ref={container}>
      {/* Apple-style Navbar */}
      <nav className="apple-nav">
        <div className="container">
          <Link href="/" className="brand">Sewa<span>Auto</span></Link>
          <div className="links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/login" className="btn-book">Login / Book</Link>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero Cinematic */}
      <div id="heroSection" className="scroll-section">
        <div className="sticky-container">
          <img src="https://images.unsplash.com/photo-1486262715619-670810a044e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Mechanic Repair" className="bg-image" id="heroBg" />
          <div className="text-wrapper">
            <h1 id="heroTitle" className="hero-title">Beyond Repair.</h1>
            <p id="heroSubtitle" className="hero-subtitle">The standard for automotive excellence.</p>
          </div>
        </div>
      </div>

      {/* Section 2: Text Reveal */}
      <div id="revealSection" className="scroll-section">
        <div className="sticky-container">
          <div className="text-wrapper">
            <p className="text-reveal">
              Expert Mechanics.<br />
              Transparent <span className="highlight">Pricing.</span><br />
              Flawless Results.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Performance/Services Grid */}
      <div id="perfSection" className="scroll-section">
        <div className="sticky-container">
          <img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1920&q=80" alt="Workshop Background" className="bg-image" id="perfBg" style={{ opacity: 0.2 }} />
          <div className="performance-grid">
            <div className="perf-card" style={{ transform: 'translateY(50px)', opacity: 0 }}>
              <i className="fas fa-wrench"></i>
              <h3>Diagnostics</h3>
              <p>State-of-the-art computer diagnostics for all modern vehicles.</p>
            </div>
            <div className="perf-card" style={{ transform: 'translateY(50px)', opacity: 0 }}>
              <i className="fas fa-car-crash"></i>
              <h3>Body Detailing</h3>
              <p>Premium detailing and paint correction restoring showroom finish.</p>
            </div>
            <div className="perf-card" style={{ transform: 'translateY(50px)', opacity: 0 }}>
              <i className="fas fa-tachometer-alt"></i>
              <h3>Performance</h3>
              <p>Engine tuning and performance upgrades for enthusiasts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Parallax Image Banner */}
      <div className="parallax-section" style={{ height: '70vh', overflow: 'hidden', position: 'relative' }}>
        <img 
          id="parallaxBanner"
          src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury Car" 
          style={{ width: '100%', height: '150%', objectFit: 'cover', position: 'absolute', top: '-25%', left: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '4vw', color: '#fff', textTransform: 'uppercase', letterSpacing: '10px' }}>Uncompromising Quality</h2>
        </div>
      </div>

      {/* Section 5: Gallery */}
      <div className="static-section" style={{ background: '#0a0a0a', minHeight: 'auto', padding: '100px 20px' }}>
        <h2 style={{ fontSize: '3rem', color: '#fff', marginBottom: '50px', textAlign: 'center' }}>Our Masterpieces</h2>
        <div className="gallery-grid">
          <div className="gallery-item" style={{ transform: 'translateY(30px)', opacity: 0 }}>
            <span className="badge">Service</span>
            <img src="https://images.unsplash.com/photo-1503376710344-9cb60c042623?auto=format&fit=crop&w=800&q=80" alt="Gallery 1" />
          </div>
          <div className="gallery-item" style={{ transform: 'translateY(30px)', opacity: 0 }}>
            <span className="badge">Detailing</span>
            <img src="https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=800&q=80" alt="Gallery 2" />
          </div>
          <div className="gallery-item" style={{ transform: 'translateY(30px)', opacity: 0 }}>
            <span className="badge">Repair</span>
            <img src="https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=800&q=80" alt="Gallery 3" />
          </div>
          <div className="gallery-item" style={{ transform: 'translateY(30px)', opacity: 0 }}>
            <span className="badge">Custom</span>
            <img src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80" alt="Gallery 4" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section fade-up-on-scroll" style={{ opacity: 0, transform: 'translateY(30px)' }}>
        <h2 style={{ fontSize: '4vw', margin: 0, color: '#fff' }}>Experience the difference.</h2>
        <Link href="/login" className="btn-primary" style={{ marginTop: '30px' }}>Explore Services</Link>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div>
            <h4>Sewa Auto Mobiles</h4>
            <p>Gothatar bagmati corner<br />9841423470</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4>Action</h4>
            <ul>
              <li><Link href="/login">Book Service</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Sewa Auto Mobiles. All rights reserved.
        </div>
      </footer>

      {/* Live Chat Widget */}
      {!chatOpen && (
        <button className="live-chat-toggle" onClick={() => setChatOpen(true)}>
          Live Chat
        </button>
      )}
      
      {chatOpen && (
        <div className="chat-widget active">
          <div className="chat-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Support</span>
            <span className="close-chat" onClick={() => setChatOpen(false)} style={{ cursor: 'pointer' }}>&times;</span>
          </div>
          <div className="chat-body" style={{ display: 'flex', flexDirection: 'column' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`} style={{ marginBottom: '10px', padding: '8px', borderRadius: '8px', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input-area" style={{ display: 'flex' }}>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..." 
              style={{ flex: 1, padding: '5px' }}
            />
            <button onClick={sendMessage} style={{ background: '#2997ff', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', marginLeft: '5px' }}>
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
