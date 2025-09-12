'use client'

import { useState } from 'react';

interface EmailNotifierProps {
  userEmail: string;
  userName: string;
}

export default function EmailNotifier({ userEmail, userName }: EmailNotifierProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailTemplates = [
    { id: 'welcome', label: 'Bienvenida', subject: 'Bienvenido a DesarrolloPersonal.uno' },
    { id: 'plan_upgrade', label: 'Actualización de Plan', subject: 'Tu plan ha sido actualizado' },
    { id: 'course_reminder', label: 'Recordatorio de Curso', subject: 'Continúa tu aprendizaje' },
    { id: 'custom', label: 'Personalizado', subject: 'Mensaje personalizado' }
  ];

  const handleSendEmail = async (templateId: string) => {
    setLoading(true);
    // Placeholder for email sending logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Email enviado a ${userEmail}`);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <div className="relative ml-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-green-600 hover:text-green-800 text-sm"
      >
        Enviar Email
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white rounded-md shadow-lg border right-0">
          <div className="py-1">
            <div className="px-3 py-2 text-sm font-medium text-gray-700 border-b">
              Enviar email a {userName}
            </div>
            {emailTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSendEmail(template.id)}
                disabled={loading}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-gray-700"
              >
                <div className="font-medium">{template.label}</div>
                <div className="text-xs text-gray-500">{template.subject}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
