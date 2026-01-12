import { NextRequest, NextResponse } from 'next/server';
import { createSpreadsheet, appendBatchToSpreadsheet } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('google_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated. Please sign in with Google.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { customers, stats, segments, isFirstBatch, spreadsheetId: existingSpreadsheetId, batchNumber } = body;

    // První batch - vytvoření spreadsheetu
    if (isFirstBatch) {
      console.log(`📄 Creating spreadsheet with ${customers.length} customers (first batch)`);

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
    }

    // Následující batche - append data
    if (!isFirstBatch && existingSpreadsheetId) {
      console.log(`📄 Appending batch ${batchNumber} with ${customers.length} customers to spreadsheet ${existingSpreadsheetId}`);

      await appendBatchToSpreadsheet(
        accessToken,
        existingSpreadsheetId,
        customers
      );

      return NextResponse.json({
        success: true,
        spreadsheetId: existingSpreadsheetId
      });
    }

    // Chyba - neplatná konfigurace
    return NextResponse.json(
      { error: 'Invalid batch configuration' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export to Google Sheets' },
      { status: 500 }
    );
  }
}
