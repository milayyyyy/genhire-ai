import { supabase } from '../../lib/supabase';

const API_ENDPOINTS = {
  behavioral: 'https://behavioral-question-api.netlify.app/.netlify/functions/behavioral-questions',
  technical: 'https://behavioral-question-api.netlify.app/.netlify/functions/technical-questions',
  'problem-solving': 'https://behavioral-question-api.netlify.app/.netlify/functions/problem-solving-questions'
};

const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

export const fetchQuestionsFromAPI = async (category) => {
  const response = await fetch(API_ENDPOINTS[category]);
  const data = await response.json();
  return {
    batchId: data.batchId,
    category: data.category,
    questions: data.questions.slice(0, 5),
    fetchDate: getTodayDate()
  };
};

export const shouldRefetchQuestions = (userData) => {
  if (!userData || !userData.fetchDate) return true;
  const allAnswered = userData.questions?.every((_, idx) => userData.answers?.[idx]?.answeredAt);
  if (!allAnswered) return false;
  return userData.fetchDate !== getTodayDate();
};

export const getUserQuestionData = async (userId, category) => {
  const { data, error } = await supabase
    .from('user_questions')
    .select('*')
    .eq('id', `${userId}_${category}`)
    .single();
  
  if (error || !data) return null;
  return data;
};

export const saveUserQuestionData = async (userId, category, data) => {
  const { error } = await supabase
    .from('user_questions')
    .upsert({
      id: `${userId}_${category}`,
      userId,
      category,
      ...data,
      updatedAt: new Date()
    });
  
  if (error) throw error;
};

export const initializeUserQuestionData = async (userId, category, data) => {
  const { data: existing, error: fetchError } = await supabase
    .from('user_questions')
    .select('id')
    .eq('id', `${userId}_${category}`)
    .single();
  
  if (fetchError || !existing) {
    const { error: insertError } = await supabase
      .from('user_questions')
      .insert([{
        id: `${userId}_${category}`,
        userId,
        category,
        ...data,
        answers: {},
        updatedAt: new Date()
      }]);
    
    if (insertError) throw insertError;
  }
};

export const saveUserAnswer = async (userId, category, questionIndex, answer) => {
  const { data, error: fetchError } = await supabase
    .from('user_questions')
    .select('*')
    .eq('id', `${userId}_${category}`)
    .single();
  
  if (data) {
    const answers = data.answers || {};
    answers[questionIndex] = {
      answer,
      answeredAt: new Date(),
      analyzed: false
    };
    
    const { error: updateError } = await supabase
      .from('user_questions')
      .update({ answers, updatedAt: new Date() })
      .eq('id', `${userId}_${category}`);
    
    if (updateError) throw updateError;
  }
};

export const saveAIAnalysis = async (userId, category, questionIndex, analysis) => {
  const { data, error: fetchError } = await supabase
    .from('user_questions')
    .select('*')
    .eq('id', `${userId}_${category}`)
    .single();
  
  if (data) {
    const answers = data.answers || {};
    if (answers[questionIndex]) {
      answers[questionIndex].analysis = analysis;
      answers[questionIndex].analyzed = true;
      answers[questionIndex].analyzedAt = new Date();
    }
    
    const { error: updateError } = await supabase
      .from('user_questions')
      .update({ answers, updatedAt: new Date() })
      .eq('id', `${userId}_${category}`);
    
    if (updateError) throw updateError;
  }
};
