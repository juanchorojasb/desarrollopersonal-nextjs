"use client"
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Users, 
  Video,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react'

interface UserSubscription {
  id: string
  status: 'ACTIVE' | 'PENDING' | 'CANCELED' | 'PAST_DUE'
  plan: {
    name: string
    displayName: string
    hasLiveWorkshops: boolean
    hasCoaching: boolean
    maxCourses: number
  }
  startDate: string
  endDate: string
  priceAmount: number
  billingCycle: 'MONTHLY' | 'QUARTERLY'
}

interface DashboardStats {
  totalCourses: number
  completedCourses: number
  totalWatchTime: number
  currentStreak: number
  nextWorkshop?: {
    title: string
    date: string
  }
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData()
    }
  }, [isLoaded, user])

  const fetchUserData = async () => {
    try {
      const [subscriptionRes, statsRes] = await Promise.all([
        fetch('/api/user/subscription'),
        fetch('/api/user/stats')
      ])

      if (subscriptionRes.ok) {
        const subData = await subscriptionRes.json()
        setSubscription(subData.subscription)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (priceInCentavos: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(priceInCentavos / 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-50'
      case 'PENDING': return 'text-yellow-600 bg-yellow-50'
      case 'PAST_DUE': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activo'
      case 'PENDING': return 'Pendiente'
      case 'PAST_DUE': return 'Vencido'
      case 'CANCELED': return 'Cancelado'
      default: return status
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold text-gray-900">DesarrolloPersonal.uno</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">¡Hola, {user?.firstName}!</span>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {user?.firstName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tu Dashboard de Crecimiento
          </h1>
          <p className="text-gray-600">
            Seguimiento de tu progreso y acceso a todo tu contenido personalizado
          </p>
        </div>

        {/* Subscription Status Card */}
        {subscription && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="h-8 w-8" />
                <div>
                  <h2 className="text-2xl font-bold">{subscription.plan.displayName}</h2>
                  <p className="text-blue-100">
                    Activo hasta {formatDate(subscription.endDate)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {getStatusText(subscription.status)}
                </div>
                <p className="text-blue-100 mt-2">
                  {formatPrice(subscription.priceAmount)} / {subscription.billingCycle === 'MONTHLY' ? 'mes' : '3 meses'}
                </p>
              </div>
            </div>

            {/* Plan Features */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm">
                  {subscription.plan.maxCourses === -1 ? 'Cursos ilimitados' : `${subscription.plan.maxCourses} cursos`}
                </span>
              </div>
              
              {subscription.plan.hasLiveWorkshops && (
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4" />
                  <span className="text-sm">Talleres en vivo</span>
                </div>
              )}
              
              {subscription.plan.hasCoaching && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Coaching 1:1</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span className="text-sm">Certificados oficiales</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Progreso de Cursos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completedCourses}/{stats.totalCourses}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(stats.completedCourses / stats.totalCourses) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Tiempo de Estudio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor(stats.totalWatchTime / 60)}h {stats.totalWatchTime % 60}m
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-green-600 text-sm mt-2">+47 min esta semana</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Racha Actual</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.currentStreak} días</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-yellow-600 text-sm mt-2">¡Sigue así!</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Nivel</p>
                  <p className="text-2xl font-bold text-gray-900">7</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-purple-600 text-sm mt-2">240 XP para nivel 8</p>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Continúa tu aprendizaje</h3>
            
            <div className="space-y-4">
              <Link href="/dashboard/cursos" className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Mis Cursos</h4>
                      <p className="text-gray-600 text-sm">Continúa donde lo dejaste</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stats?.completedCourses}</p>
                    <p className="text-gray-500 text-sm">completados</p>
                  </div>
                </div>
              </Link>

              {subscription?.plan.hasLiveWorkshops && stats?.nextWorkshop && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Video className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Próximo Taller en Vivo</h4>
                      <p className="text-gray-600">{stats.nextWorkshop.title}</p>
                      <p className="text-green-600 text-sm font-medium">
                        {formatDate(stats.nextWorkshop.date)} a las 2:00 PM
                      </p>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Reservar Cupo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Management */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4">Gestionar Suscripción</h4>
              
              <div className="space-y-3">
                <Link href="/dashboard/billing" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">Métodos de pago</span>
                </Link>
                
                <Link href="/dashboard/billing/history" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Historial de pagos</span>
                </Link>
                
                <Link href="/pricing" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors">
                  <Crown className="h-4 w-4" />
                  <span className="text-sm">Cambiar plan</span>
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4">¿Necesitas ayuda?</h4>
              
              <div className="space-y-3">
                <a href="mailto:soporte@desarrollopersonal.uno" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Contactar soporte</span>
                </a>
                
                <Link href="/faq" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Preguntas frecuentes</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
