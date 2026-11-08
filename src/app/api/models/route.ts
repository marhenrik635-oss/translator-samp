import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_ENDPOINT = process.env.DEFAULT_LLM_ENDPOINT || 'https://rnrbmqc.abc-tunnel.us/v1';
const DEFAULT_KEY = process.env.DEFAULT_LLM_API_KEY || 'sk-dccd02cc8ccf53e8-zqx07k-0f0bc410';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const endpoint = (body.endpoint || DEFAULT_ENDPOINT).replace(/\/+$/, '');
    const apiKey = body.apiKey || DEFAULT_KEY;

    const url = `${endpoint}/models`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
      },
      // Cache for 60 seconds or fresh
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Gagal scrape models dari endpoint (${response.status}): ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawList = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);

    // Map and filter text/chat-friendly models
    const models = rawList
      .map((item: any) => ({
        id: item.id,
        owned_by: item.owned_by || '',
        context_length: item.context_length || 0,
      }))
      .filter((m: any) => {
        // Exclude image-only generation models
        const id = m.id.toLowerCase();
        return !id.includes('image') && !id.includes('flux') && !id.includes('sdxl') && !id.includes('kling');
      })
      .sort((a: any, b: any) => {
        // Prioritize free models or mimo / deepseek / glm
        const aPref = a.id.includes('free') || a.id.includes('mimo');
        const bPref = b.id.includes('free') || b.id.includes('mimo');
        if (aPref && !bPref) return -1;
        if (!aPref && bPref) return 1;
        return a.id.localeCompare(b.id);
      });

    return NextResponse.json({
      success: true,
      count: models.length,
      models,
    });
  } catch (error: any) {
    console.error('Scrape models error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error scraping models' },
      { status: 500 }
    );
  }
}
