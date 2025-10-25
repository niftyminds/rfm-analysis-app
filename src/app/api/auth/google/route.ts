import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_REDIRECT_URI
  );

  // Používáme pouze 'drive.file' scope místo 'spreadsheets'
  // Výhody:
  // - NEVYŽADUJE Google App Verification (6+ týdnů proces)
  // - Přístup POUZE k souborům vytvořeným aplikací (vyšší bezpečnost)
  // - Plně postačuje pro vytváření a editaci Google Sheets
  // - Zobrazí "unverified app" varování, ale lze přeskočit
  const scopes = [
    'https://www.googleapis.com/auth/drive.file'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  return NextResponse.redirect(url);
}
