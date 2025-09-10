export default function FAQPage() {
  const faqCategories = [
    {
      title: "Primeros Pasos",
      questions: [
        {
          question: "¿Cómo empiezo en DesarrolloPersonal.uno?",
          answer: "Es muy sencillo: 1) Crea tu cuenta gratuita, 2) Explora nuestro catálogo de cursos, 3) Elige tu plan (puedes empezar gratis), y 4) ¡Comienza tu primer curso! Tendrás acceso inmediato a todo el contenido."
        },
        {
          question: "¿Necesito experiencia previa en desarrollo personal?",
          answer: "No, nuestros cursos están diseñados para todos los niveles. Comenzamos desde lo básico y progresamos gradualmente. Tenemos contenido tanto para principiantes completos como para personas con experiencia que buscan profundizar."
        },
        {
          question: "¿Cuánto tiempo necesito dedicar diariamente?",
          answer: "Recomendamos entre 15-30 minutos diarios para obtener los mejores resultados. Sin embargo, puedes ir a tu propio ritmo. Los cursos están diseñados para ser flexibles y adaptarse a tu horario."
        }
      ]
    },
    {
      title: "Planes y Pagos",
      questions: [
        {
          question: "¿Qué diferencia hay entre los planes?",
          answer: "El plan Básico te da acceso a cursos introductorios. Premium incluye todos los cursos, talleres en vivo, certificados y soporte prioritario. Pro añade coaching personalizado y sesiones 1:1 semanales."
        },
        {
          question: "¿Puedo cambiar mi plan en cualquier momento?",
          answer: "Sí, puedes actualizar o degradar tu plan cuando quieras. Los cambios se aplican inmediatamente y se ajustan en tu próxima factura. No hay penalizaciones por cambiar de plan."
        },
        {
          question: "¿Qué métodos de pago aceptan?",
          answer: "Aceptamos todas las tarjetas de crédito principales (Visa, MasterCard, American Express), PayPal y transferencias bancarias. Todos los pagos se procesan de forma segura con cifrado SSL."
        },
        {
          question: "¿Hay garantía de reembolso?",
          answer: "Sí, ofrecemos una garantía de 30 días sin preguntas. Si no estás completamente satisfecho, te devolvemos el 100% de tu dinero dentro de los primeros 30 días."
        }
      ]
    },
    {
      title: "Cursos y Contenido",
      questions: [
        {
          question: "¿Cuántos cursos están disponibles?",
          answer: "Tenemos más de 50 cursos en diferentes áreas: mindfulness, productividad, liderazgo, inteligencia emocional, comunicación, y mucho más. Añadimos nuevo contenido cada mes."
        },
        {
          question: "¿Los cursos tienen certificados?",
          answer: "Sí, al completar cada curso recibes un certificado digital que puedes descargar y compartir en LinkedIn. Los certificados están respaldados por nuestra institución y son válidos para desarrollo profesional."
        },
        {
          question: "¿Puedo descargar el contenido?",
          answer: "Con el plan Premium y Pro puedes descargar todos los materiales: videos, audios, PDFs y recursos adicionales. Esto te permite estudiar offline y tener acceso permanente al contenido."
        },
        {
          question: "¿Con qué frecuencia se actualiza el contenido?",
          answer: "Actualizamos y añadimos nuevo contenido mensualmente. Los miembros Premium y Pro tienen acceso temprano a las nuevas lecciones y cursos antes de su lanzamiento público."
        }
      ]
    },
    {
      title: "Talleres y Comunidad",
      questions: [
        {
          question: "¿Cómo funcionan los talleres en vivo?",
          answer: "Los talleres se realizan semanalmente vía Zoom con nuestros expertos. Son sesiones interactivas donde puedes hacer preguntas, participar en ejercicios y conectar con otros miembros. Se graban para verlas después."
        },
        {
          question: "¿Puedo acceder a la grabación si no puedo asistir?",
          answer: "Sí, todos los talleres se graban y están disponibles en tu área privada dentro de 24 horas. También incluimos transcripciones y materiales adicionales discutidos en la sesión."
        },
        {
          question: "¿Cómo accedo a la comunidad privada?",
          answer: "La comunidad privada está en una plataforma exclusiva para miembros Premium y Pro. Recibirás la invitación por email tras tu suscripción. Es un espacio seguro para compartir experiencias y hacer networking."
        }
      ]
    },
    {
      title: "Soporte Técnico",
      questions: [
        {
          question: "¿Qué hago si tengo problemas técnicos?",
          answer: "Nuestro equipo de soporte técnico está disponible 24/7 para miembros Premium y Pro. Puedes contactarnos por chat, email o teléfono. Los usuarios básicos tienen soporte por email con respuesta en 24h."
        },
        {
          question: "¿La plataforma funciona en móviles?",
          answer: "Sí, nuestra plataforma está optimizada para todos los dispositivos. Puedes acceder desde tu ordenador, tablet o smartphone. También tenemos apps nativas para iOS y Android."
        },
        {
          question: "¿Necesito software especial?",
          answer: "No, solo necesitas un navegador web moderno y conexión a internet. Para talleres en vivo utilizamos Zoom, que es gratuito y fácil de instalar."
        }
      ]
    },
    {
      title: "Cuenta y Privacidad",
      questions: [
        {
          question: "¿Cómo cancelo mi suscripción?",
          answer: "Puedes cancelar en cualquier momento desde tu panel de control. No hay penalizaciones y mantendrás acceso hasta el final del período pagado. También puedes pausar tu suscripción por hasta 3 meses."
        },
        {
          question: "¿Qué pasa con mis datos si cancelo?",
          answer: "Conservamos tu progreso y certificados por 2 años tras la cancelación. Puedes reactivar tu cuenta en cualquier momento y retomar donde lo dejaste. Tus datos personales se eliminan según nuestra política de privacidad."
        },
        {
          question: "¿Es segura mi información personal?",
          answer: "Absolutamente. Utilizamos cifrado SSL, cumplimos con GDPR y nunca compartimos tus datos con terceros. Tus datos están protegidos con los más altos estándares de seguridad."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-gray-600">
            Encuentra respuestas a las preguntas más comunes sobre DesarrolloPersonal.uno
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar en las preguntas..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900">{category.title}</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {category.questions.map((item, index) => (
                  <div key={index} className="p-6">
                    <button className="w-full text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 pr-4">
                          {item.question}
                        </h3>
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    <div className="mt-4 pr-8">
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-xl mb-6 opacity-90">
            Nuestro equipo de soporte está aquí para ayudarte con cualquier pregunta
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold mb-2">Chat en Vivo</h3>
              <p className="text-sm opacity-90">Lun-Vie 9:00-18:00</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-2xl mb-2">📧</div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm opacity-90">Respuesta en 24h</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-2xl mb-2">📞</div>
              <h3 className="font-semibold mb-2">Teléfono</h3>
              <p className="text-sm opacity-90">+34 900 123 456</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Iniciar Chat
            </button>
            <a 
              href="mailto:soporte@desarrollopersonal.uno" 
              className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              Enviar Email
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Enlaces Útiles</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <a href="/pricing" className="text-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-medium text-gray-900 mb-2">Planes y Precios</h3>
              <p className="text-sm text-gray-600">Ver todos los planes disponibles</p>
            </a>
            
            <a href="/dashboard/ayuda" className="text-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="text-2xl mb-2">🆘</div>
              <h3 className="font-medium text-gray-900 mb-2">Centro de Ayuda</h3>
              <p className="text-sm text-gray-600">Guías y tutoriales detallados</p>
            </a>
            
            <a href="/dashboard" className="text-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="text-2xl mb-2">🎓</div>
              <h3 className="font-medium text-gray-900 mb-2">Mis Cursos</h3>
              <p className="text-sm text-gray-600">Acceder a tu dashboard</p>
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="inline-block px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  )
}