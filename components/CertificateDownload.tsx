'use client';

import { useState } from 'react';
import { Download, Award } from 'lucide-react';
import { generateCertificatePDF, downloadCertificate } from '@/lib/certificates/generate';

interface Props {
  courseId: string;
  courseName: string;
  userName: string;
  completionDate: Date;
  certificateId: string;
}

export default function CertificateDownload({ 
  courseId, 
  courseName, 
  userName, 
  completionDate,
  certificateId 
}: Props) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const pdf = generateCertificatePDF({
        userName,
        courseName,
        completionDate: new Date(completionDate),
        certificateId
      });

      downloadCertificate(pdf, `Certificado-${courseName.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error al generar el certificado');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
    >
      {generating ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Generando...</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Descargar Certificado</span>
        </>
      )}
    </button>
  );
}
