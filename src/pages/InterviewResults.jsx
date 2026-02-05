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
  Star,
  MessageSquare,
  Lightbulb,
  Download,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';
import { analyzeAnswer } from '../services/aiAnalysisService';
import jsPDF from 'jspdf';
import { useAuth } from '../contexts/AuthContext';

const InterviewResults = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interviewData, setInterviewData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    loadInterviewData();
  }, []);

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

  const loadInterviewData = async () => {
    try {
      const messages = JSON.parse(localStorage.getItem('interview_messages') || '[]');
      const config = JSON.parse(sessionStorage.getItem('interviewConfig') || '{}');
      
      // Extract Q&A pairs
      const qaList = [];
      for (let i = 1; i < messages.length; i++) {
        if (messages[i].role === 'assistant' && messages[i + 1]?.role === 'user') {
          qaList.push({
            question: messages[i].content,
            answer: messages[i + 1].content
          });
        }
      }

      setInterviewData({
        qaList: qaList.slice(0, 5),
        config
      });

      // Generate AI analysis
      if (qaList.length > 0) {
        const analysisPrompt = qaList.map((qa, idx) => 
          `Q${idx + 1}: ${qa.question}\nA${idx + 1}: ${qa.answer}`
        ).join('\n\n');
        
        const analysis = await analyzeAnswer(
          'Overall Interview Performance',
          analysisPrompt
        );
        setAiAnalysis(analysis);
      }
    } catch (error) {
      console.error('Error loading interview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = () => {
    if (!interviewData?.qaList) return 0;
    const avgLength = interviewData.qaList.reduce((sum, qa) => sum + qa.answer.length, 0) / interviewData.qaList.length;
    return Math.min(5, Math.max(1, Math.round(avgLength / 50)));
  };

  const exportToPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Logo
    doc.setFillColor(6, 182, 212);
    doc.circle(pageWidth - 25, 15, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('GH', pageWidth - 28, 18);
    doc.setTextColor(0, 0, 0);

    // Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('GenHire AI', margin, yPosition);
    yPosition += 10;
    doc.setFontSize(16);
    doc.text('Interview Analysis Report', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(14);
    doc.text(`Overall Score: ${calculateScore()}/5`, margin, yPosition);
    yPosition += 15;

    // Questions and Answers
    interviewData?.qaList.forEach((qa, idx) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Question ${idx + 1}:`, margin, yPosition);
      yPosition += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const qLines = doc.splitTextToSize(qa.question, pageWidth - 2 * margin);
      doc.text(qLines, margin, yPosition);
      yPosition += qLines.length * 5 + 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`Your Answer:`, margin, yPosition);
      yPosition += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const aLines = doc.splitTextToSize(qa.answer, pageWidth - 2 * margin);
      doc.text(aLines, margin, yPosition);
      yPosition += aLines.length * 5 + 10;
    });

    // AI Analysis
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Analysis:', margin, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const analysisLines = doc.splitTextToSize(aiAnalysis, pageWidth - 2 * margin);
    
    for (let i = 0; i < analysisLines.length; i++) {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(analysisLines[i], margin, yPosition);
      yPosition += 5;
    }

    doc.save(`GenHire-AI-Results-${Date.now()}.pdf`);
  };

  const handleNavigation = (itemId) => {
    switch(itemId) {
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

  const score = calculateScore();
  const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 3,
    shape: Math.random() > 0.5 ? 'triangle' : 'circle'
  }));

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#000',
        color: '#fff'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(0, 198, 255, 0.1)',
          borderTop: '3px solid #00c6ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} />
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Analyzing Performance...</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

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
        height: '100vh',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Sticky Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(12px)',
          padding: '1.25rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Interview Analysis</h2>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: 0 }}>Performance breakdown and AI insights</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={exportToPDF}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                background: 'rgba(0, 198, 255, 0.1)',
                border: '1px solid rgba(0, 198, 255, 0.2)',
                borderRadius: '10px',
                color: '#00c6ff',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(0, 198, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(0, 198, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Download size={18} />
              Export PDF
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              paddingLeft: '1rem',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user?.displayName || 'User'}</div>
                <div style={{ fontSize: '0.75rem', color: '#00c6ff' }}>Premium Member</div>
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                {user?.displayName?.[0] || 'U'}
              </div>
            </div>
          </div>
        </header>

        <div className="results-content-container" style={{ padding: '2.5rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          {/* Score Overview Card */}
          <div 
            className="score-overview-card"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(12px)',
              borderRadius: '24px',
              padding: '3rem 2rem',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '2.5rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(0, 198, 255, 0.05) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Overall Performance Score</p>
              <div 
                className="score-display"
                style={{
                  fontSize: '7rem',
                  fontWeight: '900',
                  background: 'linear-gradient(to bottom, #fff, #94a3b8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                  marginBottom: '1rem'
                }}
              >
                {score}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={28}
                    fill={s <= score ? '#00c6ff' : 'transparent'}
                    stroke={s <= score ? '#00c6ff' : 'rgba(255, 255, 255, 0.2)'}
                    style={{ filter: s <= score ? 'drop-shadow(0 0 8px rgba(0, 198, 255, 0.5))' : 'none' }}
                  />
                ))}
              </div>

              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1.5rem',
                background: score >= 4 ? 'rgba(34, 197, 94, 0.1)' : score >= 3 ? 'rgba(0, 198, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${score >= 4 ? 'rgba(34, 197, 94, 0.2)' : score >= 3 ? 'rgba(0, 198, 255, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                borderRadius: '100px',
                color: score >= 4 ? '#4ade80' : score >= 3 ? '#00c6ff' : '#f87171',
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                {score >= 4 ? 'Exceptional Performance' : score >= 3 ? 'Strong Performance' : 'Growth Opportunities'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
            {/* AI Analysis Card */}
            <div 
              className="ai-analysis-card"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                padding: '2.5rem',
                border: '1px solid rgba(0, 198, 255, 0.1)',
                position: 'relative'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(0, 198, 255, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00c6ff'
                }}>
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>AI Performance Insight</h3>
                  <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: 0 }}>Nuanced feedback based on your responses</p>
                </div>
              </div>

              <div style={{
                fontSize: '1.05rem',
                lineHeight: '1.8',
                color: '#cbd5e1',
                whiteSpace: 'pre-wrap',
                fontWeight: '400'
              }}>
                {aiAnalysis || 'Synthesizing your interview data...'}
              </div>
            </div>

            {/* Questions Breakdown */}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Clock size={24} style={{ color: '#00c6ff' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Response Breakdown</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {interviewData?.qaList.map((qa, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div 
                      className="qa-row"
                      style={{ display: 'flex', gap: '1.5rem' }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00c6ff',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.75rem', fontWeight: '600' }}>Question</h4>
                          <p style={{ color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>{qa.question}</p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', color: '#00c6ff', marginBottom: '0.75rem', fontWeight: '600' }}>Your Response</h4>
                          <div style={{
                            background: 'rgba(0, 198, 255, 0.03)',
                            padding: '1.25rem',
                            borderRadius: '12px',
                            borderLeft: '3px solid #00c6ff',
                            color: '#e2e8f0',
                            lineHeight: '1.7',
                            fontSize: '1rem'
                          }}>
                            {qa.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/user-dashboard')}
              style={{
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
                marginTop: '1rem',
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
              Return to Dashboard
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .results-content-container {
              padding: 1.5rem !important;
            }
          }
          @media (max-width: 768px) {
            header {
              padding: 1rem 1.5rem !important;
            }
            .score-display {
              font-size: 5rem !important;
            }
            .qa-row {
              flex-direction: column !important;
              gap: 1rem !important;
            }
          }
          @media (max-width: 480px) {
            .score-display {
              font-size: 4rem !important;
            }
            .ai-analysis-card {
              padding: 1.5rem !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default InterviewResults;

