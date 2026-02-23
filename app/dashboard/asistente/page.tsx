import { redirect } from 'next/navigation';
import { Bot, Mic, Volume2, Zap } from 'lucide-react';
import { getCurrentUser } from '@/lib/server-auth';
import VoiceAssistant from '@/components/VoiceAssistant';

export const metadata = {
  title: 'Asistente IA — DesarrolloPersonal.uno',
  description: 'Tu asistente personal de desarrollo y bienestar, disponible 24/7',
};

export default async function AsistentePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/signin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dora — Asistente IA</h1>
              <p className="text-sm text-gray-500">Llama 3.3 70B · DesarrolloPersonal.uno</p>
            </div>
          </div>
          <p className="text-gray-600 mt-3 max-w-2xl">
            Tu compañera de desarrollo personal, disponible 24/7. Puedes escribirle o hablarle
            directamente usando el micrófono.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { icon: Mic, label: 'Voz a texto' },
            { icon: Volume2, label: 'Respuestas en voz' },
            { icon: Zap, label: 'Respuestas instantáneas' },
            { icon: Bot, label: 'IA especializada en bienestar' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200 shadow-sm"
            >
              <Icon className="w-3.5 h-3.5 text-indigo-500" />
              {label}
            </span>
          ))}
        </div>

        {/* Chat window */}
        <div className="h-[580px]">
          <VoiceAssistant />
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-xs text-gray-400 text-center">
          Dora ofrece orientación general de desarrollo personal. No reemplaza la atención psicológica
          profesional. Si necesitas apoyo clínico, consulta con un especialista.
        </p>
      </div>
    </div>
  );
}
