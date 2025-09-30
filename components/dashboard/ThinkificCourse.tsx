export default function ThinkificCourse() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">🎓</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Curso en Thinkific</h3>
            <p className="text-sm text-gray-600">Fundamentos de Bienestar Emocional</p>
          </div>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Acceso Completo
        </span>
      </div>
      
      <p className="text-gray-700 mb-4">
        Accede a nuestro curso completo en Thinkific. Aprende técnicas fundamentales 
        para mejorar tu bienestar emocional con contenido respaldado por la ciencia.
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>• 12 módulos</span>
          <span>• 3 horas de contenido</span>
          <span>• Certificado incluido</span>
        </div>
      </div>
      
      <a 
        href="https://psicognitiva.thinkific.com/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center block"
      >
        Acceder al Curso en Thinkific →
      </a>
    </div>
  )
}
