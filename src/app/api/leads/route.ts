import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, newsletter, exportType } = body;

    // Validace
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neplatný email' },
        { status: 400 }
      );
    }

    console.log('📧 New lead:', { email, newsletter, exportType });

    const results = {
      email,
      newsletter,
      exportType,
      ecomailSuccess: false,
      sheetsSuccess: false,
      errors: [] as string[]
    };

    // 1. Ecomail integrace (pouze pokud newsletter = true)
    if (newsletter) {
      try {
        const ecomailApiKey = process.env.ECOMAIL_API_KEY;
        const ecomailListId = process.env.ECOMAIL_LIST_ID;

        if (!ecomailApiKey || !ecomailListId) {
          console.warn('⚠️ Ecomail credentials not configured');
          results.errors.push('Ecomail není nakonfigurován');
        } else {
          const ecomailResponse = await fetch(
            `https://api2.ecomailapp.cz/lists/${ecomailListId}/subscribe`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'key': ecomailApiKey
              },
              body: JSON.stringify({
                subscriber_data: {
                  email: email,
                  tags: ['RFM Analytics', exportType === 'csv' ? 'CSV Export' : 'Sheets Export']
                },
                trigger_autoresponders: true, // Odešle welcome email
                update_existing: true,
                resubscribe: false
              })
            }
          );

          if (ecomailResponse.ok) {
            console.log('✅ Ecomail: subscriber added');
            results.ecomailSuccess = true;
          } else {
            const errorData = await ecomailResponse.json().catch(() => ({}));
            console.error('❌ Ecomail error:', ecomailResponse.status, errorData);
            results.errors.push(`Ecomail error: ${ecomailResponse.status}`);
          }
        }
      } catch (error: any) {
        console.error('❌ Ecomail exception:', error.message);
        results.errors.push(`Ecomail exception: ${error.message}`);
      }
    } else {
      console.log('ℹ️ Newsletter not opted in, skipping Ecomail');
    }

    // 2. Google Sheets backup (všechny leady)
    try {
      const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
      const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
      const spreadsheetId = process.env.SPREADSHEET_ID;

      if (!clientEmail || !privateKey || !spreadsheetId) {
        console.warn('⚠️ Google Sheets credentials not configured');
        results.errors.push('Google Sheets není nakonfigurován');
      } else {
        const auth = new google.auth.JWT(
          clientEmail,
          undefined,
          privateKey,
          ['https://www.googleapis.com/auth/spreadsheets']
        );

        const sheets = google.sheets({ version: 'v4', auth });

        const now = new Date();
        const timestamp = now.toLocaleString('cs-CZ', {
          timeZone: 'Europe/Prague'
        });

        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'Leads!A:E', // Sheet "Leads", sloupce A-E
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [
              [
                timestamp,
                email,
                newsletter ? 'Ano' : 'Ne',
                exportType === 'csv' ? 'CSV' : 'Google Sheets',
                results.ecomailSuccess ? 'Ano' : 'Ne'
              ]
            ]
          }
        });

        console.log('✅ Google Sheets: lead saved');
        results.sheetsSuccess = true;
      }
    } catch (error: any) {
      console.error('❌ Google Sheets exception:', error.message);
      results.errors.push(`Google Sheets exception: ${error.message}`);
    }

    // Vrátit výsledek (i když některé API selhaly)
    return NextResponse.json({
      success: true,
      message: 'Lead byl zpracován',
      results
    });

  } catch (error: any) {
    console.error('❌ API /leads error:', error);
    return NextResponse.json(
      { error: 'Interní chyba serveru', details: error.message },
      { status: 500 }
    );
  }
}
