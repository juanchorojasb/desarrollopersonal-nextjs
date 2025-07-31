'use client'

import Link from 'next/link'
import { BookOpen, Users, Award, TrendingUp, Star, Clock, CheckCircle } from 'lucide-react'

export default function AcademiaPage() {
  // Cursos estructurados de la academia
  const cursos = [
    {
      id: 1,
      titulo: "Fundamentos del Desarrollo Personal",
      descripcion: "Curso base para iniciar tu transformación personal con técnicas respaldadas por psicólogas expertas.",
      instructor: "Dra. María González",
      nivel: "Principiante",
      duracion: "4 semanas",
      lecciones: 12,
      estudiantes: 1247,
      rating: 4.9,
      precio: 25000,
      categoria: "Fundamentos",
      imagen: "/images/curso-fundamentos.jpg",
      modulos: [
        "Autoconocimiento básico",
        "Gestión emocional",
        "Establecimiento de metas",
        "Hábitos transformadores"
      ]
    },
    {
      id: 2,
      titulo: "Inteligencia Emocional Avanzada",
      descripcion: "Desarrolla tu capacidad de gestionar emociones complejas y mejorar tus relaciones interpersonales.",
      instructor: "Dra. Ana Rodríguez",
      nivel: "Intermedio",
      duracion: "6 semanas", 
      lecciones: 18,
      estudiantes: 892,
      rating: 4.8,
      precio: 80000,
      categoria: "Emociones",
      imagen: "/images/curso-emocional.jpg",
      modulos: [
        "Neurociencia emocional",
        "Regulación avanzada",
        "Empatía y conexión",
        "Liderazgo emocional"
      ]
    },
    {
      id: 3,
      titulo: "Transformación Integral Premium",
      descripcion: "Programa completo de transformación personal con acompañamiento 1:1 y herramientas avanzadas.",
      instructor: "Equipo Psicognitiva",
      nivel: "Avanzado",
      duracion: "12 semanas",
      lecciones: 36,
      estudiantes: 234,
      rating: 5.0,
      precio: 140000,
      categoria: "Premium",
      imagen: "/images/curso-premium.jpg",
      modulos: [
        "Análisis profundo personal",
        "Plan de transformación",
        "Sesiones individuales",
        "Mentoría continuada"
      ]
    }
  ]

  const estadisticas = {
    estudiantes: "2,500+",
    cursos: "25",
    instructores: "8",
    certificaciones: "1,200+"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Academia DesarrolloPersonal.uno
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              La primera academia online de desarrollo personal liderada por psicólogas expertas. 
              Formación estructurada, certificaciones oficiales y acompañamiento profesional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                Comenzar Formación
              </Link>
              <Link href="/cursos" className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                Ver Todos los Cursos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{estadisticas.estudiantes}</div>
              <div className="text-gray-600">Estudiantes Activos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{estadisticas.cursos}</div>
              <div className="text-gray-600">Cursos Disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{estadisticas.instructores}</div>
              <div className="text-gray-600">Psicólogas Expertas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">{estadisticas.certificaciones}</div>
              <div className="text-gray-600">Certificaciones Emitidas</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Cursos Destacados */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cursos de Formación</h2>
            <p className="text-lg text-gray-600">Programas estructurados diseñados por psicólogas expertas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cursos.map((curso) => (
              <div key={curso.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {curso.categoria}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{curso.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{curso.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-4">{curso.descripcion}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {curso.estudiantes} estudiantes
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {curso.duracion} • {curso.lecciones} lecciones
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Certificación incluida
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${curso.precio.toLocaleString('es-CO')}
                        </div>
                        <div className="text-sm text-gray-500">Pago único</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Por: {curso.instructor}</div>
                        <div className="text-sm text-blue-600">{curso.nivel}</div>
                      </div>
                    </div>
                    
                    <Link href={`/cursos/${curso.id}`} className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block text-center">
                      Ver Programa Completo
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metodología */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Metodología de Formación</h2>
            <p className="text-lg text-gray-600">Enfoque científico y práctico para tu transformación</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Contenido Estructurado</h3>
              <p className="text-gray-600">Lecciones organizadas en módulos progresivos con objetivos claros de aprendizaje.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seguimiento de Progreso</h3>
              <p className="text-gray-600">Dashboard personalizado para monitorear tu avance y completar evaluaciones.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Certificación Oficial</h3>
              <p className="text-gray-600">Certificados verificables emitidos al completar exitosamente cada programa.</p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para transformar tu vida?</h2>
          <p className="text-lg mb-6">Únete a más de 2,500 estudiantes que ya están en su proceso de crecimiento</p>
          <Link href="/auth/sign-up" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
            Comenzar mi Formación Ahora
          </Link>
        </div>
      </div>
    </div>
  )
}
