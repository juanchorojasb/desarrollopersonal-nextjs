export default function PricingPage() {
  const plans = [
    {
      name: "Básico",
      price: "Gratis",
      period: "",
      popular: false,
      description: "Perfecto para comenzar tu viaje de desarrollo personal",
      features: [
        "Acceso a 3 cursos básicos",
        "Contenido introductorio",
        "Comunidad básica",
        "Soporte por email"
      ],
      buttonText: "Comenzar Gratis",
      buttonStyle: "border border-gray-300 text-gray-700 hover:border-gray-400"
    },
    {
      name: "Premium",
      price: "€29.99",
      period: "/mes",
      popular: true,
      description: "La opción más popular para un crecimiento integral",
      features: [
        "Acceso ilimitado a todos los cursos",
        "Talleres en vivo semanales",
        "Sesiones 1:1 mensuales",
        "Soporte prioritario 24/7",
        "Certificados de finalización",
        "Comunidad privada VIP",
        "Descarga de materiales",
        "Acceso temprano a nuevo contenido"
      ],
      buttonText: "Comenzar Ahora",
      buttonStyle: "bg-blue-600 text-white hover:bg-blue-700"
    },
    {
      name: "Pro",
      price: "€79.99",
      period: "/mes",
      popular: false,
      description: "Para profesionales que buscan el máximo nivel",
      features: [
        "Todo de Premium incluido",
        "Sesiones 1:1 semanales",
        "Coaching personalizado",
        "Plan de desarrollo personalizado",
        "Acceso a mentores expertos",
        "Revisión de progreso mensual",
        "Contenido exclusivo Pro",
        "Prioridad en eventos especiales"
      ],
      buttonText: "Contactar Ventas",
      buttonStyle: "bg-purple-600 text-white hover:bg-purple-700"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Planes y Precios
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige el plan perfecto para tu viaje de desarrollo personal. 
            Todos los planes incluyen acceso inmediato y garantía de 30 días.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 border border-gray-200">
            <div className="flex">
              <button className="px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-md">
                Mensual
              </button>
              <button className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Anual (2 meses gratis)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-sm border-2 p-8 ${
                plan.popular 
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 text-sm font-medium rounded-full">
                    Más Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-600">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${plan.buttonStyle}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Preguntas Frecuentes
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Puedo cambiar de plan en cualquier momento?
              </h3>
              <p className="text-gray-600 mb-6">
                Sí, puedes actualizar o degradar tu plan en cualquier momento. 
                Los cambios se reflejan inmediatamente y se prorratean en tu próxima factura.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Hay compromiso de permanencia?
              </h3>
              <p className="text-gray-600 mb-6">
                No, todos nuestros planes son sin compromiso. Puedes cancelar en cualquier 
                momento y conservarás acceso hasta el final del período pagado.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Qué incluye la garantía de 30 días?
              </h3>
              <p className="text-gray-600">
                Si no estás completamente satisfecho en los primeros 30 días, 
                te devolvemos el 100% de tu dinero, sin preguntas.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Los precios incluyen impuestos?
              </h3>
              <p className="text-gray-600 mb-6">
                Los precios mostrados no incluyen IVA. Los impuestos se calculan 
                automáticamente según tu ubicación durante el checkout.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Qué métodos de pago aceptan?
              </h3>
              <p className="text-gray-600 mb-6">
                Aceptamos todas las tarjetas de crédito principales (Visa, MasterCard, American Express), 
                PayPal y transferencias bancarias.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Hay descuentos para estudiantes?
              </h3>
              <p className="text-gray-600">
                Sí, ofrecemos un 50% de descuento para estudiantes verificados. 
                Contacta con nuestro equipo de ventas para más información.
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">¿Necesitas algo más?</h2>
          <p className="text-xl mb-6 opacity-90">
            Ofrecemos soluciones empresariales personalizadas para equipos y organizaciones
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-2xl mb-2">🏢</div>
              <h3 className="font-semibold mb-2">Para Empresas</h3>
              <p className="text-sm opacity-90">Licencias corporativas y gestión de equipos</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🎓</div>
              <h3 className="font-semibold mb-2">Para Instituciones</h3>
              <p className="text-sm opacity-90">Planes especiales para universidades y centros</p>
            </div>
            <div>
              <div className="text-2xl mb-2">👨‍💼</div>
              <h3 className="font-semibold mb-2">Consultoría</h3>
              <p className="text-sm opacity-90">Servicios de consultoría y coaching personalizado</p>
            </div>
          </div>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contactar Ventas
          </button>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Más de 10,000 personas confían en nosotros
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Los cursos han transformado completamente mi perspectiva sobre el crecimiento personal. 
                El contenido es excepcional y muy práctico."
              </p>
              <div className="text-center">
                <div className="font-semibold text-gray-900">María González</div>
                <div className="text-sm text-gray-600">Gerente de Marketing</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "La comunidad y el soporte son increíbles. He encontrado exactamente 
                lo que necesitaba para mi desarrollo profesional."
              </p>
              <div className="text-center">
                <div className="font-semibold text-gray-900">Carlos Ruiz</div>
                <div className="text-sm text-gray-600">Emprendedor</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Los talleres en vivo y las sesiones personalizadas han sido un game-changer 
                para mi crecimiento personal y profesional."
              </p>
              <div className="text-center">
                <div className="font-semibold text-gray-900">Ana Martín</div>
                <div className="text-sm text-gray-600">Consultora</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comienza tu transformación hoy
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a miles de personas que ya están creciendo con nosotros
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/sign-up" 
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Empezar Gratis
            </a>
            <a 
              href="/dashboard" 
              className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors"
            >
              Ver Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}