import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Check, X, Info, RefreshCw, HelpCircle, ChevronDown, ChevronUp, Github, Mail, Phone, MessageSquare, Shield, Globe } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const pricingRef = useRef(null)
  const faqRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    // Particle Animation
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const particles = []
    const particleCount = 150

    // Initialize particles with more sophisticated properties for "AI Connected" look
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.5 + 0.2
      })
    }

    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw connections
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        // Interactivity with mouse
        const dxMouse = particles[i].x - mouseX
        const dyMouse = particles[i].y - mouseY
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        if (distMouse < 150) {
          particles[i].x += dxMouse * 0.01
          particles[i].y += dyMouse * 0.01
        }

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 198, 255, ${0.2 * (1 - distance / 120)})`
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw and update particles
      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 198, 255, ${p.opacity})`
        ctx.fill()
      })
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    const handleSplineLoad = () => {
      setSplineLoaded(true)
      if (!isLoading) {
        setIsLoading(false)
      }
    }

    const splineViewer = document.querySelector('.ai-object-container')
    // Spline viewer logic removed
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isLoading])

  const handleGetStarted = () => {
    navigate('/login')
  }

  const handlePricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFAQ = () => {
    faqRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

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
      answer: "The AI evaluates your responses based on clarity, relevance, confidence, and content quality. You'll receive actionable feedback and scores for each answer."
    },
    {
      question: "Is my interview data secure?",
      answer: "Yes, we take your privacy seriously. All interview sessions and personal data are encrypted and stored securely using Supabase."
    }
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          font-family: 'Poppins', sans-serif;
          color: #fff;
          background-color: #000;
        }

        .landing-container {
          position: relative;
          width: 100vw;
          min-height: 100vh;
          overflow-x: hidden;
          background: #000;
        }

        .hero-section {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 10%;
          box-sizing: border-box;
          background: #000;
        }

        /* Creative Background */
        .bg-blob {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 198, 255, 0.12) 0%, rgba(0, 114, 255, 0) 70%);
          border-radius: 50%;
          filter: blur(100px);
          z-index: 0;
          animation: float 20s infinite alternate;
          pointer-events: none;
        }

        .blob-1 { top: 10%; right: -5%; }
        .blob-2 { bottom: -10%; left: -5%; animation-delay: -5s; }
        .blob-3 { top: 40%; left: 20%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255, 0, 255, 0.07) 0%, transparent 70%); }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
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
          z-index: 1;
          pointer-events: none;
        }

        .hero-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 1.5rem 10%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.3s;
        }

        .nav-link:hover {
          color: #00c6ff;
        }

        .hero-content {
          max-width: 600px;
          z-index: 10;
          position: relative;
        }

        .spline-viewer {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          z-index: 5;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #fff 20%, #00c6ff 50%, #fff 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.1;
          animation: shine 5s linear infinite;
          cursor: default;
          transition: filter 0.3s ease;
        }

        .hero-title:hover {
          filter: drop-shadow(0 0 15px rgba(0, 198, 255, 0.4));
        }

        /* AI Interactive Object Replacement */
        .ai-object-container {
          position: absolute;
          right: 5%;
          width: 45%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }

        .ai-core {
          width: 300px;
          height: 300px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: coreFloat 6s ease-in-out infinite;
        }

        @keyframes coreFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }

        .core-sphere {
          width: 150px;
          height: 150px;
          background: radial-gradient(circle at 30% 30%, #00c6ff, #0072ff);
          border-radius: 50%;
          box-shadow: 0 0 80px rgba(0, 198, 255, 0.6);
          position: relative;
          z-index: 2;
          overflow: hidden;
        }

        .core-sphere::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: coreShine 3s infinite;
        }

        @keyframes coreShine {
          from { left: -100%; }
          to { left: 100%; }
        }

        .core-ring {
          position: absolute;
          border: 2px solid rgba(0, 198, 255, 0.3);
          border-radius: 50%;
          animation: rotate 10s linear infinite;
        }

        .ring-1 { width: 220px; height: 220px; border-top-color: #00c6ff; animation-duration: 4s; }
        .ring-2 { width: 280px; height: 280px; border-left-color: #00c6ff; animation-duration: 7s; animation-direction: reverse; }
        .ring-3 { width: 340px; height: 340px; border-right-color: #00c6ff; animation-duration: 12s; }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .orbit-dot {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #00c6ff;
          border-radius: 50%;
          top: -5px;
          left: 50%;
          box-shadow: 0 0 15px #00c6ff;
        }

        @keyframes shine {
          to { background-position: 200% center; }
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2.5rem;
          line-height: 1.6;
          max-width: 500px;
          animation: fadeInUp 1s ease-out 0.5s both;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          backdrop-filter: blur(10px);
        }

        .pricing-card:hover {
          transform: translateY(-15px) scale(1.02);
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(0, 198, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .feature-icon {
          animation: floatIcon 3s ease-in-out infinite;
        }

        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .button-row {
          display: flex;
          flex-direction: row;
          gap: 1rem;
          animation: fadeInUp 1s ease-out 0.8s both;
        }

        .btn {
          padding: 0.8rem 1.8rem;
          background: linear-gradient(135deg, #00c6ff, #0072ff);
          color: #fff;
          border: none;
          border-radius: 40px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
        }

        .btn::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: rgba(255, 255, 255, 0.1);
          transform: rotate(45deg);
          transition: 0.5s;
        }

        .btn:hover::after {
          left: 120%;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 25px rgba(0, 198, 255, 0.6);
        }

        .copyright {
          position: absolute;
          bottom: 20px;
          right: 25px;
          z-index: 2;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(5px);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #ccc;
        }

        .pricing-section, .faq-section {
          padding: 100px 20px;
          background: #000;
          position: relative;
          z-index: 10;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 3rem;
          text-align: center;
          margin-bottom: 3rem;
          color: #fff;
          font-weight: 700;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .pricing-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 12px;
          background: #00c6ff;
          color: #000;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          margin-top: auto;
        }

        .pricing-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0, 198, 255, 0.4);
        }

        .landing-footer {
          padding: 60px 20px;
          background: #050505;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .ai-object-container { display: none; }
          .bg-blob, .grid-overlay, .scanline { display: none; }
          .mobile-background { display: block; }
          .navbar { padding: 1rem 5%; }
          .nav-links { display: none; }
          .hero-section {
            justify-content: center;
            padding: 0 5%;
            background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%);
          }
          .hero-content {
            text-align: center;
            max-width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-title { font-size: 2.8rem; }
          .hero-subtitle { font-size: 1.1rem; }
          .button-row {
            flex-direction: column;
            width: 100%;
          }
          .btn { width: 100%; }
        }
      `}} />

      {/* Loading Screen */}
      <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}>
        <div className="loading-logo">GenHire AI</div>
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading your interview experience...</div>
      </div>

      <div className={`landing-container main-content`}>
        <nav className="navbar">
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#00c6ff'}}>GenHire AI</div>
          <div className="nav-links">
            <span className="nav-link" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Home</span>
            <span className="nav-link" onClick={handlePricing}>Pricing</span>
            <span className="nav-link" onClick={handleFAQ}>FAQ</span>
            <span className="nav-link" onClick={() => navigate('/login')}>Login</span>
          </div>
        </nav>

        <section className="hero-section">
          <div className="grid-overlay"></div>
          <canvas ref={canvasRef} className="hero-canvas"></canvas>
          <div className="bg-blob blob-1"></div>
          <div className="bg-blob blob-2"></div>
          <div className="bg-blob blob-3"></div>

          <div className="ai-object-container">
            <div className="ai-core">
              <div className="core-sphere"></div>
              <div className="core-ring ring-1"><div className="orbit-dot"></div></div>
              <div className="core-ring ring-2"><div className="orbit-dot"></div></div>
              <div className="core-ring ring-3"><div className="orbit-dot"></div></div>
            </div>
          </div>
          
          <div className="hero-content">
            <h1 className="hero-title">Master Your Next Interview</h1>
            <p className="hero-subtitle">
              Practice with our advanced AI interviewer. Get real-time feedback, improve your confidence, and land your dream job.
            </p>
            <div className="button-row">
              <button className="btn" onClick={handleGetStarted}>
                Get Started Free
              </button>
              <button className="btn" style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)'}} onClick={handlePricing}>
                View Plans
              </button>
            </div>
          </div>
        </section>

        <div className="mobile-background"></div>

        <div className="copyright">
          © GenHire AI 2026
        </div>

        {/* Features Section */}
        <section className="pricing-section" style={{background: '#050505'}}>
          <div className="section-container">
            <h2 className="section-title">Key Features</h2>
            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="feature-icon" style={{color: '#00c6ff', marginBottom: '1rem'}}><MessageSquare size={40} /></div>
                <h3>AI Conversation</h3>
                <p style={{color: '#888', marginTop: '1rem'}}>Engage in natural dialogues with an AI that adapts to your responses.</p>
              </div>
              <div className="pricing-card">
                <div className="feature-icon" style={{color: '#00c6ff', marginBottom: '1rem'}}><Shield size={40} /></div>
                <h3>Expert Feedback</h3>
                <p style={{color: '#888', marginTop: '1rem'}}>Receive detailed analysis on your body language, tone, and content.</p>
              </div>
              <div className="pricing-card">
                <div className="feature-icon" style={{color: '#00c6ff', marginBottom: '1rem'}}><Globe size={40} /></div>
                <h3>Role Specific</h3>
                <p style={{color: '#888', marginTop: '1rem'}}>Tailored questions for over 50+ industries and job positions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} className="pricing-section">
          <div className="section-container">
            <h2 className="section-title">Ready to reach your dream job?</h2>
            <p style={{textAlign: 'center', color: '#888', marginBottom: '4rem', marginTop: '-2rem'}}>Choose the plan that fits your career goals.</p>
            
            <div className="pricing-grid">
              {/* Basic Plan */}
              <div className="pricing-card" style={{border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                <div style={{marginBottom: '1.5rem'}}>
                  <h3 style={{fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem'}}>Basic</h3>
                  <p style={{color: '#888', fontSize: '0.9rem'}}>Essential features to get started</p>
                </div>
                <div style={{fontSize: '3rem', fontWeight: 'bold', margin: '1.5rem 0', color: '#fff'}}>Free</div>
                <div style={{height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2rem 0'}}></div>
                <ul style={{textAlign: 'left', marginBottom: '2.5rem', color: '#ccc', listStyle: 'none', padding: 0}}>
                  <li style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}><Check size={18} color="#00c6ff" style={{marginRight: '12px'}} /> 3 Interviews / week</li>
                  <li style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}><Check size={18} color="#00c6ff" style={{marginRight: '12px'}} /> Standard Question Bank</li>
                  <li style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', opacity: 0.4}}><X size={18} color="#ff4d4d" style={{marginRight: '12px'}} /> Deep Performance Analysis</li>
                  <li style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', opacity: 0.4}}><X size={18} color="#ff4d4d" style={{marginRight: '12px'}} /> Custom Feedback</li>
                </ul>
                <button className="pricing-btn" style={{background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)'}} onClick={handleGetStarted}>Get Started</button>
              </div>

              {/* Premium Plan */}
              <div className="pricing-card" style={{
                background: 'rgba(0, 198, 255, 0.05)', 
                border: '1px solid #00c6ff', 
                position: 'relative',
                transform: 'scale(1.05)',
                zIndex: 2
              }}>
                <div style={{
                  position: 'absolute', 
                  top: '-15px', 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  background: '#00c6ff',
                  color: '#000',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  boxShadow: '0 5px 15px rgba(0, 198, 255, 0.4)'
                }}>RECOMMENDED</div>
                
                <div style={{marginBottom: '1.5rem'}}>
                  <h3 style={{fontSize: '1.5rem', color: '#00c6ff', marginBottom: '0.5rem'}}>Premium</h3>
                  <p style={{color: '#888', fontSize: '0.9rem'}}>Everything you need to master interviews</p>
                </div>
                <div style={{fontSize: '3rem', fontWeight: 'bold', margin: '1.5rem 0', color: '#fff'}}>₱399<span style={{fontSize: '1rem', color: '#888', fontWeight: 'normal'}}>/mo</span></div>
                <div style={{height: '1px', background: 'rgba(0, 198, 255, 0.2)', margin: '2rem 0'}}></div>
                <ul style={{textAlign: 'left', marginBottom: '2.5rem', color: '#ccc', listStyle: 'none', padding: 0}}>
                  <li style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}><Check size={18} color="#00c6ff" style={{marginRight: '12px'}} /> Unlimited Interviews</li>
                  <li style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}><Check size={18} color="#00c6ff" style={{marginRight: '12px'}} /> AI Deep Analysis</li>
                  <li style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}><Check size={18} color="#00c6ff" style={{marginRight: '12px'}} /> Voice & Text Support</li>
                  <li style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}><Check size={18} color="#00c6ff" style={{marginRight: '12px'}} /> Export Results to PDF</li>
                </ul>
                <button className="pricing-btn" style={{background: 'linear-gradient(135deg, #00c6ff, #0072ff)', color: '#fff'}} onClick={handleGetStarted}>Go Premium</button>
              </div>

              {/* Enterprise Plan */}
              <div className="pricing-card" style={{border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                <div style={{marginBottom: '1.5rem'}}>
                  <h3 style={{fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem'}}>Enterprise</h3>
                  <p style={{color: '#888', fontSize: '0.9rem'}}>For teams and organizations</p>
                </div>
                <div style={{fontSize: '3rem', fontWeight: 'bold', margin: '1.5rem 0', color: '#fff'}}>Custom</div>
                <div style={{height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2rem 0'}}></div>
                <ul style={{textAlign: 'left', marginBottom: '2.5rem', color: '#ccc', listStyle: 'none', padding: 0}}>
                  <li style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}><Check size={18} color="#00c6ff" style={{marginRight: '12px'}} /> Unlimited Team Seats</li>
                  <li style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}><Check size={18} color="#00c6ff" style={{marginRight: '12px'}} /> Custom AI Training</li>
                  <li style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}><Check size={18} color="#00c6ff" style={{marginRight: '12px'}} /> Advanced Team Analytics</li>
                  <li style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}><Check size={18} color="#00c6ff" style={{marginRight: '12px'}} /> API Integration</li>
                </ul>
                <button className="pricing-btn" style={{background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)'}} onClick={handleGetStarted}>Contact Sales</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section ref={faqRef} className="faq-section">
          <div className="section-container">
            <h2 className="section-title">Common Questions</h2>
            <div style={{maxWidth: '800px', margin: '0 auto'}}>
              {faqs.map((faq, i) => (
                <div key={i} style={{marginBottom: '15px', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                  <div 
                    onClick={() => toggleFAQ(i)}
                    style={{
                      padding: '20px 0', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      cursor: 'pointer'
                    }}
                  >
                    <h4 style={{margin: 0, fontWeight: '500'}}>{faq.question}</h4>
                    {expandedIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  <div style={{
                    maxHeight: expandedIndex === i ? '200px' : '0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    color: '#888',
                    paddingBottom: expandedIndex === i ? '20px' : '0'
                  }}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="landing-footer">
          <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem'}}>
            <Github size={24} style={{cursor: 'pointer', color: '#888'}} />
            <Mail size={24} style={{cursor: 'pointer', color: '#888'}} />
            <Phone size={24} style={{cursor: 'pointer', color: '#888'}} />
          </div>
          <div className="footer-logo" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#00c6ff', marginBottom: '10px'}}>GenHire AI</div>
          <p style={{color: '#555', fontSize: '0.875rem'}}>© 2026 GenHire AI. All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}

