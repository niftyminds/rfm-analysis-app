import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    // Uložení tokenu do session/cookie (bezpečně!)
    // Vytvoření HTML stránky, která zavře popup okno
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Přihlášení úspěšné</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            .checkmark {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h1 {
              margin: 0 0 0.5rem 0;
              font-size: 1.5rem;
            }
            p {
              margin: 0;
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="checkmark">✓</div>
            <h1>Přihlášení úspěšné!</h1>
            <p>Okno se automaticky zavře...</p>
          </div>
          <script>
            // Zavřít okno po krátkém zpoždění
            setTimeout(() => {
              window.close();
            }, 1500);
          </script>
        </body>
      </html>
    `;

    const response = new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });

    // Nastavení cookie pro OAuth token
    // DŮLEŽITÉ: Pro OAuth popup je potřeba sameSite: 'none' + secure: true
    // protože OAuth callback přichází z jiné domény (accounts.google.com)
    const isProduction = process.env.NODE_ENV === 'production';

    response.cookies.set('google_access_token', tokens.access_token!, {
      httpOnly: true,
      // PRODUCTION: secure=true + sameSite='none' pro cross-origin OAuth
      // DEVELOPMENT (localhost): secure=false + sameSite='lax' protože localhost je HTTP
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 3600, // 1 hodina
      path: '/' // Explicitně nastavit path pro celou aplikaci
    });

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
