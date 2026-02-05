import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Clock, 
  Zap, 
  HelpCircle, 
  CreditCard, 
  User, 
  Settings,
  LogOut,
  X
} from 'lucide-react';
import ChatBubbleLogo from './ChatBubbleLogo';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/user-dashboard' },
    { id: 'past-interviews', icon: Clock, label: 'Past Interviews', path: '/weakness-overview' },
    { id: 'live-interview', icon: Zap, label: 'Live AI Interview', path: '/live-ai-interview' },
    { id: 'question-bank', icon: HelpCircle, label: 'Question Bank', path: '/question-bank' },
    { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions', path: '/my-plan' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <div style={{
      width: '280px',
      height: '100vh',
      backgroundColor: '#000',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: isOpen ? 0 : '-280px',
      top: 0,
      zIndex: 1000,
      transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isOpen ? '20px 0 50px rgba(0, 0, 0, 0.5)' : 'none'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          to { background-position: 200% center; }
        }
        @media (max-width: 1024px) {
          .mobile-close-btn { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .mobile-close-btn { display: none !important; }
        }
      `}} />

      {/* Sidebar Header */}
      <div style={{
        padding: '2.5rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.9rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <ChatBubbleLogo size={42} />
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            margin: 0,
            background: 'linear-gradient(to right, #fff, #00c6ff, #fff)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shine 5s linear infinite'
          }}>
            GenHire AI
          </h2>
        </div>
        
        <button 
          className="mobile-close-btn"
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            color: '#fff',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1, padding: '1.5rem 0', overflowY: 'auto' }}>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.5rem',
                backgroundColor: 'transparent',
                color: isActive ? '#00c6ff' : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                borderRight: isActive ? '2px solid #00c6ff' : '2px solid transparent',
                background: isActive ? 'linear-gradient(90deg, transparent, rgba(0, 198, 255, 0.05))' : 'transparent'
              }}
            >
              <Icon size={18} style={{ opacity: isActive ? 1 : 0.7 }} />
              <span style={{ fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button Area */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.75rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;