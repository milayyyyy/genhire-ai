import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Home, 
  Clock, 
  Zap, 
  CreditCard, 
  User, 
  Settings,
  LogOut,
  Mail,
  MessageCircle
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const Faq = ({ onLogout }) => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);
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
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5
        });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 198, 255, 0.4)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 198, 255, ${0.1 * (1 - dist / 120)})`;
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
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleNavigation = (itemId) => {
    switch(itemId) {
      case 'dashboard': navigate('/user-dashboard'); break;
      case 'live-interview': navigate('/live-ai-interview-content-page'); break;
      case 'past-interviews': navigate('/weakness-overview'); break;
      case 'question-bank': navigate('/question-bank'); break;
      case 'subscriptions': navigate('/my-plan'); break;
      case 'profile': navigate('/profile'); break;
      case 'settings': navigate('/settings'); break;
      default: break;
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

  const faqs = [
    {
      question: "How does the AI interview work?",
      answer: "Our AI interviewer uses advanced speech recognition and natural language processing to conduct realistic interview sessions. It asks questions, listens to your responses, and provides instant feedback on your performance."
    },
    {
      question: "Can I customize the interview questions?",
      answer: "Yes! You can choose from our Question Bank or create custom interview sessions tailored to specific job roles, industries, or skill levels."
    },
    {
      question: "How is my performance rated?",
      answer: "The AI evaluates your responses based on clarity, relevance, confidence, and content quality. You'll receive detailed feedback on strengths and areas for improvement."
    },
    {
      question: "Can I retry my answers?",
      answer: "Absolutely! If you enable the 'Answer Revision' option in your settings, you can redo your response before moving to the next question."
    },
    {
      question: "Is my interview data secure?",
      answer: "Yes, we take your privacy seriously. All interview sessions and personal data are encrypted and stored securely. We never share your information with third parties."
    },
    {
      question: "What subscription plans are available?",
      answer: "We offer Free, Pro Monthly, and Pro Yearly plans. The Free plan includes limited interviews, while Pro plans offer unlimited interviews and priority AI processing."
    }
  ];

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      <style>{`
        .faq-content-container {
          padding: 3rem;
        }
        @media (max-width: 1024px) {
          .faq-content-container {
            padding: 2rem !important;
            margin-top: 60px !important;
          }
        }
        @media (max-width: 768px) {
          .faq-header h1 {
            font-size: 2.25rem !important;
          }
          .faq-header p {
            font-size: 1rem !important;
          }
          .faq-cta {
            padding: 2rem !important;
          }
          .faq-question-btn {
            padding: 1.25rem 1.5rem !important;
          }
          .faq-question-btn span {
            font-size: 1rem !important;
          }
          .faq-answer-box {
            padding: 0 1.5rem 1.5rem 1.5rem !important;
          }
        }
        @media (max-width: 480px) {
          .faq-content-container {
            padding: 1.5rem 1rem !important;
          }
          .faq-header h1 {
            font-size: 1.75rem !important;
          }
          .faq-header {
            margin-bottom: 2.5rem !important;
          }
          .faq-cta {
            padding: 1.5rem !important;
          }
          .faq-cta h2 {
            font-size: 1.25rem !important;
          }
        }
      `}</style>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

      <div 
        className="faq-content-container"
        style={{
          flex: 1,
          height: '100vh',
          overflow: 'auto',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <header className="faq-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
                Support Center
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
              Common <span style={{ color: '#00c6ff' }}>Questions</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need to know about InterviewPro and our AI-powered coaching platform.
            </p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="faq-question-btn"
                  style={{
                    width: '100%',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: expandedIndex === index ? 'rgba(0, 198, 255, 0.05)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#fff',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: expandedIndex === index ? '#00c6ff' : '#fff'
                  }}>
                    {faq.question}
                  </span>
                  {expandedIndex === index ? (
                    <ChevronUp size={20} color="#00c6ff" />
                  ) : (
                    <ChevronDown size={20} color="#64748b" />
                  )}
                </button>

                {expandedIndex === index && (
                  <div 
                    className="faq-answer-box"
                    style={{
                      padding: '0 2rem 2rem 2rem',
                      backgroundColor: 'rgba(0, 198, 255, 0.05)'
                    }}
                  >
                    <p style={{
                      fontSize: '1rem',
                      color: '#94a3b8',
                      margin: 0,
                      lineHeight: '1.7'
                    }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div 
            className="faq-cta"
            style={{
              marginTop: '4rem',
              background: 'linear-gradient(135deg, rgba(0, 198, 255, 0.1) 0%, rgba(0, 114, 255, 0.1) 100%)',
              border: '1px solid rgba(0, 198, 255, 0.2)',
              borderRadius: '24px',
              padding: '3rem',
              textAlign: 'center'
            }}
          >
            <MessageCircle size={40} color="#00c6ff" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Still have questions?</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              We're here to help you succeed. Reach out to our team anytime.
            </p>
            <a
              href="mailto:ai.interview.capstone@gmail.com"
              style={{
                display: 'inline-block',
                padding: '1rem 2.5rem',
                backgroundColor: '#00c6ff',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '14px',
                fontWeight: '700',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
