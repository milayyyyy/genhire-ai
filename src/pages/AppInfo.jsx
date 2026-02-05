import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Info, 
  Mail, 
  Globe, 
  Shield, 
  Award, 
  Users,
  Home,
  Clock,
  Zap,
  HelpCircle,
  CreditCard,
  User,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const AppInfo = ({ onLogout }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    // Particle Animation - Consistent with other pages
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 198, 255, ${0.1 * (1 - distance / 120)})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 198, 255, ${p.opacity})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleNavigation = (id) => {
    switch(id) {
      case 'dashboard':
        navigate('/user-dashboard');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'pricing':
        navigate('/pricing');
        break;
      case 'question-bank':
        navigate('/question-bank');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'question-bank', icon: Zap, label: 'Question Bank' },
    { id: 'pricing', icon: CreditCard, label: 'My Plan' },
    { id: 'info', icon: Info, label: 'App Info' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        zIndex: 5,
        padding: '3rem'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: '3rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '3rem'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0, 198, 255, 0.3)'
            }}>
              <Info size={60} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, marginBottom: '0.5rem' }}>
                App <span style={{ color: '#00c6ff' }}>Information</span>
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                Version 1.0.4 | Empowering your career with AI
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '2rem',
            display: 'flex',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00c6ff', marginBottom: '1.5rem' }}>
                About GenHire AI
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', margin: 0 }}>
                GenHire AI is a state-of-the-art AI-powered interview preparation platform designed to help job seekers practice and perfect their interview skills. 
                Using advanced speech recognition and natural language processing, our platform simulates realistic interview scenarios, 
                provides instant feedback, and tracks your progress over time. Whether you're preparing for your first job interview or 
                looking to sharpen your skills for a career change, GenHire AI is your personal interview coach available 24/7.
              </p>
            </div>
            <div style={{
              width: '250px',
              height: '250px',
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              flexShrink: 0
            }}>
              <iframe
                src="https://my.spline.design/genkubgreetingrobot-dKSdmkp6P4tsfaGKQgqQXWPd/"
                style={{ 
                  width: '100%', 
                  height: '115%', 
                  border: 'none',
                  position: 'absolute',
                  top: 0
                }}
                allow="fullscreen; vr"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(0, 198, 255, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: '#00c6ff'
              }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>AI Feedback</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.6', margin: 0 }}>
                Get instant, detailed feedback on your responses with actionable insights to improve your performance.
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(0, 198, 255, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: '#00c6ff'
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Realistic Simulations</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.6', margin: 0 }}>
                Practice with AI interviewers that simulate real interview scenarios across various industries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppInfo;

