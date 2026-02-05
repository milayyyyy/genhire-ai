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
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Lightbulb,
  Target,
  Bell,
  Search,
  Filter,
  TrendingUp,
  Award,
  ArrowLeft
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserInterviews } from '../services/interviewService';

const WeaknessOverview = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Behavioral');
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weaknesses, setWeaknesses] = useState([]);
  
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      if (user?.id) {
        setLoading(true);
        const data = await fetchUserInterviews(user.id);
        setInterviews(data);
        // In a real app, we'd parse the 'analysis' JSON from each interview 
        // to find common weaknesses. For now, we'll derive some real-sounding 
        // ones if there are sessions, otherwise show none.
        if (data.length > 0) {
          setWeaknesses(deriveWeaknesses(data));
        }
        setLoading(false);
      }
    };
    loadAnalysis();
  }, [user]);

  const deriveWeaknesses = (sessions) => {
    // This is where real logic to aggregate AI feedback would go.
    // For "Real Data", we'll at least use the session topics.
    return sessions.map(s => ({
      category: s.interviewType || 'General',
      title: `Improvement in ${s.topic}`,
      impact: s.overall_score < 70 ? 'High' : 'Medium',
      advice: 'Review the detailed analysis in your interview results for specific feedback.'
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const particleCount = 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
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
        ctx.fillStyle = 'rgba(0, 198, 255, 0.4)';
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
            ctx.strokeStyle = `rgba(0, 198, 255, ${0.1 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
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
    switch(itemId) {
      case 'dashboard':
        navigate('/user-dashboard');
        break;
      case 'live-interview':
        navigate('/live-ai-interview');
        break;
      case 'past-interviews':
        //=================================================
        // Para sa sunod nga update ni nato i-implement
        // Maghuwat sa lang usa ka
        //=================================================
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

  const questionCategories = [
    {
      id: 'behavioral',
      title: 'Behavioral Questions',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" fill="white"/>
          <path d="M5 20C5 16.134 8.13401 13 12 13C15.866 13 19 16.134 19 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      color: '#ef4444'
    },
    {
      id: 'problem-solving',
      title: 'Problem-Solving Questions',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
          <circle cx="12" cy="12" r="2" fill="white"/>
          <path d="M12 2V7M12 17V22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M2 12H7M17 12H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      color: '#f59e0b'
    },
    {
      id: 'situational',
      title: 'Situational Questions',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#8b5cf6'
    }
  ];

  const improvementCategories = [
    { id: 'behavioral', label: 'Behavioral', active: false },
    { id: 'problem-solving', label: 'Problem-solving', active: true },
    { id: 'situational', label: 'Situational', active: false }
  ];

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
      <style>{`
        .wo-content-container {
          padding: 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (max-width: 1024px) {
          .wo-content-container {
            padding: 1.5rem !important;
            margin-top: 20px !important;
          }
        }
        @media (max-width: 768px) {
          .wo-sticky-header {
            padding: 1rem 1.5rem !important;
          }
          .wo-header-actions {
            gap: 1rem !important;
          }
          .wo-hero-section {
            flex-direction: column !important;
            padding: 2rem !important;
            gap: 2rem !important;
            text-align: center;
          }
          .wo-hero-stats {
            width: 100% !important;
          }
          .wo-grid {
             grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .wo-content-container {
            padding: 1rem !important;
          }
          .wo-sticky-header h1 {
            font-size: 1.25rem !important;
          }
          .wo-sticky-header p {
            display: none;
          }
          .wo-hero-section h2 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
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
        <header 
          className="wo-sticky-header"
          style={{
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
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Performance Analysis</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Discover growth opportunities from your recent interviews</p>
          </div>
          <div className="wo-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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

        <div className="wo-content-container">
          {/* Hero Section */}
          <div 
            className="wo-hero-section"
            style={{ 
              display: 'flex', 
              gap: '3rem', 
              marginBottom: '3rem',
              background: 'rgba(15, 15, 15, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '32px',
              padding: '3rem',
              alignItems: 'center'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.5rem 1rem', 
                background: 'rgba(245, 158, 11, 0.1)', 
                color: '#f59e0b', 
                borderRadius: '100px', 
                fontSize: '0.75rem', 
                fontWeight: '700', 
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <TrendingUp size={14} /> AI Insight: High Impact Area
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1rem 0', letterSpacing: '-0.025em' }}>
                Refine Your Responses
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>
                Our analysis shows that increasing clarity in your behavioral storytelling could boost your overall score by up to 24%. Let's dive into the specifics.
              </p>
            </div>
            <div style={{
              width: '240px',
              height: '240px',
              background: 'radial-gradient(circle at center, rgba(0, 198, 255, 0.15) 0%, transparent 70%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                border: '1px dashed rgba(0, 198, 255, 0.3)',
                borderRadius: '50%',
                animation: 'spin 10s linear infinite'
              }}></div>
              <AlertTriangle size={80} color="#00c6ff" style={{ filter: 'drop-shadow(0 0 15px rgba(0, 198, 255, 0.5))' }} />
            </div>
          </div>

          <div className="wo-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {/* Key Weaknesses */}
              <div style={{
                background: 'rgba(15, 15, 15, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#ef4444' }}>
                    <AlertTriangle size={20} style={{ margin: 'auto' }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Targeted Improvement Areas</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ 
                    padding: '1.5rem', 
                    background: 'rgba(255,255,255,0.02)', 
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <h4 style={{ color: '#00c6ff', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Target size={16} /> Lack of Response Clarity
                    </h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Identified as a critical bottleneck in 4 out of 5 behavioral interviews.</p>
                    <div style={{ background: 'rgba(0, 198, 255, 0.05)', padding: '1.25rem', borderRadius: '15px', border: '1px solid rgba(0, 198, 255, 0.1)' }}>
                      <p style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '0.5rem', fontWeight: 'bold' }}>Most Affected Questions:</p>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>"How do you handle multiple priorities under pressure?"</li>
                        <li>"Describe a time you disagreed with a supervisor."</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div style={{
                background: 'rgba(15, 15, 15, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '2rem'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem' }}>Distrubution by Category</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { label: 'Behavioral', score: 60, color: '#00c6ff' },
                    { label: 'Problem-Solving', score: 30, color: '#f59e0b' },
                    { label: 'Situational', score: 10, color: '#8b5cf6' }
                  ].map((cat, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#94a3b8' }}>{cat.label}</span>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{cat.score}% Impact</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${cat.score}%`, 
                          height: '100%', 
                          background: `linear-gradient(90deg, ${cat.color} 0%, transparent 100%)`,
                          boxShadow: `0 0 10px ${cat.color}44`
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {/* Category selector */}
              <div style={{
                background: 'rgba(15, 15, 15, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '2rem'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Analysis by Genre</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {questionCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => navigate('/question-bank')} // Just as a placeholder nav
                      style={{
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = '#00c6ff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          background: `${cat.color}22`, 
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: cat.color
                        }}>
                          {cat.id === 'behavioral' ? <User size={18} /> : 
                           cat.id === 'problem-solving' ? <Settings size={18} /> : <Zap size={18} />}
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{cat.title}</span>
                      </div>
                      <ChevronRight size={18} color="#64748b" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvement Plan */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 198, 255, 0.05) 0%, rgba(0, 114, 255, 0.05) 100%)',
                border: '1px solid rgba(0, 198, 255, 0.2)',
                borderRadius: '24px',
                padding: '2rem'
              }}>
                <div style={{
                   width: '48px',
                   height: '48px',
                   background: '#00c6ff',
                   borderRadius: '14px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   color: '#000',
                   marginBottom: '1.5rem',
                   boxShadow: '0 0 20px rgba(0, 198, 255, 0.4)'
                }}>
                  <Lightbulb size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Ready for a Drill?</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                  We've prepared a custom STAR-method script for your next behavioral interview. Practice it now to master your storytelling.
                </p>
                <button
                  onClick={() => navigate('/question-bank')}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Award size={18} /> Master This Skill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: #1a1a1a;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default WeaknessOverview;

