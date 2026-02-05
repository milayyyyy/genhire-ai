import React from 'react';

const ChatBubbleLogo = ({ size = 64 }) => {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <img 
        src="/assets/images/ai-logo.png" 
        alt="GenHire AI Logo" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        onError={(e) => {
          // Fallback if image not found yet
          e.target.style.display = 'none';
          e.target.parentNode.style.backgroundColor = '#06b6d4';
          e.target.parentNode.style.borderRadius = '50%';
        }}
      />
    </div>
  );
};

export default ChatBubbleLogo;