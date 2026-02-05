import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Zap, ArrowRight, Settings, Home, Clock, HelpCircle, CreditCard, User } from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const LiveAIInterview = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedInterviewType, setSelectedInterviewType] = useState('behavioral');
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate');
  const [voiceRecording, setVoiceRecording] = useState(true);
  const [videoRecording, setVideoRecording] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    // Get topic from navigation state or sessionStorage
    const topic = location.state?.topic || sessionStorage.getItem('selectedTopic') || 'Software Engineering';
    setSelectedTopic(topic);
    sessionStorage.setItem('selectedTopic', topic);

    // Particle Animation
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
  }, [location]);

  const handleStartInterview = () => {
    // Save selections
    sessionStorage.setItem('interviewConfig', JSON.stringify({
      jobRole: selectedTopic,
      interviewType: selectedInterviewType,
      difficulty: selectedDifficulty,
      timestamp: new Date().toISOString()
    }));
    navigate('/voice-interview');
  };

  return (
    <div style={{
      minHeight: '100vh',
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

      <style>{`
        @keyframes robotFloat {
          0% { transform: translateY(0px) rotateX(5deg); }
          50% { transform: translateY(-15px) rotateX(15deg); }
          100% { transform: translateY(0px) rotateX(5deg); }
        }
        @keyframes visorPulse {
          0% { opacity: 0.8; box-shadow: 0 0 10px #00c6ff; }
          50% { opacity: 1; box-shadow: 0 0 25px #00c6ff; }
          100% { opacity: 0.8; box-shadow: 0 0 10px #00c6ff; }
        }
        @keyframes antennaPulse {
          0% { background: #64748b; }
          50% { background: #00c6ff; }
          100% { background: #64748b; }
        }
        @keyframes handFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        @keyframes robotWave {
          0%, 100% { transform: translateY(0px) rotate(-110deg); }
          25% { transform: translateY(-5px) rotate(-145deg); }
          50% { transform: translateY(0px) rotate(-120deg); }
          75% { transform: translateY(-5px) rotate(-145deg); }
        }
      `}</style>

      {/* Main Content */}
      <div style={{
        width: '100%',
        minHeight: '100vh',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        padding: '3rem'
      }}>
        {/* Left Side: Robot Preview */}
        <div style={{
          flex: '0 0 450px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '100%',
            aspectRatio: '1/1',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Hardcoded 3D-Style Robot */}
            <div style={{ 
              position: 'relative', 
              width: '300px', 
              height: '350px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              perspective: '1200px',
              animation: 'robotFloat 4s ease-in-out infinite'
            }}>
              
              {/* Antenna */}
              <div style={{
                width: '6px',
                height: '30px',
                background: '#64748b',
                position: 'relative',
                borderRadius: '3px'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '-4px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  animation: 'antennaPulse 2s infinite'
                }} />
              </div>

              {/* Head */}
              <div style={{
                width: '150px',
                height: '120px',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                borderRadius: '30px',
                border: '2px solid rgba(255,255,255,0.1)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)'
              }}>
                {/* Visor Area */}
                <div style={{
                  width: '80%',
                  height: '40%',
                  background: '#000',
                  borderRadius: '15px',
                  border: '1px solid rgba(0, 198, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px'
                }}>
                  {/* Eyes / Data Bar */}
                  <div style={{
                    width: '25px',
                    height: '6px',
                    background: '#00c6ff',
                    borderRadius: '3px',
                    animation: 'visorPulse 1.5s infinite'
                  }} />
                  <div style={{
                    width: '25px',
                    height: '6px',
                    background: '#00c6ff',
                    borderRadius: '3px',
                    animation: 'visorPulse 1.5s infinite'
                  }} />
                </div>
              </div>

              {/* Neck */}
              <div style={{
                width: '45px',
                height: '15px',
                background: '#334155',
                borderRadius: '3px'
              }} />

              {/* Body */}
              <div style={{
                width: '180px',
                height: '165px',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                borderRadius: '35px',
                border: '2px solid rgba(255,255,255,0.1)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)'
              }}>
                {/* Left Arm (Floating) */}
                <div style={{
                  position: 'absolute',
                  left: '-55px',
                  top: '30px',
                  width: '40px',
                  height: '75px',
                  background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  animation: 'handFloat 3s ease-in-out infinite'
                }} />

                {/* Right Arm (Waving) */}
                <div style={{
                  position: 'absolute',
                  right: '-55px',
                  top: '30px',
                  width: '40px',
                  height: '75px',
                  background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  animation: 'robotWave 2s ease-in-out infinite',
                  transformOrigin: 'top center'
                }} />
              </div>

              {/* Shadow underneath */}
              <div style={{
                marginTop: '25px',
                width: '150px',
                height: '15px',
                background: 'rgba(0, 198, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(8px)'
              }} />
            </div>
          </div>
          
          <div style={{ 
            marginTop: '2rem', 
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#00c6ff', marginBottom: '0.5rem' }}>AI Interview System</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Your dedicated AI coach is ready to analyze your responses in real-time.
            </p>
          </div>
        </div>

        {/* Right Side: Setup Form */}
        <div style={{ flex: 1, paddingLeft: '4rem', maxWidth: '700px' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#fff' }}>Configure Interview</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>Tailor your AI-powered performance evaluation session.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Role Display */}
            <div style={{
              background: 'rgba(0, 198, 255, 0.03)',
              border: '1px solid rgba(0, 198, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(0, 198, 255, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00c6ff' }}>
                  <Cpu size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Target Position</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>{selectedTopic}</div>
                </div>
              </div>
              <button onClick={() => navigate('/live-ai-interview-content-page')} style={{ background: 'transparent', border: 'none', color: '#00c6ff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Change</button>
            </div>

            {/* Interview Type Selection */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: '#00c6ff' }} />
                Session Focus
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {['behavioral', 'technical', 'situational'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedInterviewType(type)}
                    style={{
                      padding: '1.25rem',
                      background: selectedInterviewType === type ? 'rgba(0, 198, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${selectedInterviewType === type ? '#00c6ff' : 'rgba(255, 255, 255, 0.05)'}`,
                      borderRadius: '16px',
                      color: selectedInterviewType === type ? '#fff' : '#94a3b8',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: '700', marginBottom: '0.25rem', textTransform: 'capitalize' }}>{type}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                      {type === 'behavioral' && 'Soft skills & STAR method'}
                      {type === 'technical' && 'Problem solving & core skills'}
                      {type === 'situational' && 'Real-world scenarios'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} style={{ color: '#0cffae' }} />
                Difficulty Level
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    style={{
                      padding: '1.25rem',
                      background: selectedDifficulty === level ? 'rgba(12, 255, 174, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${selectedDifficulty === level ? '#0cffae' : 'rgba(255, 255, 255, 0.05)'}`,
                      borderRadius: '16px',
                      color: selectedDifficulty === level ? '#fff' : '#94a3b8',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: '700', marginBottom: '0.25rem', textTransform: 'capitalize' }}>{level}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                      {level === 'beginner' && 'Fundamentals'}
                      {level === 'intermediate' && 'Mid-level proficiency'}
                      {level === 'advanced' && 'Expert analysis'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              style={{
                marginTop: '1rem',
                width: '100%',
                padding: '1.25rem',
                background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(0, 198, 255, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 198, 255, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 198, 255, 0.2)';
              }}
            >
              Start Session
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAIInterview;
