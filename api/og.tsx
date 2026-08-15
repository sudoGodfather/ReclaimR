import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

/**
 * Serverless Dynamic Open Graph Image Route: GET /api/og
 * Renders a 1200x630 image with ink background (#0C0E0B),
 * Inter sans headline, rust underline (#C24A2E), and ReclaimR wordmark.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'ReclaimR';
    const subtitle = searchParams.get('subtitle') || 'Stop the rot. Start the growth.';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0C0E0B',
            padding: '80px 100px',
            fontFamily: 'sans-serif',
            color: '#F2EFE6',
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <span
              style={{
                fontSize: 36,
                fontWeight: 600,
                fontStyle: 'italic',
                color: '#F2EFE6',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#C24A2E',
                letterSpacing: '0.2em',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
              }}
            >
              ON-DEVICE MONETARY SOVEREIGNTY
            </span>
          </div>

          {/* Center Main Headline + Rust Underline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h1
              style={{
                fontSize: 72,
                fontWeight: 600,
                lineHeight: 1.1,
                color: '#F2EFE6',
                margin: 0,
                letterSpacing: '-0.03em',
              }}
            >
              {subtitle}
            </h1>

            {/* Rust Underline Bar */}
            <div
              style={{
                width: '320px',
                height: '6px',
                backgroundColor: '#C24A2E',
                borderRadius: '3px',
              }}
            />
          </div>

          {/* Footer Metadata */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid rgba(242, 239, 230, 0.14)',
              paddingTop: '32px',
              fontFamily: 'monospace',
              fontSize: 16,
              color: '#A3A096',
              letterSpacing: '0.15em',
            }}
          >
            <span>AUTOMATED UPI AUTOPAY AUDIT</span>
            <span style={{ color: '#2E5B3F' }}>NIFTY 50 SIP COMPOUNDING</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}

export default GET;
