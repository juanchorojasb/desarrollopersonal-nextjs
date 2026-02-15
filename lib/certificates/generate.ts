import { jsPDF } from 'jspdf';

export function generateCertificatePDF(data: {
  userName: string;
  courseName: string;
  completionDate: Date;
  certificateId: string;
}) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Fondo degradado simulado con rectángulos
  doc.setFillColor(99, 102, 241); // Indigo
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setFillColor(139, 92, 246); // Purple
  doc.rect(0, pageHeight * 0.7, pageWidth, pageHeight * 0.3, 'F');

  // Borde decorativo
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
  doc.setLineWidth(0.5);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Título "CERTIFICADO"
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICADO', pageWidth / 2, 40, { align: 'center' });

  // Subtítulo
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('de Finalización de Curso', pageWidth / 2, 55, { align: 'center' });

  // "Se otorga a"
  doc.setFontSize(14);
  doc.text('Se otorga a:', pageWidth / 2, 80, { align: 'center' });

  // Nombre del usuario
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(data.userName, pageWidth / 2, 100, { align: 'center' });

  // Línea decorativa bajo el nombre
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(60, 105, pageWidth - 60, 105);

  // "Por completar exitosamente"
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Por completar exitosamente el curso:', pageWidth / 2, 120, { align: 'center' });

  // Nombre del curso
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  
  // Dividir el nombre del curso si es muy largo
  const courseNameLines = doc.splitTextToSize(data.courseName, pageWidth - 80);
  const courseY = 135;
  courseNameLines.forEach((line: string, index: number) => {
    doc.text(line, pageWidth / 2, courseY + (index * 10), { align: 'center' });
  });

  // Fecha
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const formattedDate = data.completionDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.text(`Fecha de emisión: ${formattedDate}`, pageWidth / 2, 165, { align: 'center' });

  // Logo/Sello (simulado con círculo)
  doc.setFillColor(255, 255, 255);
  doc.circle(40, pageHeight - 40, 15, 'F');
  doc.setTextColor(99, 102, 241);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DP', 40, pageHeight - 38, { align: 'center' });

  // Firma (simulada)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('_____________________', pageWidth - 60, pageHeight - 40, { align: 'center' });
  doc.text('Dora Luz Betancourth', pageWidth - 60, pageHeight - 33, { align: 'center' });
  doc.text('Psicóloga', pageWidth - 60, pageHeight - 28, { align: 'center' });

  // ID del certificado
  doc.setFontSize(8);
  doc.text(`ID: ${data.certificateId}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
  
  // URL de verificación
  doc.text('https://desarrollopersonal.uno/certificados/verificar', pageWidth / 2, pageHeight - 15, { align: 'center' });

  return doc;
}

export function downloadCertificate(pdf: jsPDF, fileName: string) {
  pdf.save(fileName);
}

export function getCertificateBase64(pdf: jsPDF): string {
  return pdf.output('dataurlstring');
}
