export default function SpotifyPodcasts() {
  const podcasts = [
    {
      title: "Psicología Práctica - Episodio Reciente",
      description: "Estrategias para manejar el estrés diario",
      duration: "45 min",
      date: "Hace 2 días",
      url: "https://open.spotify.com/episode/6usKPGp3I9FPPgiGSEdim2?si=RskK0ZKvRJypxwpYfTiGKA"
    },
    {
      title: "Mindfulness para Principiantes",
      description: "Introducción a la práctica de atención plena",
      duration: "32 min",
      date: "Hace 1 semana",
      url: "#"
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">🎧</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Podcasts en Spotify</h3>
            <p className="text-sm text-gray-600">Nuevos episodios cada martes</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {podcasts.map((podcast, index) => (
          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{podcast.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{podcast.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{podcast.duration}</span>
                  <span>{podcast.date}</span>
                </div>
              </div>
              <a 
                href={podcast.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Escuchar
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
