import CryptoJS from 'crypto-js'

export interface PayUConfig {
  apiKey: string
  merchantId: string
  accountId: string
  apiUrl: string
  webCheckoutUrl: string
}

export interface PaymentData {
  planId: string
  planName: string
  amount: number
  currency: string
  billingCycle: 'monthly' | 'quarterly'
  userEmail: string
  userId: string
  userName: string
  description: string
}

export interface PayUResponse {
  success: boolean
  checkoutUrl?: string
  referenceCode?: string
  error?: string
}

class PayUService {
  private config: PayUConfig

  constructor() {
    this.config = {
      apiKey: process.env.PAYU_API_KEY || '',
      merchantId: process.env.PAYU_MERCHANT_ID || '',
      accountId: process.env.PAYU_ACCOUNT_ID || '',
      apiUrl: process.env.PAYU_API_URL || 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi',
      webCheckoutUrl: process.env.PAYU_WEB_CHECKOUT_URL || 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/'
    }
  }

  /**
   * Generar firma digital para PayU
   */
  generateSignature(referenceCode: string, amount: number, currency: string): string {
    const { apiKey, merchantId } = this.config
    const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}`
    return CryptoJS.MD5(signatureString).toString()
  }

  /**
   * Generar código de referencia único
   */
  generateReferenceCode(userId: string, planId: string): string {
    const timestamp = Date.now()
    return `DP_${userId}_${planId}_${timestamp}`
  }

  /**
   * Crear URL de checkout para Web Checkout (más fácil)
   */
  createCheckoutUrl(paymentData: PaymentData): PayUResponse {
    try {
      const referenceCode = this.generateReferenceCode(paymentData.userId, paymentData.planId)
      const signature = this.generateSignature(referenceCode, paymentData.amount, paymentData.currency)

      // En modo desarrollo/testing, usar mock PayU
      if (process.env.NODE_ENV === 'development' || process.env.PAYU_USE_MOCK === 'true') {
        const mockParams = new URLSearchParams({
          merchantId: this.config.merchantId,
          amount: paymentData.amount.toString(),
          description: paymentData.description,
          referenceCode: referenceCode,
          responseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/response`,
          test: '1'
        })

        const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/mock-payu?${mockParams.toString()}`

        return {
          success: true,
          checkoutUrl,
          referenceCode
        }
      }

      // Parámetros para Web Checkout real
      const params = new URLSearchParams({
        merchantId: this.config.merchantId,
        accountId: this.config.accountId,
        description: paymentData.description,
        referenceCode: referenceCode,
        amount: paymentData.amount.toString(),
        tax: '0',
        taxReturnBase: '0',
        currency: paymentData.currency,
        signature: signature,
test: process.env.NODE_ENV !== 'production' ? '1' : '0',
        buyerEmail: paymentData.userEmail,
        buyerFullName: paymentData.userName,
        responseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/response`,
        confirmationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payu/webhook`,
        extra1: paymentData.userId, // Para identificar al usuario
        extra2: paymentData.planId, // Para identificar el plan
        extra3: paymentData.billingCycle, // Para identificar el ciclo de facturación
        lng: 'es' // Idioma español
      })

      const checkoutUrl = `${this.config.webCheckoutUrl}?${params.toString()}`

      return {
        success: true,
        checkoutUrl,
        referenceCode
      }

    } catch (error) {
      console.error('Error creating PayU checkout URL:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Verificar firma de respuesta de PayU
   */
  verifyResponseSignature(
    referenceCode: string,
    amount: number,
    currency: string,
    transactionState: string,
    receivedSignature: string
  ): boolean {
    const { apiKey, merchantId } = this.config
    const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}~${transactionState}`
    const expectedSignature = CryptoJS.MD5(signatureString).toString()
    
    return expectedSignature === receivedSignature
  }

  /**
   * Procesar respuesta de webhook
   */
  processWebhookResponse(webhookData: any) {
    const {
      reference_sale,
      value,
      currency,
      state_pol,
      signature,
      extra1: userId,
      extra2: planId,
      extra3: billingCycle,
      transaction_id,
      payment_method_name
    } = webhookData

    // Verificar firma
    const isValidSignature = this.verifyResponseSignature(
      reference_sale,
      parseFloat(value),
      currency,
      state_pol,
      signature
    )

    if (!isValidSignature) {
      throw new Error('Firma inválida')
    }

    // Estados de PayU
    // 4 = Approved, 6 = Declined, 104 = Error
    const transactionStates = {
      '4': 'approved',
      '6': 'declined',
      '7': 'pending',
      '104': 'error'
    } as const

    return {
      referenceCode: reference_sale,
      amount: parseFloat(value),
      currency,
      status: transactionStates[state_pol as keyof typeof transactionStates] || 'unknown',
      userId,
      planId,
      billingCycle,
      transactionId: transaction_id,
      paymentMethod: payment_method_name,
      isValid: isValidSignature
    }
  }

  /**
   * Obtener información de un pago por referencia
   */
  async getPaymentInfo(referenceCode: string) {
    try {
      const requestBody = {
        language: 'es',
        command: 'ORDER_DETAIL_BY_REFERENCE_CODE',
        merchant: {
          apiKey: this.config.apiKey,
          apiLogin: this.config.merchantId
        },
        details: {
          referenceCode: referenceCode
        },
        test: process.env.NODE_ENV === 'development'
      }

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      return data

    } catch (error) {
      console.error('Error getting payment info:', error)
      throw error
    }
  }
}

// Singleton para usar en toda la aplicación
export const payuService = new PayUService()

// Tipos para TypeScript
export type PaymentStatus = 'approved' | 'declined' | 'pending' | 'error' | 'unknown'

export interface WebhookResponse {
  referenceCode: string
  amount: number
  currency: string
  status: PaymentStatus
  userId: string
  planId: string
  billingCycle: string
  transactionId: string
  paymentMethod: string
  isValid: boolean
}
