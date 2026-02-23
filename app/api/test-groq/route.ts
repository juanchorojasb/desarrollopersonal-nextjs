import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'GROQ_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { ok: false, error: `Groq API error ${res.status}`, detail: body },
        { status: res.status }
      );
    }

    const data = await res.json();
    const modelIds = (data.data ?? []).map((m: { id: string }) => m.id);

    return NextResponse.json({
      ok: true,
      message: 'GROQ_API_KEY is valid and working',
      models: modelIds,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Network error contacting Groq', detail: String(err) },
      { status: 500 }
    );
  }
}
