export interface CountryInfo {
  code: string
  name: string
  currency: string
  flag: string
  supported: boolean
}

export const SUPPORTED_COUNTRIES: Record<string, CountryInfo> = {
  CO: {
    code: 'CO',
    name: 'Colombia',
    currency: 'COP',
    flag: '🇨🇴',
    supported: true
  },
  EC: {
    code: 'EC',
    name: 'Ecuador',
    currency: 'USD',
    flag: '🇪🇨',
    supported: true
  }
}

export const DEFAULT_COUNTRY: CountryInfo = SUPPORTED_COUNTRIES.CO

export class GeolocationService {
  private static instance: GeolocationService
  private countryCache: string | null = null

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService()
    }
    return GeolocationService.instance
  }

  /**
   * Get user's country from IP using multiple services
   */
  async getCountryFromIP(): Promise<string> {
    if (this.countryCache) {
      return this.countryCache
    }

    try {
      // Try multiple IP geolocation services
      const services = [
        'https://ipapi.co/country_code/',
        'https://api.country.is/',
        'https://ipinfo.io/country'
      ]

      for (const service of services) {
        try {
          const response = await fetch(service)
          if (response.ok) {
            const data = await response.text()
            const countryCode = data.trim().toUpperCase()
            
            if (SUPPORTED_COUNTRIES[countryCode]) {
              this.countryCache = countryCode
              return countryCode
            }
          }
        } catch (error) {
          console.warn(`Failed to get country from ${service}:`, error)
        }
      }
    } catch (error) {
      console.error('Error detecting country:', error)
    }

    // Fallback to default country
    return DEFAULT_COUNTRY.code
  }

  /**
   * Get country info by code
   */
  getCountryInfo(countryCode: string): CountryInfo {
    return SUPPORTED_COUNTRIES[countryCode] || DEFAULT_COUNTRY
  }

  /**
   * Get currency for country
   */
  getCurrencyForCountry(countryCode: string): string {
    const countryInfo = this.getCountryInfo(countryCode)
    return countryInfo.currency
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount: number, currency: string, locale?: string): string {
    const localeMap: Record<string, string> = {
      COP: 'es-CO',
      USD: 'en-US'
    }

    try {
      return new Intl.NumberFormat(locale || localeMap[currency] || 'en-US', {
        style: 'currency',
        currency: currency
      }).format(amount)
    } catch (error) {
      return `${currency} ${amount.toFixed(2)}`
    }
  }

  /**
   * Validate if country is supported
   */
  isCountrySupported(countryCode: string): boolean {
    return SUPPORTED_COUNTRIES[countryCode]?.supported || false
  }

  /**
   * Get supported countries list
   */
  getSupportedCountries(): CountryInfo[] {
    return Object.values(SUPPORTED_COUNTRIES).filter(country => country.supported)
  }

  /**
   * Get user's timezone (for payment scheduling)
   */
  getUserTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch (error) {
      return 'America/Bogota' // Default to Colombia timezone
    }
  }

  /**
   * Clear cache (useful for testing)
   */
  clearCache(): void {
    this.countryCache = null
  }
}

// Export singleton instance
export const geolocationService = GeolocationService.getInstance()