import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `Eres Dora, asistente virtual de DesarrolloPersonal.uno, una plataforma educativa de psicología y desarrollo personal.

Tu rol:
- Apoyar a los usuarios en su camino de crecimiento personal y bienestar
- Responder preguntas sobre los cursos, el foro, las insignias y la gamificación de la plataforma
- Motivar a los usuarios a mantener sus rachas y completar sus objetivos
- Ofrecer orientación psicológica general y técnicas de desarrollo personal (no terapia clínica)
- Ayudar a navegar la plataforma: cursos, certificados, comunidad, analytics

Pautas:
- Responde siempre en español, de forma cálida, empática y profesional
- Sé conciso (máximo 3-4 párrafos por respuesta salvo que se pida más detalle)
- Si alguien tiene una crisis emocional grave, recomienda buscar ayuda profesional
- No des diagnósticos clínicos ni reemplaces la atención psicológica profesional
- Celebra los logros del usuario y refuerza su motivación`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY not configured on server' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const result = await streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: SYSTEM_PROMPT,
    messages,
    maxTokens: 1024,
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}
