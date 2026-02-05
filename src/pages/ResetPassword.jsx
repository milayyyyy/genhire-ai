import React, { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMessage('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

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
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ChatBubbleLogo size={42} />
              </div>
              <h1 className="shiny-title" style={{
                fontSize: '2rem',
                fontWeight: '800',
                marginBottom: '0.6rem',
                letterSpacing: '-0.02em'
              }}>
                Security
              </h1>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                Create a new secure password for your account.
              </p>
            </div>

            {message ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#00ff80' }}>
                  <CheckCircle2 size={64} />
                </div>
                <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Success!</div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>{message}</p>
                <div style={{ color: '#00c6ff', fontSize: '0.8rem' }}>Redirecting to login...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: '#64748b' }}>
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    style={{
                      width: '100%',
                      padding: '0.875rem 3.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      outline: 'none',
                      fontSize: '0.95rem',
                      color: '#fff'
                    }}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', zIndex: 1 }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: '#64748b' }}>
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    style={{
                      width: '100%',
                      padding: '0.875rem 3.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      outline: 'none',
                      fontSize: '0.95rem',
                      color: '#fff'
                    }}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', zIndex: 1 }}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ff4d4d', backgroundColor: 'rgba(255, 77, 77, 0.05)', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid rgba(255, 77, 77, 0.1)' }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '1rem',
                    background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    marginTop: '1rem'
                  }}
                >
                  {loading ? 'Updating...' : 'Set New Password'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            )}

            <div style={{
              marginTop: '1.5rem',
              textAlign: 'center'
            }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>

        <div style={{
          flex: '1.2',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem'
        }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', lineHeight: '1.2', marginBottom: '2rem' }}>
            Account<br />
            <span style={{ color: '#00c6ff' }}>Recovery.</span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#94a3b8', lineHeight: '1.8', maxWidth: '500px' }}>
            Choose a strong password with at least 6 characters. Your security is our top priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

