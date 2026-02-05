import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SignUp = ({ onBackToLogin, onSignUpSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  
  const { signUp } = useAuth();

  // Particle Effect Logic (Landing Page style)
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await signUp(formData.email, formData.password);
      if (error) throw error;
      onSignUpSuccess(formData.email);
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in clicked');
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

      {/* Auth Container */}
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Left side - Sign Up Form */}
        <div style={{
          width: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 className="shiny-title" style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                marginBottom: '0.75rem',
                letterSpacing: '-0.02em'
              }}>
                Create Account
              </h1>
              <p style={{
                color: '#94a3b8',
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }}>
                Start your journey with GenHire AI today.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: '#64748b' }}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full name"
                  style={{
                    width: '100%',
                    padding: '1.1rem 1rem 1.1rem 3.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#fff',
                    transition: 'all 0.2s'
                  }}
                  required
                />
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: '#64748b' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  style={{
                    width: '100%',
                    padding: '1.1rem 1rem 1.1rem 3.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#fff',
                    transition: 'all 0.2s'
                  }}
                  required
                />
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: '#64748b' }}>
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  style={{
                    width: '100%',
                    padding: '1.1rem 1rem 1.1rem 3.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#fff',
                    transition: 'all 0.2s'
                  }}
                  required
                />
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: '#64748b' }}>
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  style={{
                    width: '100%',
                    padding: '1.1rem 1rem 1.1rem 3.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#fff',
                    transition: 'all 0.2s'
                  }}
                  required
                />
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ff4d4d', backgroundColor: 'rgba(255, 77, 77, 0.05)', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid rgba(255, 77, 77, 0.1)' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  gap: '0.8rem',
                  transition: 'all 0.3s'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={onBackToLogin}
                  style={{
                    flex: 1,
                    padding: '1.1rem',
                    background: 'transparent',
                    border: '1px solid #00c6ff',
                    color: '#00c6ff',
                    borderRadius: '16px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '1.1rem',
                    background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 8px 30px rgba(0, 198, 255, 0.2)',
                    transition: 'all 0.3s'
                  }}
                >
                  {loading ? '...' : 'Sign Up'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Image */}
        <div style={{
          width: '50%',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <img 
            src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1600" 
            alt="Interview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent 50%)'
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

