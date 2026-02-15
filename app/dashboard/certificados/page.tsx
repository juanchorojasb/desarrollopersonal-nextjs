import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Award, Calendar } from 'lucide-react';
import CertificateDownload from '@/components/CertificateDownload';

async function getCertificates(userId: string) {
  return await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          title: true,
          imageUrl: true,
          category: true,
        }
      }
    },
    orderBy: { issuedAt: 'desc' }
  });
}

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/signin');

  const certificates = await getCertificates(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-500" />
            Mis Certificados
          </h1>
          <p className="text-gray-600 mt-2">
            {certificates.length > 0
              ? `Has obtenido ${certificates.length} certificado${certificates.length > 1 ? 's' : ''}`
              : 'Completa cursos para obtener certificados'
            }
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aún no tienes certificados
            </h3>
            <p className="text-gray-600 mb-6">
              Completa cursos para obtener certificados verificables
            </p>
            <Link
              href="/dashboard/cursos"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Explorar Cursos
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-indigo-400 hover:shadow-xl transition-all"
              >
                <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Award className="w-16 h-16 text-white" />
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                    {cert.courseName}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(cert.issuedAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">Otorgado a:</p>
                    <p className="font-semibold text-gray-900">{cert.userName}</p>
                  </div>

                  <CertificateDownload
                    courseId={cert.courseId}
                    courseName={cert.courseName}
                    userName={cert.userName}
                    completionDate={cert.issuedAt}
                    certificateId={cert.id}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {certificates.length > 0 && (
          <div className="mt-8 bg-indigo-50 rounded-xl p-6 border border-indigo-200">
            <h3 className="font-semibold text-indigo-900 mb-2">
              ℹ️ Sobre tus certificados
            </h3>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• Los certificados son verificables a través de su ID único</li>
              <li>• Puedes descargarlos en formato PDF en cualquier momento</li>
              <li>• Comparte tus logros en LinkedIn y redes sociales</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
