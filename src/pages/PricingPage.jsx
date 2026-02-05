import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check,
  X,
  RefreshCw,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  Home,
  Clock,
  HelpCircle,
  User,
  Settings,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const PricingPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
    const particleCount = 80;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
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
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 198, 255, ${0.1 * (1 - dist / 150)})`;
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

  const handleNavigation = (itemId) => {
    switch(itemId) {
      case 'dashboard': navigate('/user-dashboard'); break;
      case 'live-interview': navigate('/live-ai-interview'); break;
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

  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: '0',
      period: '/month',
      badge: 'STARTER',
      color: '#94a3b8',
      features: [
        { text: '5 mock interview sessions', included: true },
        { text: '20 Question bank sessions', included: true },
        { text: 'Basic performance feedback', included: true },
        { text: 'Monthly session renewal', included: true },
        { text: 'Personalized AI coaching', included: false }
      ]
    },
    {
      id: 'monthly',
      name: 'Pro Monthly',
      price: '399',
      period: '/month',
      badge: 'POPULAR',
      color: '#00c6ff',
      popular: true,
      features: [
        { text: 'Unlimited Live Interviews', included: true },
        { text: 'Unlimited Question Bank', included: true },
        { text: 'Advanced diagnostic feedback', included: true },
        { text: 'Strength & Weakness analysis', included: true },
        { text: 'Priority AI processing', included: true }
      ]
    },
    {
      id: 'yearly',
      name: 'Pro Yearly',
      price: '3,830',
      period: '/year',
      badge: 'BEST VALUE',
      color: '#8b5cf6',
      features: [
        { text: 'Unlimited Live Interviews', included: true },
        { text: 'Unlimited Question Bank', included: true },
        { text: 'Advanced diagnostic feedback', included: true },
        { text: 'Strength & Weakness analysis', included: true },
        { text: '20% discount applied', included: true, special: true }
      ]
    }
  ];

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

      <div style={{
        flex: 1,
        height: '100vh',
        overflow: 'auto',
        position: 'relative',
        zIndex: 1,
        padding: '2rem 3rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(0, 198, 255, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '99px',
              color: '#00c6ff',
              fontSize: '0.85rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              <Sparkles size={14} /> UPGRADE YOUR CAREER
            </div>
            <h1 className="shiny-title" style={{
              fontSize: '3.5rem',
              fontWeight: '900',
              letterSpacing: '-0.04em',
              marginBottom: '1rem'
            }}>
              Pricing Plans
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Choose the level of AI coaching that fits your ambition.
            </p>
          </div>

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                style={{
                  padding: '3rem 2.5rem',
                  borderRadius: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: '#00c6ff',
                    color: '#000',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px'
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    {plan.name.toUpperCase()}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: '3rem', fontWeight: '900' }}>₱{plan.price}</span>
                    <span style={{ color: '#64748b' }}>{plan.period}</span>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} style={{ 
                      display: 'flex', 
                      gap: '0.75rem', 
                      alignItems: 'center',
                      color: feature.included ? '#fff' : '#64748b',
                      fontSize: '0.95rem'
                    }}>
                      {feature.included ? (
                        <Check size={18} color="#00c6ff" />
                      ) : (
                        <X size={18} color="#ef4444" opacity={0.5} />
                      )}
                      {feature.text}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '3rem' }}>
                  <button
                    disabled={!agreedToTerms}
                    className="subscribe-btn"
                    style={{
                      width: '100%',
                      padding: '1.25rem',
                      borderRadius: '20px',
                      border: 'none',
                      background: plan.popular ? 'linear-gradient(to right, #00c6ff, #0072ff)' : 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: agreedToTerms ? 'pointer' : 'not-allowed',
                      opacity: agreedToTerms ? 1 : 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    Select {plan.name} <Zap size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Terms Agreement */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '2rem',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              style={{
                width: '24px',
                height: '24px',
                accentColor: '#00c6ff',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="terms" style={{ color: '#94a3b8', fontSize: '0.95rem', cursor: 'pointer' }}>
              I agree to the <span style={{ color: '#00c6ff', textDecoration: 'underline' }}>Subscription Terms</span>. 
              I understand that Pro plans provide unlimited AI evaluations and priority access.
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
