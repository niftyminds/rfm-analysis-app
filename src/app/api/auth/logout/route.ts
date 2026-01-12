import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  // Odstranit Google access token cookie
  response.cookies.delete('google_access_token');

  return response;
}
