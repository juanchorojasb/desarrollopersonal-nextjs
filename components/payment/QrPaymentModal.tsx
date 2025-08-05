'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Check, Clock, AlertCircle, Copy, CheckCircle } from 'lucide-react'

interface QrPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planData: {
    id: string
    name: string
    price: number
    billingCycle: 'monthly' | 'quarterly'
  }
}

export default function QrPaymentModal({ isOpen, onClose, planData }: QrPaymentModalProps) {
  const [step, setStep] = useState<'qr' | 'upload' | 'success'>('qr')
  const [paymentData, setPaymentData] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [transferRef, setTransferRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string>('')

  const createPayment = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/qr-payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planData.id,
          billingCycle: planData.billingCycle
        })
      })

      const data = await response.json()
      if (data.success) {
        setPaymentData(data)
      } else {
        setError(data.error || 'Error creando el pago')
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      setError('Error de conexión. Intenta nuevamente.')
    }
    setLoading(false)
  }

  const uploadProof = async () => {
    if (!selectedFile || !paymentData) return

    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('paymentId', paymentData.payment.id)
      formData.append('proof', selectedFile)
      formData.append('transferReference', transferRef)

      const response = await fetch('/api/qr-payments/verify', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        setStep('success')
      } else {
        setError(data.error || 'Error subiendo el comprobante')
      }
    } catch (error) {
      console.error('Error uploading proof:', error)
      setError('Error de conexión. Intenta nuevamente.')
    }
    setLoading(false)
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const resetModal = () => {
    setStep('qr')
    setPaymentData(null)
    setSelectedFile(null)
    setTransferRef('')
    setError('')
    setLoading(false)
    setCopied('')
  }

  if (!isOpen) return null

  // Crear pago automáticamente cuando se abre el modal
  if (!paymentData && !loading && step === 'qr' && isOpen) {
    createPayment()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetModal()
      }
      onClose()
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            💳 Pago con QR - {planData.name}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-semibold">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
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

        {loading && !paymentData && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Generando código QR...</p>
          </div>
        )}

        {step === 'qr' && paymentData && (
          <div className="space-y-6">
            {/* Resumen del pago */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Resumen del Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Plan</p>
                    <p className="font-semibold">{paymentData.payment.planName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monto</p>
                    <p className="font-semibold text-2xl text-green-600">
                      ${paymentData.payment.amount.toLocaleString()} COP
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Referencia</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">{paymentData.payment.reference}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(paymentData.payment.reference, 'reference')}
                      >
                        {copied === 'reference' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expira</p>
                    <p className="text-sm">{new Date(paymentData.payment.expiresAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Codes */}
            <Tabs defaultValue="bancolombia" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bancolombia">🟡 Bancolombia</TabsTrigger>
                <TabsTrigger value="davivienda">🔴 Davivienda</TabsTrigger>
              </TabsList>

              <TabsContent value="bancolombia">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-yellow-600">💛 Bancolombia</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="text-center">
                      <div className="w-48 h-48 bg-yellow-50 border-2 border-yellow-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📱</div>
                          <p className="text-gray-600 text-sm">
                            QR Code<br/>Bancolombia<br/>
                            <span className="text-xs text-yellow-600">(Próximamente)</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Escanea con tu app Bancolombia
                      </p>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-semibold text-yellow-700">📋 Datos de la cuenta:</p>
                        <div className="bg-yellow-50 p-3 rounded border space-y-1">
                          <p><strong>Titular:</strong> {paymentData.bankData.bancolombia.ownerName}</p>
                          <p><strong>Cuenta {paymentData.bankData.bancolombia.accountType}:</strong> {paymentData.bankData.bancolombia.accountNumber}</p>
                          <p className="text-lg font-bold text-green-600">
                            <strong>Valor exacto:</strong> ${paymentData.payment.amount.toLocaleString()} COP
                          </p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(paymentData.bankData.bancolombia.accountNumber, 'bancolombia-account')}
                          >
                            {copied === 'bancolombia-account' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            {copied === 'bancolombia-account' ? ' Copiado' : ' Copiar Cuenta'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(paymentData.payment.amount.toString(), 'bancolombia-amount')}
                          >
                            {copied === 'bancolombia-amount' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            {copied === 'bancolombia-amount' ? ' Copiado' : ' Copiar Valor'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="davivienda">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">❤️ Davivienda</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="text-center">
                      <div className="w-48 h-48 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📱</div>
                          <p className="text-gray-600 text-sm">
                            QR Code<br/>Davivienda<br/>
                            <span className="text-xs text-red-600">(Próximamente)</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Escanea con tu app Daviplata
                      </p>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-semibold text-red-700">📋 Datos de la cuenta:</p>
                        <div className="bg-red-50 p-3 rounded border space-y-1">
                          <p><strong>Titular:</strong> {paymentData.bankData.davivienda.ownerName}</p>
                          <p><strong>Cuenta {paymentData.bankData.davivienda.accountType}:</strong> {paymentData.bankData.davivienda.accountNumber}</p>
                          <p className="text-lg font-bold text-green-600">
                            <strong>Valor exacto:</strong> ${paymentData.payment.amount.toLocaleString()} COP
                          </p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(paymentData.bankData.davivienda.accountNumber, 'davivienda-account')}
                          >
                            {copied === 'davivienda-account' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            {copied === 'davivienda-account' ? ' Copiado' : ' Copiar Cuenta'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(paymentData.payment.amount.toString(), 'davivienda-amount')}
                          >
                            {copied === 'davivienda-amount' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            {copied === 'davivienda-amount' ? ' Copiado' : ' Copiar Valor'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Instrucciones */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">📋 Instrucciones de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  <li><strong>1.</strong> {paymentData.instructions.step1}</li>
                  <li><strong>2.</strong> {paymentData.instructions.step2}</li>
                  <li><strong>3.</strong> {paymentData.instructions.step3}</li>
                  <li><strong>4.</strong> {paymentData.instructions.step4}</li>
                  <li><strong>5.</strong> {paymentData.instructions.step5}</li>
                  <li><strong>6.</strong> {paymentData.instructions.step6}</li>
                </ol>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button onClick={() => setStep('upload')} className="flex-1">
                Ya Pagué - Subir Comprobante ✅
              </Button>
            </div>
          </div>
        )}

        {step === 'upload' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Subir Comprobante de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="proof">Comprobante de pago (imagen)*</Label>
                  <Input
                    id="proof"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    📸 Sube una foto clara del comprobante de transferencia
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-1">
                      ✅ Archivo seleccionado: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="transferRef">Número de referencia (opcional)</Label>
                  <Input
                    id="transferRef"
                    value={transferRef}
                    onChange={(e) => setTransferRef(e.target.value)}
                    placeholder="Ej: 123456789"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    🔢 Número de referencia o comprobante de tu banco
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="font-semibold text-yellow-800">⏰ Importante</p>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Verificaremos tu pago en <strong>máximo 1 hora</strong> y activaremos tu acceso automáticamente.
                    Te enviaremos un email cuando esté listo.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={() => setStep('qr')} variant="outline" className="flex-1">
                ← Volver
              </Button>
              <Button
                onClick={uploadProof}
                disabled={!selectedFile || loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar Comprobante
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6 py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-800">
                ¡Comprobante Recibido! ✅
              </h3>
              <p className="text-gray-600 mt-2">
                Verificaremos tu pago en <strong>máximo 1 hora</strong> y activaremos tu acceso automáticamente.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                📧 Te enviaremos un email de confirmación cuando esté listo.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Referencia de tu pago:</strong><br/>
                  <span className="font-mono">{paymentData?.payment?.reference}</span>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Guarda esta referencia para futuras consultas
                </p>
              </div>
            </div>
            <Button onClick={onClose} className="w-full">
              Entendido - Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
