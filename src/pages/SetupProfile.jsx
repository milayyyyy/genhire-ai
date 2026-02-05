import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, AlertCircle } from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const SetupProfile = ({ onComplete, onSkip }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    elementary: '',
    highSchool: '',
    college: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill email from auth user
  React.useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          address: formData.address,
          education: {
            elementary: formData.elementary,
            high_school: formData.highSchool,
            college: formData.college
          },
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;
      onComplete?.(formData);
    } catch (err) {
      setError(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    console.log('Profile setup skipped');
    onSkip();
  };

  return (
    <div style={{ 
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Poppins', 'Inter', sans-serif",
      margin: 0,
      padding: 0,
      overflowX: 'hidden',
      backgroundColor: '#000',
      position: 'relative'
    }}>
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
        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 198, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 198, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          zIndex: 1;
        }
        .bg-blob {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(0, 198, 255, 0.1) 0%, rgba(0, 114, 255, 0) 70%);
          border-radius: 50%;
          filter: blur(80px);
          zIndex: 0;
          pointer-events: none;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 198, 255, 0.5);
        }
        @media (max-width: 1024px) {
          .setup-form-container {
            flex-direction: column !important;
            gap: 2rem !important;
          }
          .setup-section {
            width: 100% !important;
          }
        }
      `}} />

      <div className="grid-overlay"></div>
      <div className="bg-blob" style={{ top: '10%', left: '10%' }}></div>
      <div className="bg-blob" style={{ bottom: '10%', right: '10%', background: 'radial-gradient(circle, rgba(255, 0, 255, 0.05) 0%, transparent 70%)' }}></div>

      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 className="shiny-title" style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Setup Profile
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.95rem',
            lineHeight: '1.4',
            maxWidth: '500px'
          }}>
            Help us personalize your interview experience.
          </p>
        </div>

        {/* Setup Profile Form */}
        <form onSubmit={handleSubmit} style={{ 
          width: '100%',
          maxWidth: '900px',
          display: 'flex', 
          flexDirection: 'column',
          gap: '2rem'
        }}>
          <div className="setup-form-container" style={{
            display: 'flex',
            gap: '3rem',
            width: '100%',
            alignItems: 'flex-start'
          }}>
            {/* Personal Details Section */}
            <div className="setup-section" style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '1.2rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <User size={20} color="#00c6ff" />
                Personal Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    style={{
                      flex: 1,
                      padding: '0.85rem 1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.75rem',
                      outline: 'none',
                      fontSize: '0.95rem',
                      color: '#fff',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00c6ff';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    }}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    style={{
                      flex: 1,
                      padding: '0.85rem 1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.75rem',
                      outline: 'none',
                      fontSize: '0.95rem',
                      color: '#fff',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00c6ff';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    }}
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00c6ff';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  }}
                />

                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00c6ff';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  }}
                />

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Home Address"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00c6ff';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  }}
                />
              </div>
            </div>

            {/* Education Section */}
            <div className="setup-section" style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '1.2rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <GraduationCap size={20} color="#00c6ff" />
                Education
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  name="elementary"
                  value={formData.elementary}
                  onChange={handleChange}
                  placeholder="Elementary School"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00c6ff';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  }}
                />

                <input
                  type="text"
                  name="highSchool"
                  value={formData.highSchool}
                  onChange={handleChange}
                  placeholder="Senior High School"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00c6ff';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  }}
                />

                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="University / College"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00c6ff';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            marginTop: '0.5rem'
          }}>
            <button
              type="button"
              onClick={handleSkip}
              style={{
                width: '180px',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '2rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              SKIP
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '180px',
                padding: '1rem',
                background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
                color: 'white',
                border: 'none',
                borderRadius: '2rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 10px 20px rgba(0, 198, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'SAVING...' : 'FINISH'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupProfile;

