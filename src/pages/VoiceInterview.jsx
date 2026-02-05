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
  Mic,
  MoreVertical,
  MicOff,
  StopCircle,
  Brain,
  Timer,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const VoiceInterview = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [elevenLabsFailed, setElevenLabsFailed] = useState(false);
  const audioPlayerRef = useRef(null);
  const recognitionRef = useRef(null);
  const processingLockRef = useRef(false);
  
  const HF_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;
  const ELEVEN_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
  const ELEVEN_VOICE_ID = import.meta.env.VITE_ELEVEN_LABS_VOICE_ID;
  
  const professionMap = {
    'software-engineer': 'Software Engineer',
    'frontend-developer': 'Frontend Developer', 
    'backend-developer': 'Backend Developer',
    'fullstack-developer': 'Full Stack Developer',
    'data-scientist': 'Data Scientist',
    'product-manager': 'Product Manager',
    'ui-ux-designer': 'UI/UX Designer',
    'marketing-manager': 'Marketing Manager',
    'sales-representative': 'Sales Representative',
    'financial-analyst': 'Financial Analyst',
    'human-resources': 'Human Resources',
    'project-manager': 'Project Manager',
    'business-analyst': 'Business Analyst'
  };
  
  const professions = Object.values(professionMap);

  const handleNavigation = (itemId) => {
    switch(itemId) {
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

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'past-interviews', icon: Clock, label: 'Past Interviews' },
    { id: 'live-interview', icon: Zap, label: 'Live AI Interview' },
    { id: 'question-bank', icon: HelpCircle, label: 'Question Bank' },
    { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

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
    const particleCount = 60; // Fewer particles for the interview page to focus on center

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
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

  useEffect(() => {
    const config = sessionStorage.getItem('interviewConfig');
    if (config) {
      const parsedConfig = JSON.parse(config);
      setInterviewConfig(parsedConfig);
      if (parsedConfig.jobRole && professionMap[parsedConfig.jobRole]) {
        setSelectedProfession(professionMap[parsedConfig.jobRole]);
      }
    }
  }, []);
  
  useEffect(() => {
    let timer;
    if (interviewStarted) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [interviewStarted]);
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.continuous = false;
      
      recognitionRef.current.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          const speechText = result[0].transcript;
          handleUserResponse(speechText);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = async () => {
    if (!selectedProfession) return;
    
    setInterviewStarted(true);
    setQuestionCount(0);
    
    const topic = interviewConfig?.topic || 'Software Engineering';
    const interviewType = interviewConfig?.interviewType || 'behavioral';
    const difficulty = interviewConfig?.difficulty || 'intermediate';
    
    let systemPrompt = `You are a professional interviewer conducting a ${topic} interview for a ${selectedProfession} position.`;
    
    switch(interviewType) {
      case 'behavioral':
        systemPrompt += ` Focus on behavioral questions using the STAR method (Situation, Task, Action, Result). Ask about past experiences, teamwork, leadership, conflict resolution, and problem-solving situations relevant to ${topic}.`;
        break;
      case 'technical':
        systemPrompt += ` Focus on technical questions specific to ${topic}. Ask about technical skills, problem-solving approaches, coding practices, tools, frameworks, and industry-specific technical knowledge.`;
        break;
      case 'situational':
        systemPrompt += ` Focus on situational questions. Present hypothetical scenarios related to ${topic} and ask how the candidate would handle them. Test their decision-making and critical thinking.`;
        break;
    }
    
    switch(difficulty) {
      case 'beginner':
        systemPrompt += ` Keep questions at entry-level difficulty. Focus on fundamental concepts, basic knowledge, and simple scenarios suitable for someone starting their career in ${topic}.`;
        break;
      case 'intermediate':
        systemPrompt += ` Ask mid-level professional questions. Include moderately complex scenarios, practical experience-based questions, and topics requiring solid understanding of ${topic}.`;
        break;
      case 'advanced':
        systemPrompt += ` Ask senior-level challenging questions. Include complex scenarios, advanced concepts, leadership situations, and deep technical or strategic knowledge of ${topic}.`;
        break;
    }
    
    systemPrompt += ` Ask one question at a time, keep your responses concise (2-3 sentences max), and maintain a professional tone. Limit the interview to 5-7 questions total. Tailor each question specifically to ${topic} and ${interviewType} interview style at ${difficulty} level.`;
    
    const systemMessage = {
      role: "system",
      content: systemPrompt
    };
    
    const initialMessages = [systemMessage];
    setMessages(initialMessages);
    
    localStorage.setItem('interview_messages', JSON.stringify(initialMessages));
    
    await sendMessageToAI(initialMessages, "Please start the interview with your first question.");
  };
  
  const sendMessageToAI = async (currentMessages, userInput = null) => {
    setIsProcessing(true);
    setIsAISpeaking(true);
    
    try {
      const messagesToSend = userInput ? 
        [...currentMessages, { role: "user", content: userInput }] : 
        currentMessages;
      
      const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HF_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3.1",
          messages: messagesToSend,
          max_tokens: 150,
          temperature: 0.7
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      const updatedMessages = [...messagesToSend, { role: "assistant", content: aiResponse }];
      setMessages(updatedMessages);
      setCurrentQuestion(aiResponse);
      
      localStorage.setItem('interview_messages', JSON.stringify(updatedMessages));
      
      if (userInput) {
        setQuestionCount(prev => prev + 1);
      }
      
      await speakText(aiResponse);
      
    } catch (error) {
      console.error("AI request failed:", error);
      const errorMessage = "I apologize, there was a technical issue. Please try again.";
      setCurrentQuestion(errorMessage);
      await speakText(errorMessage);
    } finally {
      setIsProcessing(false);
      setIsAISpeaking(false);
    }
  };
  
  const speakText = async (text) => {
    // Fallback function for basic TTS
    const speakWithWebSpeech = (txt) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(txt);
        // Find a natural sounding voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en-US')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } else {
        console.error('Web Speech API not supported in this browser.');
      }
    };

    // Circuit breaker: If ElevenLabs already failed, use fallback immediately
    if (elevenLabsFailed) {
      speakWithWebSpeech(text);
      return;
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "xi-api-key": ELEVEN_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_turbo_v2_5"
        })
      });
      
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        
        if (audioPlayerRef.current) {
          // Prevent AbortError by pausing before loading new source
          audioPlayerRef.current.pause();
          audioPlayerRef.current.src = url;
          try {
            await audioPlayerRef.current.play();
          } catch (e) {
            console.warn("Audio play interrupted or failed:", e);
          }
        }
      } else {
        if (response.status === 402) {
          console.warn(`ElevenLabs API returned 402 (Payment Required). Switching to fallback for the rest of this session.`);
          setElevenLabsFailed(true);
        } else if (response.status === 429) {
          console.warn(`ElevenLabs API returned 429 (Too Many Requests). Using fallback.`);
        } else {
          console.warn(`ElevenLabs API returned ${response.status}. Using fallback.`);
        }
        speakWithWebSpeech(text);
      }
    } catch (error) {
      console.error("TTS failed, using fallback:", error);
      speakWithWebSpeech(text);
    }
  };
  
  const handleUserResponse = async (speechText) => {
    if (!speechText.trim() || processingLockRef.current) return;
    
    processingLockRef.current = true;
    console.log('User said:', speechText);
    
    if (questionCount >= 6) {
      const endMessage = "Thank you for completing the interview. We'll now analyze your responses and provide feedback.";
      setCurrentQuestion(endMessage);
      await speakText(endMessage);
      
      setTimeout(() => {
        // Save interview data before navigating
        sessionStorage.setItem('interviewCompleted', 'true');
        navigate('/interview-results');
      }, 3000);
      return;
    }
    
    try {
      await sendMessageToAI(messages, speechText);
    } finally {
      processingLockRef.current = false;
    }
  };

  const endInterview = async () => {
    const endMessage = "Interview ended. Thank you for your time. Redirecting to results...";
    setCurrentQuestion(endMessage);
    await speakText(endMessage);

    // Save actual interview data to Supabase
    try {
      if (user?.id) {
        const messages = JSON.parse(localStorage.getItem('interview_messages') || '[]');
        const overallScore = Math.floor(Math.random() * 40) + 60; // Mocking score for now, should come from AI
        
        await supabase.from('interviews').insert([{
          userId: user.id,
          topic: interviewConfig.jobRole || 'General',
          interviewType: interviewConfig.interviewType || 'Standard',
          overall_score: overallScore,
          transcription: messages,
          analysis: {
            duration: elapsedTime,
            questionCount: questionCount,
            completedAt: new Date().toISOString()
          }
        }]);
      }
    } catch (error) {
      console.error("Error saving interview:", error);
    }
    
    setTimeout(() => {
      sessionStorage.setItem('interviewCompleted', 'true');
      navigate('/interview-results');
    }, 2000);
  };
  
  const handleMicClick = () => {
    if (!interviewStarted) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else if (!isAISpeaking && !isProcessing) {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleMicMouseDown = () => {
    const timer = setTimeout(() => {
      // Long press detected - end interview
      endInterview();
    }, 2000); // 2 seconds long press
    setPressTimer(timer);
  };

  const handleMicMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.6
        }}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top bar with stats */}
        <div style={{
          padding: '1.5rem 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(5px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(0, 198, 255, 0.1)', borderRadius: '8px', color: '#00c6ff' }}>
                <Timer size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Elapsed Time</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>{formatTime(elapsedTime)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', color: '#8b5cf6' }}>
                <Brain size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Progress</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>Question {questionCount} of 6</div>
              </div>
            </div>
          </div>

          <div style={{ 
            padding: '0.5rem 1rem', 
            background: 'rgba(255, 255, 255, 0.03)', 
            borderRadius: '100px', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: '#94a3b8'
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: isAISpeaking ? '#00c6ff' : isListening ? '#ef4444' : '#64748b',
              boxShadow: (isAISpeaking || isListening) ? `0 0 10px ${isAISpeaking ? '#00c6ff' : '#ef4444'}` : 'none'
            }} />
            {isProcessing ? 'AI is thinking...' :
             isAISpeaking ? 'AI is speaking...' :
             isListening ? 'Listening to you...' :
             'Waiting for response'}
          </div>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 4rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          {!interviewStarted ? (
            <div style={{
              maxWidth: '500px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '3rem',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'rgba(0, 198, 255, 0.1)', 
                borderRadius: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#00c6ff',
                margin: '0 auto 2rem'
              }}>
                <Mic size={40} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>Ready to Begin?</h2>
              <p style={{ color: '#94a3b8', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                Join the voice interview session. Please select your profession to calibrate the AI interviewer.
              </p>
              
              <select
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  fontSize: '1rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  color: '#fff',
                  marginBottom: '1.5rem',
                  cursor: 'pointer',
                  appearance: 'none',
                  outline: 'none'
                }}
              >
                <option value="">Select your role...</option>
                {professions.map((profession) => (
                  <option key={profession} value={profession} style={{ background: '#111' }}>
                    {profession}
                  </option>
                ))}
              </select>
              
              <button
                onClick={startInterview}
                disabled={!selectedProfession}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  backgroundColor: selectedProfession ? '#00c6ff' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedProfession ? '#fff' : '#64748b',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: selectedProfession ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  boxShadow: selectedProfession ? '0 10px 20px rgba(0, 198, 255, 0.15)' : 'none'
                }}
              >
                Launch Interview
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <>
              {/* Question Card */}
              <div style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '30px',
                padding: '4rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                marginBottom: '4rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '2rem',
                  left: '2rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#00c6ff',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#00c6ff' }} />
                  AI Question
                </div>

                <h2 style={{
                  fontSize: '2.2rem',
                  fontWeight: '500',
                  lineHeight: '1.5',
                  color: '#fff',
                  textAlign: 'center',
                  minHeight: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {currentQuestion || `Preparing your ${selectedProfession} interview. Stand by...`}
                </h2>
              </div>

              {/* Dynamic Audio Bar Visualization */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '8px',
                height: '100px',
                marginBottom: '3rem'
              }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => {
                  const baseHeight = 10;
                  const maxHeight = 80;
                  let currentHeight = baseHeight;
                  
                  if (isAISpeaking || isProcessing) {
                    currentHeight = baseHeight + Math.abs(Math.sin((Date.now() / 150) + bar * 0.4)) * (maxHeight - baseHeight);
                  } else if (isListening) {
                    currentHeight = baseHeight + Math.abs(Math.sin((Date.now() / 100) + bar * 0.6)) * ((maxHeight - baseHeight) * 0.8);
                  }
                  
                  return (
                    <div
                      key={bar}
                      style={{
                        width: '6px',
                        height: `${currentHeight}px`,
                        backgroundColor: isListening ? '#ff4b4b' : 
                                       (isAISpeaking || isProcessing) ? '#00c6ff' : 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '20px',
                        transition: 'height 0.1s ease',
                        boxShadow: (isAISpeaking || isListening) ? `0 0 20px ${isAISpeaking ? 'rgba(0, 198, 255, 0.3)' : 'rgba(255, 75, 75, 0.3)'}` : 'none'
                      }}
                    />
                  );
                })}
              </div>

              {/* Interaction Instruction */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: isListening ? 'rgba(255, 75, 75, 0.1)' : 'rgba(0, 198, 255, 0.05)',
                  border: `1px solid ${isListening ? '#ff4b4b' : '#00c6ff'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isListening ? '#ff4b4b' : '#00c6ff',
                  position: 'relative',
                  cursor: 'pointer'
                }}>
                  {isListening && (
                    <div style={{
                      position: 'absolute',
                      inset: '-10px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255, 75, 75, 0.3)',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }} />
                  )}
                  <Mic size={32} />
                </div>
                <p style={{ 
                  color: isListening ? '#ff4b4b' : '#94a3b8', 
                  fontSize: '0.95rem', 
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}>
                  {isListening ? 'LISTENING TO YOU' : isAISpeaking ? 'AI IS SPEAKING' : 'WAITING TO START'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <audio ref={audioPlayerRef} onEnded={() => {
        setIsAISpeaking(false);
        if (recognitionRef.current) {
          setIsListening(true);
          recognitionRef.current.start();
        }
      }} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
      `}} />
    </div>
  );
};

export default VoiceInterview;

