/ app/api/auth/register/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'email', 'password', 'country_name'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (data.password.length < 6 || data.password.length > 69) {
      return NextResponse.json(
        { error: 'Password must be between 6 and 69 characters' },
        { status: 400 }
      );
    }

    // Forward the request to your backend
    const response = await fetch('https://ndcbackend.agnesafrica.org/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error || 'Registration failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
