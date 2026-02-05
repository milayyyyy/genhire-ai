import React, { useEffect, useRef } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const EmailVerification = ({ onProceed, userEmail }) => {
  const canvasRef = useRef(null);
  
  const handleProceed = () => {
    onProceed();
  };

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

  return (
    <div style={{ 
      height: '100vh',
      width: '100vw',
      display: 'flex',
      fontFamily: "'Inter', sans-serif",
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#000',
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
          zIndex: 1,
          opacity: 0.8
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}} />

      <div style={{
        width: '100%',
        maxWidth: '1200px',
        height: '100vh',
        display: 'flex',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          flex: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            background: 'rgba(10, 10, 10, 0.4)',
            backdropFilter: 'blur(20px)',
            padding: '2.5rem 3rem',
            borderRadius: '32px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'rgba(0, 198, 255, 0.1)', 
                borderRadius: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#00c6ff',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <Mail size={40} />
              </div>
            </div>

            <h1 className="shiny-title" style={{
              fontSize: '2rem',
              fontWeight: '800',
              marginBottom: '0.6rem',
              letterSpacing: '-0.02em'
            }}>
              Verify Email
            </h1>
            
            <p style={{
              color: '#94a3b8',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
              Check your inbox for a verification link. Follow it to unlock full access to GenHire AI.
            </p>

            {userEmail && (
              <div style={{
                padding: '0.875rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                marginBottom: '2rem',
                fontSize: '0.9rem',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle size={16} color="#00ff80" />
                <span>Sent to: <strong>{userEmail}</strong></span>
              </div>
            )}

            <button
              onClick={handleProceed}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(0, 198, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s'
              }}
            >
              Continue to Dashboard
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => {}}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '0.875rem',
                marginTop: '1.5rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Didn't receive code? Resend
            </button>
          </div>
        </div>

        <div style={{
          flex: '1.2',
          display: window.innerWidth >= 1024 ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem'
        }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', lineHeight: '1.2', marginBottom: '2rem' }}>
            Check Your<br />
            <span style={{ color: '#00c6ff' }}>Inbox.</span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#94a3b8', lineHeight: '1.8', maxWidth: '500px' }}>
            Verification ensures your account remains secure and your performance analytics private.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;


