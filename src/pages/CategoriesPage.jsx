import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Clock,
  Zap,
  HelpCircle,
  CreditCard,
  User,
  Settings,
  LogIn,
  UserPlus,
  Mail,
  Shield,
  BarChart3,
  Mic,
  Award,
  AlertTriangle,
  DollarSign,
  Grid3X3,
  ArrowRight
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Particle Effect Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particles = [];
    const particleCount = 100;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 198, 255, 0.5)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.update();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 198, 255, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const allRoutes = [
    {
      category: 'Authentication',
      routes: [
        { path: '/login', name: 'Login', icon: LogIn, description: 'User login page' },
        { path: '/signup', name: 'Sign Up', icon: UserPlus, description: 'User registration page' },
        { path: '/forgot-password', name: 'Forgot Password', icon: Shield, description: 'Password recovery page' },
        { path: '/email-verification', name: 'Email Verification', icon: Mail, description: 'Email verification page' },
        { path: '/setup-profile', name: 'Setup Profile', icon: User, description: 'Profile setup after registration' }
      ]
    },
    {
      category: 'Dashboards',
      routes: [
        { path: '/dashboard', name: 'Admin Dashboard', icon: BarChart3, description: 'Admin control panel' },
        { path: '/user-dashboard', name: 'User Dashboard', icon: Home, description: 'Main user performance hub' }
      ]
    },
    {
      category: 'Interview System',
      routes: [
        { path: '/live-ai-interview', name: 'Interview Setup', icon: Zap, description: 'Mock interview configuration' },
        { path: '/voice-interview', name: 'Voice Session', icon: Mic, description: 'Active AI interview session' },
        { path: '/interview-results', name: 'Results', icon: Award, description: 'Completion feedback & scores' }
      ]
    },
    {
      category: 'Performance Analysis',
      routes: [
        { path: '/weakness-overview', name: 'AI Diagnostics', icon: AlertTriangle, description: 'Detailed weakness analysis' }
      ]
    },
    {
      category: 'Content & Resources',
      routes: [
        { path: '/question-bank', name: 'Question Bank', icon: HelpCircle, description: 'Browse interview questions' }
      ]
    },
    {
      category: 'Account',
      routes: [
        { path: '/profile', name: 'Profile', icon: User, description: 'Personal information' },
        { path: '/my-plan', name: 'Subscription', icon: CreditCard, description: 'Billing management' },
        { path: '/pricing', name: 'Pricing', icon: DollarSign, description: 'Select subscription plans' },
        { path: '/settings', name: 'Settings', icon: Settings, description: 'Preferences & customization' }
      ]
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          opacity: 0.6,
          pointerEvents: 'none'
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          to { background-position: 200% center; }
        }
        .shiny-title {
          background: linear-gradient(to right, #fff 20%, #00c6ff 50%, #fff 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 5s linear infinite;
        }
        .route-card {
          background: rgba(10, 10, 10, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .route-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.05);
          border-color: #00c6ff;
          box-shadow: 0 10px 30px -10px rgba(0, 198, 255, 0.3);
        }
        @media (max-width: 1024px) {
          .categories-header {
            padding: 4rem 1.5rem 2rem !important;
            margin-top: 60px !important;
          }
          .categories-main {
            padding: 0 1.5rem 4rem !important;
          }
        }
        @media (max-width: 768px) {
          .shiny-title {
            font-size: 2.5rem !important;
          }
          .categories-header p {
            font-size: 1rem !important;
          }
          .routes-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .shiny-title {
            font-size: 2rem !important;
          }
          .categories-header {
            padding: 3rem 1rem 1.5rem !important;
          }
          .categories-main {
            padding: 0 1rem 3rem !important;
          }
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #00c6ff;
        }
      `}} />

      {/* Header */}
      <div 
        className="categories-header"
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '4rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(to bottom, rgba(0, 198, 255, 0.05), transparent)'
        }}
      >
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <ChatBubbleLogo size={60} />
          <div>
            <h1 className="shiny-title" style={{
              fontSize: '3rem',
              fontWeight: '900',
              margin: 0,
              letterSpacing: '-0.04em'
            }}>
              Map of GenHire
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#94a3b8',
              marginTop: '0.75rem'
            }}>
              Quick access to every portal in the ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <main 
        className="categories-main"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem 6rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        {allRoutes.map((category, idx) => (
          <div key={idx} style={{ marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              color: '#fff',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ 
                width: '4px', 
                height: '24px', 
                background: 'linear-gradient(to bottom, #00c6ff, #0072ff)',
                borderRadius: '2px'
              }} />
              {category.category.toUpperCase()}
            </h2>

            <div 
              className="routes-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {category.routes.map((route, ridx) => {
                const Icon = route.icon;
                return (
                  <div
                    key={ridx}
                    className="route-card"
                    onClick={() => navigate(route.path)}
                    style={{
                      borderRadius: '24px',
                      padding: '2rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      background: 'rgba(0, 198, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00c6ff'
                    }}>
                      <Icon size={24} />
                    </div>
                    
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{route.name}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>{route.description}</p>
                    </div>

                    <div style={{ 
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: '#00c6ff',
                      opacity: 0.8
                    }}>
                      ENTER PORTAL <ArrowRight size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default CategoriesPage;

