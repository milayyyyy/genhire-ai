import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { supabase } from '../../../../lib/supabase';

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    const body = await request.json();
    
    const { userId, first_name, last_name, phone_number, address } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Update user in Supabase
    const { error } = await supabase
      .from('users')
      .update({
        first_name,
        last_name,
        phone_number,
        address,
        updated_at: new Date()
      })
      .eq('id', userId);

    if (error) throw error;

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        first_name,
        last_name,
        phone_number,
        address
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
