import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// Create or update an interview session in real-time
export async function POST(request) {
  try {
    const { sessionId, userId, conversation, interviewConfig, action } = await request.json()
    
    console.log('=== Interview Session API ===')
    console.log('Action:', action)
    console.log('Session ID:', sessionId)
    console.log('User ID:', userId)
    console.log('Conversation length:', conversation?.length || 0)
    console.log('Interview Config:', interviewConfig)
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    if (action === 'create') {
      // Create a new interview session
      const { error } = await supabase
        .from('interview_sessions_live')
        .insert([{
          id: sessionId,
          userId,
          conversation: conversation || [],
          interviewConfig: interviewConfig || {},
          status: 'in_progress',
          questionsAnswered: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }])
      
      if (error) throw error
      
      console.log('Created new session:', sessionId)
      return NextResponse.json({ success: true, sessionId })
    }
    
    if (action === 'update') {
      // Update existing session with new conversation
      const userResponses = conversation?.filter(m => m.type === 'user')?.length || 0
      
      const updateData = {
        conversation: conversation || [],
        questionsAnswered: userResponses,
        updatedAt: new Date()
      }
      
      // Also update interviewConfig if provided
      if (interviewConfig) {
        updateData.interviewConfig = interviewConfig
      }
      
      const { error } = await supabase
        .from('interview_sessions_live')
        .update(updateData)
        .eq('id', sessionId)
      
      if (error) throw error
      
      console.log('Updated session:', sessionId, 'Questions answered:', userResponses)
      return NextResponse.json({ success: true, questionsAnswered: userResponses })
    }
    
    if (action === 'complete') {
      // Mark session as complete
      const userResponses = conversation?.filter(m => m.type === 'user')?.length || 0
      
      const { error } = await supabase
        .from('interview_sessions_live')
        .update({
          conversation: conversation || [],
          questionsAnswered: userResponses,
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date()
        })
        .eq('id', sessionId)
      
      if (error) throw error
      
      console.log('Completed session:', sessionId)
      return NextResponse.json({ success: true, status: 'completed' })
    }
    
    if (action === 'get') {
      // Get session data
      const { data, error } = await supabase
        .from('interview_sessions_live')
        .select('*')
        .eq('id', sessionId)
        .single()
      
      if (error || !data) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }
      
      console.log('Retrieved session:', sessionId)
      return NextResponse.json({ success: true, session: data })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Interview session error:', error)
    return NextResponse.json({ error: 'Session operation failed' }, { status: 500 })
  }
}

// Get session by ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('interview_sessions_live')
      .select('*')
      .eq('id', sessionId)
      .single()
    
    if (error || !data) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, session: data })
    
  } catch (error) {
    console.error('Get session error:', error)
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 })
  }
}
