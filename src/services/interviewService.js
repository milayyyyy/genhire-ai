import { supabase } from '../../lib/supabase';

const FALLBACK_CATEGORIES = [
  { id: 1, title: 'Retail & Service', icon_name: 'Store', description: 'Real-world customer interaction and service scenarios', color: '#3b82f6', highlights: ['Customer Relations', 'Conflict Resolution', 'Inventory Management'] },
  { id: 2, title: 'Technical & Web', icon_name: 'Terminal', description: 'Algorithm challenges and software engineering concepts', color: '#8b5cf6', highlights: ['Full-stack Concepts', 'System Architecture', 'Coding Logic'] },
  { id: 3, title: 'Management & Logic', icon_name: 'Briefcase', description: 'Leadership, problem-solving and people management', color: '#10b981', highlights: ['Team Building', 'Decision Making', 'Resource Planning'] },
  { id: 4, title: 'Corporate & HR', icon_name: 'Users', description: 'Professional office environment and human resources', color: '#f59e0b', highlights: ['Office Etiquette', 'Talent Retention', 'Corporate Policy'] }
];

export const fetchJobCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('job_categories')
      .select('*')
      .order('title', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Using fallback categories due to database issues');
      return FALLBACK_CATEGORIES;
    }
    return data;
  } catch (err) {
    console.error('Error fetching job categories:', err);
    return FALLBACK_CATEGORIES;
  }
};

export const fetchUserInterviews = async (userId) => {
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching interviews:', error);
    return [];
  }
  return data;
};

export const fetchInterviewStats = async (userId) => {
  const { data, error } = await supabase
    .from('interviews')
    .select('overall_score, created_at')
    .eq('userId', userId);

  if (error) {
    console.error('Error fetching stats:', error);
    return { avgRating: '0', practiceSessions: '0', avgLength: '0', streak: '0' };
  }

  if (!data || data.length === 0) {
    return { avgRating: '0.0', practiceSessions: '0', avgLength: '0s', streak: '0' };
  }

  const avgRating = (data.reduce((acc, curr) => acc + parseFloat(curr.overall_score || 0), 0) / data.length).toFixed(1);
  const practiceSessions = data.length.toString();
  
  // Mocking length for now since we might not have it in schema yet, or calculate from transcription
  const avgLength = '45s'; 
  
  // Calculate streak (consecutive days)
  const streak = calculateStreak(data);

  return { avgRating, practiceSessions, avgLength, streak };
};

const calculateStreak = (interviews) => {
  if (!interviews.length) return '0';
  
  const dates = interviews.map(i => new Date(i.created_at).toDateString());
  const uniqueDates = [...new Set(dates)].map(d => new Date(d)).sort((a,b) => b-a);
  
  let streak = 0;
  let today = new Date();
  today.setHours(0,0,0,0);
  
  let currentRef = today;
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const diffTime = Math.abs(currentRef - uniqueDates[i]);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
      currentRef = uniqueDates[i];
    } else {
      break;
    }
  }
  
  return streak.toString();
};
