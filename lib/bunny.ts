// lib/bunny.ts - Cliente Bunny.net con tus credenciales

interface BunnyConfig {
  storageZoneName: string
  hostname: string
  username: string
  password: string
  cdnUrl: string
}

class BunnyClient {
  private config: BunnyConfig

  constructor() {
    this.config = {
      storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME || 'desarrollopersonal',
      hostname: process.env.BUNNY_HOSTNAME || 'br.storage.bunnycdn.com',
      username: process.env.BUNNY_USERNAME || 'desarrollopersonal', 
      password: process.env.BUNNY_PASSWORD || '0e0e861a-1456-4e47-a89a758f3cd5-a2b5-4da7',
      cdnUrl: process.env.NEXT_PUBLIC_BUNNY_CDN_URL || 'https://desarrollopersonal.b-cdn.net',
    }
  }

  // Obtener URL de video optimizada
  getVideoUrl(filename: string, quality?: 'low' | 'medium' | 'high'): string {
    const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename
    let url = `${this.config.cdnUrl}/${cleanFilename}`
    
    if (quality) {
      const qualityParams = {
        low: '?width=854&height=480&quality=70',
        medium: '?width=1280&height=720&quality=85', 
        high: '?width=1920&height=1080&quality=95'
      }
      url += qualityParams[quality]
    }
    
    return url
  }

  // Obtener thumbnail del video
  getThumbnailUrl(filename: string, timeInSeconds: number = 1): string {
    const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename
    const videoName = cleanFilename.replace(/\.[^/.]+$/, "")
    return `${this.config.cdnUrl}/${videoName}_thumbnail_${timeInSeconds}s.jpg`
  }

  // Verificar si video existe
  async videoExists(filename: string): Promise<boolean> {
    try {
      const response = await fetch(this.getVideoUrl(filename), { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }
}

export const bunnyClient = new BunnyClient()

// Hook para usar en componentes React
export const useBunnyVideo = (filename: string) => {
  return {
    videoUrl: bunnyClient.getVideoUrl(filename),
    thumbnailUrl: bunnyClient.getThumbnailUrl(filename),
    lowQuality: bunnyClient.getVideoUrl(filename, 'low'),
    mediumQuality: bunnyClient.getVideoUrl(filename, 'medium'),
    highQuality: bunnyClient.getVideoUrl(filename, 'high'),
  }
}
