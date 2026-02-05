import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Clock,
  Zap,
  HelpCircle,
  CreditCard,
  User,
  Settings,
  ChevronRight,
  TrendingUp,
  Award,
  Calendar,
  DollarSign,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';
import { useAuth } from '../contexts/AuthContext';

const MyPlan = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Derive plan info dynamically
  const planName = userProfile?.subscription_plan || 'Free';
  const isPremium = planName.toLowerCase() !== 'free';
  const planDisplay = planName.charAt(0).toUpperCase() + planName.slice(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 198, 255, 0.4)';
      ctx.strokeStyle = 'rgba(0, 198, 255, 0.08)';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleNavigation = (itemId) => {
    const routes = {
      dashboard: '/user-dashboard',
      'live-interview': '/live-ai-interview',
      'past-interviews': '/weakness-overview',
      'question-bank': '/question-bank',
      subscriptions: '/my-plan',
      profile: '/profile',
      settings: '/settings'
    };
    if (routes[itemId]) navigate(routes[itemId]);
  };

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'past-interviews', icon: Clock, label: 'Past Interviews' },
    { id: 'live-interview', icon: Zap, label: 'Live Interview' },
    { id: 'question-bank', icon: HelpCircle, label: 'Question Bank' },
    { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.6
        }}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        position: 'relative',
        zIndex: 2,
        height: '100vh',
        overflowY: 'auto',
        background: 'transparent'
      }}>
        {/* Sticky Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '1rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: '#fff' }}>Subscriptions</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Plan & Billing Management</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{user?.displayName || 'User'}</div>
              <div style={{ fontSize: '0.7rem', color: '#00c6ff' }}>Premium Member</div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0, 198, 255, 0.3)'
            }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <div style={{ padding: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Current Plan Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 198, 255, 0.1) 0%, rgba(0, 114, 255, 0.05) 100%)',
            border: '1px solid rgba(0, 198, 255, 0.2)',
            borderRadius: '32px',
            padding: '2.5rem',
            marginBottom: '3rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'rgba(0, 198, 255, 0.1)',
              filter: 'blur(60px)',
              borderRadius: '50%'
            }} />
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(0, 198, 255, 0.2)'
              }}>
                <Award size={48} color="white" />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>{planDisplay} Plan</h3>
                  <span style={{ 
                    padding: '4px 12px', 
                    background: isPremium ? 'rgba(0, 198, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)', 
                    border: `1px solid ${isPremium ? '#00c6ff' : 'rgba(255, 255, 255, 0.2)'}`,
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: isPremium ? '#00c6ff' : '#94a3b8'
                  }}>{isPremium ? 'ACTIVE' : 'BASIC'}</span>
                </div>
                <p style={{ fontSize: '1.1rem', color: '#94a3b8', margin: 0, maxWidth: '500px' }}>
                  {isPremium 
                    ? 'Enjoy unlimited AI interviews and advanced career analytics to land your dream job.'
                    : 'Get started with limited AI interviews and basic performance tracking.'}
                </p>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '1.5rem 2rem',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <Calendar size={14} /> Account Created
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{
              background: 'rgba(15, 15, 15, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              padding: '2rem'
            }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: '#00c6ff' }}>Plan Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Current Plan</span>
                  <span style={{ fontWeight: '600' }}>{planDisplay}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Price</span>
                  <span style={{ fontWeight: '600' }}>{isPremium ? 'PHP 399.00/mo' : 'Free'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Status</span>
                  <span style={{ color: '#22c55e', fontWeight: '600' }}>Active</span>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 15, 15, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              padding: '2rem'
            }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Usage Metrics</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#64748b' }}>AI Interviews</span>
                    <span style={{ fontWeight: '600' }}>Unlimited</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(0,198,255,0.1)', borderRadius: '3px', position: 'relative' }}>
                    <div style={{ width: '100%', height: '100%', background: '#00c6ff', borderRadius: '3px' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#64748b' }}>Questions Bank Access</span>
                    <span style={{ fontWeight: '600' }}>100%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(0,198,255,0.1)', borderRadius: '3px', position: 'relative' }}>
                    <div style={{ width: '100%', height: '100%', background: '#00c6ff', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button style={{
              flex: 1,
              minWidth: '200px',
              padding: '1rem',
              background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 10px 20px rgba(0, 198, 255, 0.2)'
            }}>
              <TrendingUp size={18} /> Upgrade Plan
            </button>
            <button style={{
              flex: 1,
              minWidth: '200px',
              padding: '1rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Billing History
            </button>
            <button style={{
              flex: 0.5,
              minWidth: '150px',
              padding: '1rem',
              background: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              color: '#ef4444',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Cancel Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPlan;

