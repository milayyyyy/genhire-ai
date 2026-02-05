import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Clock, 
  Zap, 
  HelpCircle, 
  CreditCard, 
  User, 
  Settings,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Eye,
  Loader,
  Bell
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';
import AnalysisModal from '../components/AnalysisModal';
import { fetchQuestionsFromAPI, getUserQuestionData, saveUserQuestionData, saveUserAnswer, saveAIAnalysis, shouldRefetchQuestions, fetchCategories } from '../services/questionBankService';
import { analyzeAnswer } from '../services/aiAnalysisService';
import { useAuth } from '../contexts/AuthContext';

const QuestionBank = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canvasRef = React.useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const handleNavigation = (path) => {
    navigate(`/${path}`);
  };

  // Particle Animation logic (GenHire style)
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5;
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

    const init = () => {
      particles = Array.from({ length: 100 }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
        particles.forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 198, 255, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState({});
  const [modalData, setModalData] = useState({ isOpen: false, analysis: '', category: '', question: '' });
  const [questionCategories, setQuestionCategories] = useState([]);
  const userId = user?.id;

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      const mapped = data.map(cat => ({
        id: cat.name.toLowerCase().replace(' ', '-'),
        title: `${cat.name} Questions`,
        description: cat.description,
        icon: getCategoryIcon(cat.icon),
        color: cat.color,
        count: 5
      }));
      setQuestionCategories(mapped);
    };
    loadCategories();
  }, []);

  const getCategoryIcon = (iconName) => {
    switch(iconName) {
      case 'user': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      );
      case 'code': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
        </svg>
      );
      case 'lightbulb': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
        </svg>
      );
      default: return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
    }
  };

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    for (const category of questionCategories) {
      const userData = await getUserQuestionData(userId, category.id);
      if (userData) {
        setCategoryData(prev => ({ ...prev, [category.id]: userData }));
        setUserAnswers(prev => ({ ...prev, [category.id]: userData.answers || {} }));
      }
    }
  };

  const handleCategoryClick = async (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      return;
    }

    setExpandedCategory(categoryId);

    if (!categoryData[categoryId] || categoryData[categoryId].questions?.length === 0) {
      setLoading(prev => ({ ...prev, [categoryId]: true }));
      try {
        const userData = await getUserQuestionData(userId, categoryId);
        
        if (userData && !shouldRefetchQuestions(userData)) {
          setCategoryData(prev => ({ ...prev, [categoryId]: userData }));
          setUserAnswers(prev => ({ ...prev, [categoryId]: userData.answers || {} }));
        } else {
          const data = await fetchQuestionsFromAPI(categoryId);
          await saveUserQuestionData(userId, categoryId, {
            batchId: data.batchId,
            questions: data.questions,
            fetchDate: data.fetchDate,
            answers: {}
          });
          setCategoryData(prev => ({ ...prev, [categoryId]: data }));
          setUserAnswers(prev => ({ ...prev, [categoryId]: {} }));
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(prev => ({ ...prev, [categoryId]: false }));
      }
    }
  };

  const handleAnswerChange = (categoryId, questionIndex, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [questionIndex]: {
          ...prev[categoryId]?.[questionIndex],
          answer: value
        }
      }
    }));
  };

  const handleSubmitAnswer = async (categoryId, questionIndex, question) => {
    const answer = userAnswers[categoryId]?.[questionIndex]?.answer;
    if (!answer || !answer.trim()) return;

    try {
      await saveUserAnswer(userId, categoryId, questionIndex, answer);
      setUserAnswers(prev => ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          [questionIndex]: {
            ...prev[categoryId][questionIndex],
            answeredAt: new Date(),
            analyzed: false
          }
        }
      }));

      setAnalyzing(prev => ({ ...prev, [`${categoryId}_${questionIndex}`]: true }));
      const analysis = await analyzeAnswer(question, answer);
      await saveAIAnalysis(userId, categoryId, questionIndex, analysis);
      
      setUserAnswers(prev => ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          [questionIndex]: {
            ...prev[categoryId][questionIndex],
            analysis,
            analyzed: true
          }
        }
      }));
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setAnalyzing(prev => ({ ...prev, [`${categoryId}_${questionIndex}`]: false }));
    }
  };

  const handleViewAnalysis = (categoryId, questionIndex, question) => {
    const analysis = userAnswers[categoryId]?.[questionIndex]?.analysis;
    if (analysis) {
      setModalData({
        isOpen: true,
        analysis,
        category: categoryId,
        question,
        allAnswers: null
      });
    }
  };

  const handleViewSummaryAnalysis = async (categoryId) => {
    const questions = categoryData[categoryId]?.questions || [];
    const answers = userAnswers[categoryId] || {};
    
    const qaList = questions.map((q, idx) => ({
      question: q,
      answer: answers[idx]?.answer || 'No answer provided'
    })).filter(qa => qa.answer !== 'No answer provided');

    if (qaList.length === 0) return;

    setAnalyzing(prev => ({ ...prev, [`${categoryId}_summary`]: true }));
    
    const combinedText = qaList.map((qa, idx) => 
      `Question ${idx + 1}: ${qa.question}\n\nYour Answer: ${qa.answer}`
    ).join('\n\n---\n\n');

    const summaryAnalysis = await analyzeAnswer(
      `Summary Analysis for ${categoryId} category (${qaList.length} questions)`,
      combinedText
    );

    setAnalyzing(prev => ({ ...prev, [`${categoryId}_summary`]: false }));

    setModalData({
      isOpen: true,
      analysis: summaryAnalysis,
      category: categoryId,
      question: `Summary Analysis - ${qaList.length} Questions`,
      allAnswers: qaList
    });
  };

  const getAnsweredCount = (categoryId) => {
    const answers = userAnswers[categoryId] || {};
    return Object.values(answers).filter(a => a.answeredAt).length;
  };

  const filteredCategories = questionCategories.filter(cat => {
    if (!searchQuery) return true;
    const questions = categoryData[cat.id]?.questions || [];
    return questions.some(q => q.toLowerCase().includes(searchQuery.toLowerCase()));
  });

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
      {/* Dynamic Background Canvas */}
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Question Bank</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Sharpen your skills with curated interview prep</p>
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
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              onClick={() => handleNavigation('profile')}
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <div style={{ padding: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Search & Statistics */}
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            marginBottom: '3rem',
            background: 'rgba(15, 15, 15, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            padding: '1.5rem'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search 
                size={20} 
                color="#00c6ff" 
                style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search through 500+ interview questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00c6ff'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ 
                padding: '0 1.5rem', 
                background: 'rgba(0, 198, 255, 0.05)', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                border: '1px solid rgba(0, 198, 255, 0.2)'
              }}>
                <div style={{ color: '#00c6ff', fontSize: '0.875rem' }}>Mastery Score:</div>
                <div style={{ fontWeight: '700', fontSize: '1.125rem', color: '#fff' }}>84%</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '24px', background: '#00c6ff', borderRadius: '4px' }}></div>
              Interview Categories
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              {filteredCategories.map((category) => {
                const isExpanded = expandedCategory === category.id;
                const answeredCount = getAnsweredCount(category.id);
                
                return (
                  <div key={category.id} style={{ 
                    background: 'rgba(15, 15, 15, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: isExpanded ? '0 0 30px rgba(0, 198, 255, 0.1)' : 'none'
                  }}>
                    <div
                      onClick={() => handleCategoryClick(category.id)}
                      style={{
                        padding: '1.5rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: isExpanded ? 'rgba(0, 198, 255, 0.03)' : 'transparent',
                        transition: 'background 0.3s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.75rem',
                          border: `1px solid ${category.color}44`,
                          position: 'relative',
                          boxShadow: `0 0 15px ${category.color}22`
                        }}>
                          {category.icon}
                          {answeredCount > 0 && (
                            <div style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              backgroundColor: '#00c6ff',
                              color: '#000',
                              borderRadius: '50%',
                              width: '22px',
                              height: '22px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              boxShadow: '0 0 10px rgba(0, 198, 255, 0.5)'
                            }}>
                              {answeredCount}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.25rem 0', color: '#fff' }}>
                            {category.title}
                          </h3>
                          <p style={{ color: '#94a3b8', fontSize: '0.925rem', margin: 0 }}>
                            {category.description}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ textAlign: 'right', display: 'none' }}> {/* Optional stats */}
                          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Completion</div>
                          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#00c6ff' }}>{Math.round((answeredCount/category.count)*100)}%</div>
                        </div>
                        <div style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(255, 255, 255, 0.04)',
                          borderRadius: '12px',
                          fontSize: '0.875rem',
                          color: '#94a3b8',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                          {category.count} Questions
                        </div>
                        {isExpanded ? <ChevronDown size={22} color="#00c6ff" /> : <ChevronRight size={22} color="#94a3b8" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{
                        padding: '0 2rem 2rem 2rem',
                        animation: 'fadeInUp 0.4s ease-out'
                      }}>
                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {loading[category.id] ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                              <Loader size={32} color="#00c6ff" style={{ animation: 'spin 1.5s linear infinite' }} />
                              <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Fetching curated questions...</p>
                            </div>
                          ) : (
                            categoryData[category.id]?.questions?.map((question, idx) => {
                              const answerData = userAnswers[category.id]?.[idx];
                              const isAnswered = answerData?.answeredAt;
                              const isAnalyzing = analyzing[`${category.id}_${idx}`];
                              
                              return (
                                <div key={idx} style={{
                                  padding: '1.5rem',
                                  background: 'rgba(255, 255, 255, 0.02)',
                                  borderRadius: '20px',
                                  border: '1px solid rgba(255, 255, 255, 0.05)',
                                  transition: 'all 0.3s ease',
                                  position: 'relative'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500', lineHeight: '1.6', color: '#f8fafc', flex: 1 }}>
                                      <span style={{ color: '#00c6ff', marginRight: '0.75rem' }}>{idx + 1}.</span> {question}
                                    </h4>
                                    {isAnswered && (
                                      <div style={{ 
                                        padding: '0.4rem 0.8rem', 
                                        backgroundColor: 'rgba(0, 198, 255, 0.1)', 
                                        color: '#00c6ff', 
                                        borderRadius: '10px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        border: '1px solid rgba(0, 198, 255, 0.2)'
                                      }}>
                                        <CheckCircle size={14} /> COMPLETED
                                      </div>
                                    )}
                                  </div>
                                  
                                  <textarea
                                    value={answerData?.answer || ''}
                                    onChange={(e) => handleAnswerChange(category.id, idx, e.target.value)}
                                    disabled={isAnswered}
                                    placeholder="Draft your response here..."
                                    style={{
                                      width: '100%',
                                      minHeight: '120px',
                                      padding: '1rem',
                                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                      border: '1px solid rgba(255, 255, 255, 0.1)',
                                      borderRadius: '14px',
                                      color: '#cbd5e1',
                                      fontSize: '0.95rem',
                                      lineHeight: '1.6',
                                      resize: 'vertical',
                                      outline: 'none',
                                      transition: 'all 0.3s ease',
                                      cursor: isAnswered ? 'default' : 'text'
                                    }}
                                  />
                                  
                                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                                    {!isAnswered ? (
                                      <button
                                        onClick={() => handleSubmitAnswer(category.id, idx, question)}
                                        disabled={!answerData?.answer?.trim() || isAnalyzing}
                                        style={{
                                          padding: '0.75rem 1.5rem',
                                          background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                                          color: '#000',
                                          border: 'none',
                                          borderRadius: '12px',
                                          cursor: answerData?.answer?.trim() ? 'pointer' : 'not-allowed',
                                          fontSize: '0.925rem',
                                          fontWeight: '700',
                                          transition: 'all 0.3s ease',
                                          boxShadow: answerData?.answer?.trim() ? '0 4px 15px rgba(0, 198, 255, 0.3)' : 'none'
                                        }}
                                      >
                                        {isAnalyzing ? 'Processing Analysis...' : 'Submit for AI Review'}
                                      </button>
                                    ) : (
                                      answerData.analyzed && (
                                        <button
                                          onClick={() => handleViewAnalysis(category.id, idx, question)}
                                          style={{
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            color: '#fff',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            fontSize: '0.925rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                            transition: 'all 0.3s ease'
                                          }}
                                          onMouseOver={(e) => e.currentTarget.style.borderColor = '#00c6ff'}
                                          onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                        >
                                          <Eye size={18} color="#00c6ff" />
                                          View Detailed AI Analysis
                                        </button>
                                      )
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                          
                          {/* Summary Analysis Button */}
                          {answeredCount >= 5 && (
                            <div style={{
                              marginTop: '1.5rem',
                              padding: '2rem',
                              background: 'rgba(0, 198, 255, 0.03)',
                              borderRadius: '24px',
                              border: '1px dashed rgba(0, 198, 255, 0.3)',
                              textAlign: 'center'
                            }}>
                              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>Ready for a Holistic Review?</h4>
                              <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>You've completed enough questions for our AI to generate a comprehensive behavioral profile for this category.</p>
                              <button
                                onClick={() => handleViewSummaryAnalysis(category.id)}
                                disabled={analyzing[`${category.id}_summary`]}
                                style={{
                                  padding: '1rem 2.5rem',
                                  background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                                  color: '#000',
                                  border: 'none',
                                  borderRadius: '14px',
                                  cursor: analyzing[`${category.id}_summary`] ? 'wait' : 'pointer',
                                  fontSize: '1rem',
                                  fontWeight: '700',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.75rem',
                                  boxShadow: '0 10px 20px rgba(0, 198, 255, 0.2)'
                                }}
                              >
                                <Eye size={20} />
                                {analyzing[`${category.id}_summary`] ? 'Generating Portrait...' : 'Unlock Category Mastery Profile'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <AnalysisModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        analysis={modalData.analysis}
        category={modalData.category}
        question={modalData.question}
      />
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

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
      `}</style>
    </div>
  );
};

export default QuestionBank;

