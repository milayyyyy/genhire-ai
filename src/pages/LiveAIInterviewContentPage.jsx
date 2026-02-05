import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Globe, Database, Briefcase, Calculator, Heart, TrendingUp, HardDrive, Sparkles, ArrowRight, ArrowLeft, Search, ChevronRight, Cpu } from 'lucide-react';
import { fetchJobCategories } from '../services/interviewService';

const LiveAIInterviewContentPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    Code,
    Globe,
    Database,
    Briefcase,
    Calculator,
    Heart,
    TrendingUp,
    HardDrive,
    Sparkles,
    Cpu
  };

  useEffect(() => {
    const loadTopics = async () => {
      setLoading(true);
      const data = await fetchJobCategories();
      if (data && data.length > 0) {
        setTopics(data.map(t => ({
          ...t,
          icon: iconMap[t.icon_name] || Code
        })));
      } else {
        // Fallback to initial mock if table is empty
        setTopics([
          {
            id: 'software-engineering',
            title: 'Software Engineering',
            description: 'Master full-stack development, algorithms, system design, and scalable architecture',
            highlights: ['Data Structures & Algorithms', 'System Design', 'OOP Principles', 'Code Optimization'],
            icon: Code,
            color: '#3b82f6'
          },
          {
            id: 'web-development',
            title: 'Web Development',
            description: 'Frontend, backend, responsive design, modern frameworks and best practices',
            highlights: ['Frontend Frameworks', 'Backend APIs', 'Responsive Design', 'Web Performance'],
            icon: Globe,
            color: '#8b5cf6'
          }
        ]);
      }
      setLoading(false);
    };
    loadTopics();
  }, []);

  useEffect(() => {
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

  const handleTopicSelect = (topic) => {
    navigate('/live-ai-interview', { state: { topic: topic.title } });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Grid Elements */}
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

      <style>{`
        @keyframes shine {
          to { background-position: 200% center; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Content Area */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        height: '100vh',
        overflowY: 'auto',
        padding: '0 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 0' }}>
          {/* Header */}
          <header style={{ textAlign: 'center', marginBottom: '4rem', animation: 'fadeInUp 0.8s ease-out' }}>
            <div style={{ 
                display: 'inline-flex', 
                padding: '0.5rem 1rem', 
                backgroundColor: 'rgba(0, 198, 255, 0.1)', 
                borderRadius: '100px',
                border: '1px solid rgba(0, 198, 255, 0.2)',
                color: '#00c6ff',
                fontSize: '0.8rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.5rem'
            }}>
                Interview Customization
            </div>
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '800', 
              marginBottom: '1.5rem', 
              letterSpacing: '-0.03em',
              background: 'linear-gradient(to right, #fff, #00c6ff, #fff)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shine 5s linear infinite'
            }}>
              Choose Your <span style={{ color: '#00c6ff' }}>Focus</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Select a category to begin your personalized AI interview experience
            </p>
          </header>

          {/* Topics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            animation: 'fadeInUp 1s ease-out'
          }}>
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
                <Sparkles size={48} className="animate-pulse" style={{ marginBottom: '1rem', color: '#00c6ff' }} />
                <p>Curating real-time career paths...</p>
              </div>
            ) : topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <div
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(0, 198, 255, 0.3)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 198, 255, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    border: `1px solid ${topic.color}44`,
                    boxShadow: `0 0 15px ${topic.color}22`
                  }}>
                    <Icon size={32} color={topic.color} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    marginBottom: '0.75rem',
                    margin: 0
                  }}>
                    {topic.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#94a3b8',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    flex: 1
                  }}>
                    {topic.description}
                  </p>

                  {/* Highlights */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '2rem'
                  }}>
                    {topic.highlights.map((highlight, hIdx) => (
                      <span
                        key={hIdx}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.4rem 0.8rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          color: '#cbd5e1',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          fontWeight: '500'
                        }}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Arrow indicator */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: '#00c6ff',
                    fontWeight: '700',
                    fontSize: '0.95rem'
                  }}>
                    Start Session
                    <ArrowRight size={18} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAIInterviewContentPage;

