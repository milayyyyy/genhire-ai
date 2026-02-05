import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json()
    
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    })

    if (authError) throw authError

    const user = authData.user

    if (!user) {
      throw new Error('User creation failed')
    }

    // Store additional user data in the 'users' table if needed
    const { error: dbError } = await supabase
      .from('users')
      .insert([{
        id: user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        user_type: 'user',
        is_active: true,
        is_email_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      }])

    if (dbError) {
      console.error('Error storing additional user data:', dbError)
      throw dbError
    }

    return NextResponse.json({
      message: 'User created successfully',
      userId: user.id
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    
    let errorMessage = error.message || 'Internal server error'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}
}