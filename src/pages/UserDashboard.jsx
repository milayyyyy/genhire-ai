import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Clock, 
  Zap, 
  HelpCircle, 
  CreditCard, 
  User, 
  Settings,
  BarChart3,
  Calendar,
  MessageCircle,
  Star,
  Bell
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserInterviews, fetchInterviewStats } from '../services/interviewService';

const UserDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const canvasRef = useRef(null);
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({ avgRating: '0.0', practiceSessions: '0', avgLength: '0s', streak: '0' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const [interviewData, statsData] = await Promise.all([
            fetchUserInterviews(user.id),
            fetchInterviewStats(user.id)
          ]);
          setInterviews(interviewData);
          setStats(statsData);
        } catch (error) {
          console.error("Error loading dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadDashboardData();
  }, [user]);

  useEffect(() => {
    // Particle Animation - Same as Landing Page
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

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
      backgroundColor: '#000',
      position: 'relative',
      color: '#fff'
    }}>
      {/* Background Elements - Unified with Landing Style */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'linear-gradient(rgba(0, 198, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 198, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <style>{`
        @keyframes shine {
          to { background-position: 200% center; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .main-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .header-hook { padding-left: 5rem !important; }
          .welcome-text { fontSize: 1.4rem !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        height: '100vh',
        overflow: 'auto',
        position: 'relative',
        zIndex: 1,
        padding: '0 1.5rem'
      }}>
        {/* Header Hook */}
        <div 
          className="header-hook"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2rem 0',
            position: 'sticky',
            top: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            zIndex: 5,
            margin: '0 -1.5rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
          }}
        >
          <div>
            <h1 
              className="welcome-text"
              style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                margin: 0,
                letterSpacing: '-0.02em',
                animation: 'fadeInUp 0.6s ease-out'
              }}
            >
              Welcome back, <span style={{ color: '#00c6ff' }}>{userProfile?.first_name || 'Innovator'}</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{
              padding: '0.6rem 1rem',
              background: 'rgba(0, 198, 255, 0.1)',
              border: '1px solid rgba(0, 198, 255, 0.2)',
              borderRadius: '2rem',
              fontSize: '0.85rem',
              color: '#00c6ff',
              fontWeight: '600'
            }}>
              Pro Plan
            </div>
            <button style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff'
            }}>
              <Bell size={18} />
            </button>
          </div>
        </div>

        <div style={{ padding: '2rem 0', animation: 'fadeInUp 0.8s ease-out' }}>
          {/* Performance Snapshot */}
          <section style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '1.5rem',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <BarChart3 size={22} color="#00c6ff" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Performance Stats</h2>
            </div>

            <div 
              className="stats-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.5rem'
              }}
            >
              {[
                { label: 'Avg Rating', value: stats.avgRating, icon: Star, color: '#facc15' },
                { label: 'Practice Sessions', value: stats.practiceSessions, icon: Zap, color: '#00c6ff' },
                { label: 'Avg Length', value: stats.avgLength, icon: Clock, color: '#4ade80' },
                { label: 'Answer Streak', value: stats.streak, icon: MessageCircle, color: '#f87171' }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.03)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.85rem' }}>{stat.label}</span>
                    <stat.icon size={16} color={stat.color} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions & Recent Sessions */}
          <div 
            className="main-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}
          >
            {/* Recent Sessions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '1.5rem',
              padding: '2rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Recent Interviews</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading sessions...</div>
                ) : interviews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No interview sessions yet.</div>
                ) : (
                  interviews.slice(0, 5).map((interview, i) => (
                    <div key={interview.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1.25rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.03)'
                    }}>
                      <div style={{
                        width: '48px', height: '48px',
                        background: 'rgba(0, 198, 255, 0.1)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.25rem', fontWeight: '800', color: '#00c6ff',
                        marginRight: '1.25rem'
                      }}>
                        {interviews.length - i}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.4rem 0', fontWeight: '600' }}>
                          {interview.topic} ({interview.interviewType})
                        </h4>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Calendar size={12} /> {new Date(interview.created_at).toLocaleDateString()}
                          </span>
                          <span style={{ color: '#facc15' }}>
                            {'★'.repeat(Math.round(parseFloat(interview.overall_score || 0) / 20))}
                            {'☆'.repeat(5 - Math.round(parseFloat(interview.overall_score || 0) / 20))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CTA Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                borderRadius: '1.5rem',
                padding: '2rem',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }} onClick={() => navigate('/live-ai-interview')}>
                <Zap size={48} style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.2 }} />
                <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '800', fontSize: '1.5rem' }}>Start Live AI</h3>
                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.85rem' }}>Jump into a real-time voice interview now.</p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '1rem' }}>Learning Progress</div>
                <div style={{ 
                  height: '6px', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '3px',
                  position: 'relative'
                }}>
                  <div style={{ 
                    position: 'absolute', left: 0, top: 0, height: '100%', width: '75%', 
                    background: '#00c6ff', borderRadius: '3px',
                    boxShadow: '0 0 10px rgba(0, 198, 255, 0.5)'
                  }} />
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '1.25rem', fontWeight: '700' }}>75%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

