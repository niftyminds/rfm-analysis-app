import { NextRequest, NextResponse } from 'next/server';
import { createSpreadsheet } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('google_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated. Please sign in with Google.' },
        { status: 401 }
      );
    }

    const { customers, stats, segments } = await request.json();

    // Vytvoření spreadsheetu
    const spreadsheetId = await createSpreadsheet(
      accessToken,
      customers,
      stats,
      segments
    );

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    return NextResponse.json({
      success: true,
      spreadsheetId,
      url: spreadsheetUrl
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export to Google Sheets' },
      { status: 500 }
    );
  }
}
