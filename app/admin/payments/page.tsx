'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle, XCircle, Eye, Clock, DollarSign, RefreshCw, AlertCircle, Users } from 'lucide-react'

interface Payment {
  id: string
  reference: string
  amount: number
  currency: string
  billingCycle: string
  status: string
  proofUrl?: string
  transferReference?: string
  submittedAt?: string
  expiresAt?: string
  approvedAt?: string
  rejectedAt?: string
  plan: {
    id: string
    displayName: string
  }
  user: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalAmount: 0
  })

  const fetchPayments = async () => {
    try {
      setError('')
      const response = await fetch('/api/admin/qr-payments/approve')
      const data = await response.json()
      
      if (data.success) {
        setPayments(data.payments)
        setStats(data.stats)
        console.log(`✅ Datos cargados: ${data.payments.length} pagos`)
      } else {
        setError(data.error || 'Error cargando pagos')
        console.error('❌ Error API:', data.error)
      }
    } catch (error) {
      console.error('❌ Error fetching payments:', error)
      setError('Error de conexión al cargar pagos')
    }
    setLoading(false)
  }

  const processPayment = async (paymentId: string, approved: boolean, rejectionReason?: string) => {
    setProcessing(paymentId)
    try {
      console.log(`🔄 Procesando pago ${paymentId}: ${approved ? 'APROBAR' : 'RECHAZAR'}`)
      
      const response = await fetch('/api/admin/qr-payments/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentId, 
          approved,
          rejectionReason: rejectionReason || 'Comprobante no válido'
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log(`✅ Pago procesado exitosamente: ${data.message}`)
        // Refresh payments list
        await fetchPayments()
        setSelectedPayment(null)
      } else {
        setError(data.error || 'Error procesando pago')
        console.error('❌ Error procesando:', data.error)
      }
    } catch (error) {
      console.error('❌ Error processing payment:', error)
      setError('Error de conexión al procesar pago')
    }
    setProcessing(null)
  }

  useEffect(() => {
    fetchPayments()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPayments, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: { 
        variant: 'secondary' as const, 
        label: '⏳ Pendiente', 
        className: 'bg-gray-500 text-white' 
      },
      VERIFICATION_PENDING: { 
        variant: 'default' as const, 
        label: '🔍 Por Verificar', 
        className: 'bg-orange-500 text-white' 
      },
      APPROVED: { 
        variant: 'default' as const, 
        label: '✅ Aprobado', 
        className: 'bg-green-500 text-white' 
      },
      REJECTED: { 
        variant: 'destructive' as const, 
        label: '❌ Rechazado', 
        className: 'bg-red-500 text-white' 
      }
    }
    
    const config = variants[status as keyof typeof variants] || variants.PENDING
    return (
      <Badge 
        variant={config.variant} 
        className={config.className}
      >
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No enviado'
    return new Date(dateString).toLocaleString('es-CO')
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏦 Panel de Pagos QR</h1>
          <p className="text-gray-600">Hola Juan David! Administra los pagos pendientes de verificación</p>
          <p className="text-sm text-gray-500">Actualización automática cada 30 segundos</p>
        </div>
        <Button onClick={fetchPayments} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-semibold">Error: {error}</p>
          </div>
          <Button 
            onClick={() => setError('')} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Cerrar
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">🔍 Por Verificar</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalPending}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">✅ Aprobados</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalApproved}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">💰 Valor Pendiente</p>
              <p className="text-2xl font-bold text-blue-600">
                ${stats.totalAmount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center p-6">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">❌ Rechazados</p>
              <p className="text-2xl font-bold text-red-600">{stats.totalRejected}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Pagos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay pagos para verificar</h3>
              <p className="text-sm">Los pagos aparecerán aquí cuando los usuarios suban comprobantes</p>
              <p className="text-xs text-gray-400 mt-2">
                Los usuarios pueden crear pagos QR desde: /pricing
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                    payment.status === 'VERIFICATION_PENDING' 
                      ? 'border-orange-200 bg-orange-50 hover:bg-orange-100' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="font-semibold">{payment.reference}</p>
                      <p className="text-sm text-gray-600">
                        {payment.user.firstName} {payment.user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{payment.user.email}</p>
                    </div>
                    
                    <div>
                      <p className="font-semibold">{payment.plan.displayName}</p>
                      <p className="text-sm text-gray-600 capitalize">{payment.billingCycle.toLowerCase()}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-green-600">
                        ${payment.amount.toLocaleString()} COP
                      </p>
                      {payment.transferReference && (
                        <p className="text-xs text-gray-500">Ref: {payment.transferReference}</p>
                      )}
                    </div>

                    <div>
                      {getStatusBadge(payment.status)}
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>{formatDate(payment.submittedAt)}</p>
                      {payment.approvedAt && (
                        <p className="text-xs text-green-600">
                          Aprobado: {formatDate(payment.approvedAt)}
                        </p>
                      )}
                      {payment.rejectedAt && (
                        <p className="text-xs text-red-600">
                          Rechazado: {formatDate(payment.rejectedAt)}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={() => setSelectedPayment(payment)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      
                      {payment.status === 'VERIFICATION_PENDING' && (
                        <>
                          <Button
                            onClick={() => processPayment(payment.id, true)}
                            disabled={processing === payment.id}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {processing === payment.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            )}
                            Aprobar
                          </Button>
                          <Button
                            onClick={() => processPayment(payment.id, false, 'Comprobante no válido')}
                            disabled={processing === payment.id}
                            variant="destructive"
                            size="sm"
                          >
                            {processing === payment.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-1" />
                            )}
                            Rechazar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Detail Modal */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>🔍 Detalle del Pago</DialogTitle>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Referencia</p>
                  <p className="font-semibold font-mono">{selectedPayment.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Usuario</p>
                  <p className="font-semibold">
                    {selectedPayment.user.firstName} {selectedPayment.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{selectedPayment.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <p className="font-semibold">{selectedPayment.plan.displayName}</p>
                  <p className="text-sm text-gray-500 capitalize">{selectedPayment.billingCycle.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monto</p>
                  <p className="font-semibold text-lg text-green-600">
                    ${selectedPayment.amount.toLocaleString()} COP
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  {getStatusBadge(selectedPayment.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Enviado</p>
                  <p className="text-sm">{formatDate(selectedPayment.submittedAt)}</p>
                </div>
                {selectedPayment.transferReference && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Referencia del Usuario</p>
                    <p className="font-semibold font-mono">{selectedPayment.transferReference}</p>
                  </div>
                )}
              </div>

              {selectedPayment.proofUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Comprobante de Pago</p>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2">URL del comprobante:</p>
                    <p className="text-xs font-mono bg-white p-2 rounded border break-all">
                      {selectedPayment.proofUrl}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 En producción, aquí se mostraría la imagen del comprobante
                    </p>
                  </div>
                </div>
              )}

              {selectedPayment.status === 'VERIFICATION_PENDING' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚡ Acción Requerida</h4>
                  <p className="text-sm text-yellow-700 mb-4">
                    Este pago está esperando tu verificación. Revisa el comprobante y decide si aprobarlo o rechazarlo.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => processPayment(selectedPayment.id, true)}
                      disabled={processing === selectedPayment.id}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {processing === selectedPayment.id ? 'Procesando...' : '✅ Aprobar Pago'}
                    </Button>
                    <Button
                      onClick={() => processPayment(selectedPayment.id, false, 'Comprobante no válido')}
                      disabled={processing === selectedPayment.id}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {processing === selectedPayment.id ? 'Procesando...' : '❌ Rechazar Pago'}
                    </Button>
                  </div>
                </div>
              )}

              {selectedPayment.status === 'APPROVED' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Pago Aprobado</h4>
                  <p className="text-sm text-green-700">
                    Este pago fue aprobado el {formatDate(selectedPayment.approvedAt)}. 
                    El usuario ya tiene acceso a su suscripción.
                  </p>
                </div>
              )}

              {selectedPayment.status === 'REJECTED' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Pago Rechazado</h4>
                  <p className="text-sm text-red-700">
                    Este pago fue rechazado el {formatDate(selectedPayment.rejectedAt)}. 
                    El usuario fue notificado y puede intentar nuevamente.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
