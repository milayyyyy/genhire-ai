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
  Mail,
  Camera,
  Bell,
  MapPin,
  Phone
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const ProfilePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const canvasRef = useRef(null);

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
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        email: userProfile.email || user?.email || '',
        phoneNumber: userProfile.phone_number || '',
        address: userProfile.address || ''
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [userProfile, user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          address: formData.address,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (itemId) => {
    switch (itemId) {
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      {/* Dynamic Background */}
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

      {/* Content Area */}
      <div style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Sticky Header */}
        <header style={{
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
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>My Profile</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Manage your personal informational and security</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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

        <div className="profile-content-container" style={{ padding: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
          {/* Profile Hero Section */}
          <div 
            className="profile-hero"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '3rem', 
              marginBottom: '4rem',
              background: 'rgba(15, 15, 15, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '32px',
              padding: '3rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'relative' }}>
              <div 
                className="profile-image-container"
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                  padding: '4px',
                  boxShadow: '0 0 30px rgba(0, 198, 255, 0.3)'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid #000'
                }}>
                  <img
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
              <button style={{
                position: 'absolute',
                bottom: 5,
                right: 5,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#00c6ff',
                color: '#000',
                border: '4px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}>
                <Camera size={18} />
              </button>
            </div>

            <div style={{ flex: 1 }}>
              <h2 
                className="profile-name"
                style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.025em' }}
              >
                {formData.firstName ? `${formData.firstName} ${formData.lastName}` : 'Candidate Name'}
              </h2>
              <div 
                className="profile-badges"
                style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#94a3b8' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} color="#00c6ff" />
                  <span>{formData.email}</span>
                </div>
                {formData.address && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="#00c6ff" />
                    <span>{formData.address}</span>
                  </div>
                )}
                {formData.phoneNumber && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={16} color="#00c6ff" />
                    <span>{formData.phoneNumber}</span>
                  </div>
                )}
              </div>

              <div 
                className="profile-stats"
                style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}
              >
                <div style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  padding: '1rem 1.5rem', 
                  borderRadius: '20px', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'center',
                  minWidth: '120px',
                  flex: 1
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00c6ff' }}>12</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In-depth Interviews</div>
                </div>
                <div style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  padding: '1rem 1.5rem', 
                  borderRadius: '20px', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'center',
                  minWidth: '120px',
                  flex: 1
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00c6ff' }}>78%</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg. Performance</div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div 
            className="profile-grid"
            style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}
          >
            {/* Main Information */}
            <div 
              className="profile-main-info"
              style={{
                background: 'rgba(15, 15, 15, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '2.5rem'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '6px', height: '18px', background: '#00c6ff', borderRadius: '3px' }}></div>
                Personal Details
              </h3>

              {message && (
                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {message}
                </div>
              )}
              {error && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div 
                  className="profile-form-row"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}
                >
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '500' }}>FIRST NAME</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '14px',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#00c6ff'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '500' }}>LAST NAME</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '14px',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#00c6ff'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '500' }}>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '14px',
                      color: '#475569',
                      fontSize: '1rem',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '500' }}>PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '14px',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00c6ff'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '500' }}>LOCATION</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="City, Country"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '14px',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00c6ff'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <button 
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '1rem 2rem',
                      background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '14px',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: loading ? 'wait' : 'pointer',
                      boxShadow: '0 4px 15px rgba(0, 198, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      width: '100%'
                    }}
                  >
                    {loading ? 'Processing Changes...' : 'Save Updates'}
                  </button>
                </div>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{
                background: 'rgba(0, 198, 255, 0.03)',
                border: '1px solid rgba(0, 198, 255, 0.1)',
                borderRadius: '24px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'rgba(0, 198, 255, 0.1)',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: '#00c6ff'
                }}>
                  <Zap size={28} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>Pro Level</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Your subscription is active until Oct 2024. Next billing: $19.00</p>
                <button style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Manage Subscription
                </button>
              </div>

              <div style={{
                background: 'rgba(15, 15, 15, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '2rem'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Security</h4>
                <button 
                  onClick={() => navigate('/reset-password')}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Settings size={16} />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
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
        ::-webkit-scrollbar-thumb:hover {
          background: #252525;
        }

        @media (max-width: 1024px) {
          .profile-content-container {
            padding: 1.5rem !important;
          }
          .profile-hero {
            flex-direction: column !important;
            text-align: center !important;
            gap: 2rem !important;
            padding: 2rem !important;
          }
          .profile-badges {
            justify-content: center !important;
          }
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          header {
            padding: 1rem 1.5rem !important;
          }
          .profile-name {
            font-size: 1.75rem !important;
          }
          .profile-stats {
            flex-direction: column !important;
          }
        }

        @media (max-width: 480px) {
          .profile-form-row {
            grid-template-columns: 1fr !important;
          }
          .profile-image-container {
            width: 120px !important;
            height: 120px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;

