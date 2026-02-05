// SHIM FOR SUPABASE MIGRATION
// This file used to be Firebase, now it exports Supabase equivalents to avoid 
// breaking existing code that imports from here.
import { supabase, getUserByEmail, createUser, updateUser, getAllUsers, 
  createPasswordResetToken, getPasswordResetToken, markTokenAsUsed, 
  updateUserPassword, getInterviewSessions, createInterviewSession, 
  getQuestionCategories, createInterview, getUserSubscription, 
  updateUserSubscription, createUserSubscription } from './supabase';

export const auth = supabase.auth;
export const db = supabase; // Note: Supabase structure is different, this is just a shim

export {
  getUserByEmail, createUser, updateUser, getAllUsers, 
  createPasswordResetToken, getPasswordResetToken, markTokenAsUsed, 
  updateUserPassword, getInterviewSessions, createInterviewSession, 
  getQuestionCategories, createInterview, getUserSubscription, 
  updateUserSubscription, createUserSubscription
};

const analytics = null;
export { analytics };

