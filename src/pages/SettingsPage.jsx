import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Clock,
  Zap,
  HelpCircle,
  CreditCard,
  User,
  Settings,
  ChevronRight,
  Info,
  Bell,
  Check,
  Moon,
  Sun,
  Layout,
  MessageSquare,
  Volume2,
  RefreshCw,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const SettingsPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canvasRef = useRef(null);

  const [darkMode, setDarkMode] = useState(true);
  const [buttonlessResponse, setButtonlessResponse] = useState(true);
  const [aiTextCaptions, setAiTextCaptions] = useState(true);
  const [autoPlayQuestions, setAutoPlayQuestions] = useState(true);
  const [speakingSpeed, setSpeakingSpeed] = useState('Normal');
  const [instantRating, setInstantRating] = useState(true);
  const [retryAnswer, setRetryAnswer] = useState(true);

  // Particle Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5;
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

    const init = () => {
      resize();
      particles = Array.from({ length: 80 }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 198, 255, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    init();
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleNavigation = (itemId) => {
    switch (itemId) {
      case 'dashboard':
        navigate('/user-dashboard');
        break;
      case 'live-interview':
        navigate('/live-ai-interview');
        break;
      case 'past-interviews':
        navigate('/weakness-overview');
        break;
      case 'question-bank':
        navigate('/question-bank');
        break;
      case 'subscriptions':
        navigate('/my-plan');
        break;
      case 'profile':
        navigate('/profile');
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
    { id: 'past-interviews', icon: Clock, label: 'Past Interviews' },
    { id: 'live-interview', icon: Zap, label: 'Live AI Interview' },
    { id: 'question-bank', icon: HelpCircle, label: 'Question Bank' },
    { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <div
      onClick={onToggle}
      style={{
        width: '44px',
        height: '22px',
        backgroundColor: enabled ? '#00c6ff' : 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: enabled ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div
        style={{
          width: '18px',
          height: '18px',
          backgroundColor: '#fff',
          borderRadius: '50%',
          position: 'absolute',
          top: enabled ? '2px' : '1px',
          left: enabled ? '24px' : '2px',
          transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          boxShadow: enabled ? '0 0 10px rgba(0, 198, 255, 0.5)' : 'none'
        }}
      />
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#000',
      color: '#fff',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Dynamic Background Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.6
        }}
      />
      {/* Main Content */}
      <div style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(15px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '1.25rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>System Settings</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Configure your AI interview environment</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="#94a3b8" />
              <span style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: '8px',
                height: '8px',
                background: '#00c6ff',
                borderRadius: '50%',
                border: '2px solid #000'
              }}></span>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <div className="settings-content-container" style={{ padding: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
          {/* App Appearance */}
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Layout size={20} color="#00c6ff" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Appearance</h2>
            </div>
            
            <div style={{
              background: 'rgba(15, 15, 15, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '1.5rem'
            }}>
              <div 
                className="settings-card-row"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Dark Mode</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>High contrast dark theme for better focus</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Sun size={18} color="#64748b" />
                  <ToggleSwitch enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
                  <Moon size={18} color="#00c6ff" />
                </div>
              </div>
            </div>
          </section>

          {/* Interview Engine */}
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Zap size={20} color="#00c6ff" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Interview Engine</h2>
            </div>
            
            <div style={{
              background: 'rgba(15, 15, 15, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {/* Button-less Response */}
              <div 
                className="settings-card-row"
                style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
              >
                <div style={{ flex: 1, marginRight: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Hands-free Mode</h3>
                    <Info size={14} color="#00c6ff" />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Automatically detect speech without tapping the mic</p>
                </div>
                <ToggleSwitch
                  enabled={buttonlessResponse}
                  onToggle={() => setButtonlessResponse(!buttonlessResponse)}
                />
              </div>

              {/* Text Captions */}
              <div 
                className="settings-card-row"
                style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
              >
                <div style={{ flex: 1, marginRight: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Hide Text Captions</h3>
                    <Info size={14} color="#00c6ff" />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Rely only on AI voice for a realistic challenge</p>
                </div>
                <ToggleSwitch
                  enabled={aiTextCaptions}
                  onToggle={() => setAiTextCaptions(!aiTextCaptions)}
                />
              </div>

              {/* Auto-Play */}
              <div 
                className="settings-card-row"
                style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
              >
                <div style={{ flex: 1, marginRight: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Auto-advance Questions</h3>
                    <Info size={14} color="#00c6ff" />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>AI proceeds to the next question automatically</p>
                </div>
                <ToggleSwitch
                  enabled={autoPlayQuestions}
                  onToggle={() => setAutoPlayQuestions(!autoPlayQuestions)}
                />
              </div>

              {/* Speaking Speed */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#e2e8f0', display: 'block', marginBottom: '1rem' }}>
                  AI Speaking Speed
                </span>
                <div 
                  className="settings-button-group"
                  style={{ display: 'flex', gap: '0.75rem' }}
                >
                  {['Slow', 'Normal', 'Fast'].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSpeakingSpeed(speed)}
                      style={{
                        padding: '0.6rem 1.25rem',
                        backgroundColor: speakingSpeed === speed ? 'rgba(0, 198, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        color: speakingSpeed === speed ? '#00c6ff' : '#64748b',
                        border: speakingSpeed === speed ? '1px solid #00c6ff' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flex: 1
                      }}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Evaluation & Feedback */}
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <ShieldCheck size={20} color="#00c6ff" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Evaluation Systems</h2>
            </div>
            
            <div style={{
              background: 'rgba(15, 15, 15, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {/* Instant Rating */}
              <div 
                className="settings-card-row"
                style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
              >
                <div style={{ flex: 1, marginRight: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Real-time Analysis</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Show scoring results immediately after each answer</p>
                </div>
                <ToggleSwitch
                  enabled={instantRating}
                  onToggle={() => setInstantRating(!instantRating)}
                />
              </div>

              {/* Retry Answer */}
              <div 
                className="settings-card-row"
                style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
              >
                <div style={{ flex: 1, marginRight: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Answer Revision</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Allows you to retake an answer before proceeding</p>
                </div>
                <ToggleSwitch
                  enabled={retryAnswer}
                  onToggle={() => setRetryAnswer(!retryAnswer)}
                />
              </div>
            </div>
          </section>

          {/* Support & Information */}
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <HelpCircle size={20} color="#00c6ff" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Support</h2>
            </div>
            
            <div 
              className="settings-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}
            >
              {[
                { label: 'Help Center', icon: HelpCircle, path: '/faq' },
                { label: 'App Status', icon: Info, status: 'v2.1.0' }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                    e.currentTarget.style.borderColor = 'rgba(0, 198, 255, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <item.icon size={18} color="#00c6ff" />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.label}</span>
                  </div>
                  {item.status ? (
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.status}</span>
                  ) : (
                    <ChevronRight size={16} color="#64748b" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Danger Zone */}
          <section>
            <div 
              className="settings-danger-zone"
              style={{
                background: 'rgba(220, 38, 38, 0.05)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ flex: 1, marginRight: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ef4444', margin: '0 0 0.25rem 0' }}>Danger Zone</h3>
                <p style={{ fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>Permanently delete your profile and interview data</p>
              </div>
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                border: '1px solid #dc2626',
                borderRadius: '12px',
                color: '#dc2626',
                fontSize: '0.875rem',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                Delete Account
              </button>
            </div>
          </section>

          <style>{`
            @media (max-width: 1024px) {
              .settings-content-container {
                padding: 1.5rem !important;
              }
            }
            @media (max-width: 768px) {
              header {
                padding: 1rem 1.5rem !important;
              }
              .settings-card-row {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 1.25rem !important;
              }
              .settings-danger-zone {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 1.5rem !important;
              }
              .settings-button-group {
                flex-direction: column !important;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

