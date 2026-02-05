import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Some features may not work.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions to mirror Firebase functionality
export const getUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error) return null;
  return data;
};

export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      ...userData,
      created_at: new Date(),
      updated_at: new Date()
    }])
    .select()
    .single()
  
  if (error) throw error;
  return data;
};

export const updateUser = async (userId, userData) => {
  const { error } = await supabase
    .from('users')
    .update({
      ...userData,
      updated_at: new Date()
    })
    .eq('id', userId)
  
  if (error) throw error;
};

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
  
  if (error) throw error;
  return data;
};

export const createPasswordResetToken = async (tokenData) => {
  const { data, error } = await supabase
    .from('password_reset_tokens')
    .insert([{
      ...tokenData,
      created_at: new Date()
    }])
    .select()
    .single()
  
  if (error) throw error;
  return data;
};

export const getPasswordResetToken = async (token) => {
  const { data, error } = await supabase
    .from('password_reset_tokens')
    .select('*')
    .eq('token', token)
    .eq('is_used', false)
    .single()
  
  if (error || !data) return null;
  
  if (new Date(data.expires_at) < new Date()) return null;
  
  return data;
};

export const markTokenAsUsed = async (tokenId) => {
  const { error } = await supabase
    .from('password_reset_tokens')
    .update({ is_used: true })
    .eq('id', tokenId)
  
  if (error) throw error;
};

export const updateUserPassword = async (userId, newPassword) => {
  const { error } = await supabase
    .from('users')
    .update({
      password: newPassword,
      updated_at: new Date()
    })
    .eq('id', userId)
  
  if (error) throw error;
};

export const getInterviewSessions = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('userId', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error;

    return data.map(item => {
      const overallScore = item.overall_score || item.analysis?.overallScore || 0;
      return {
        ...item,
        percentage_scored: Math.round(overallScore),
        created_at: item.timestamp || item.created_at || new Date(),
        session_name: item.topic || item.interviewType || 'Interview Session',
        interview_type: item.interviewType || 'General',
        topic: item.topic || 'General'
      };
    });
  } catch (error) {
    console.error('Error in getInterviewSessions:', error);
    return [];
  }
};

export const createInterviewSession = async (sessionData) => {
  const { data, error } = await supabase
    .from('interview_sessions')
    .insert([{
      ...sessionData,
      created_at: new Date()
    }])
    .select()
    .single()
  
  if (error) throw error;
  return data;
};

export const getQuestionCategories = async () => {
  const { data, error } = await supabase
    .from('question_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  
  if (error) throw error;
  return data;
};

export const createInterview = async (interviewData) => {
  const { data, error } = await supabase
    .from('interviews')
    .insert([{
      ...interviewData,
      created_at: interviewData.timestamp || new Date()
    }])
    .select()
    .single()
  
  if (error) throw error;
  return data;
};

export const getUserSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('userId', userId)
    .single()
  
  if (error || !data) {
    return { plan: 'free', status: 'active' };
  }
  return data;
};

export const updateUserSubscription = async (userId, subscriptionData) => {
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      userId,
      ...subscriptionData,
      updated_at: new Date()
    }, { onConflict: 'userId' })
  
  if (error) throw error;
};

export const createUserSubscription = async (userId, subscriptionData) => {
  const { error } = await supabase
    .from('subscriptions')
    .insert([{
      userId,
      ...subscriptionData,
      created_at: new Date(),
      updated_at: new Date()
    }])
  
  if (error) throw error;
};
