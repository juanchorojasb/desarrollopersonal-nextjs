import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { payuService } from '@/lib/payu'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referenceCode, transactionId } = body

    if (!referenceCode && !transactionId) {
      return NextResponse.json(
        { success: false, error: 'Reference Code o Transaction ID requerido' },
        { status: 400 }
      )
    }

    // Buscar transacción en nuestra base de datos
    let transaction
    if (transactionId) {
      transaction = await prisma.paymentTransaction.findUnique({
        where: { id: transactionId },
        include: {
          subscription: {
            include: { plan: true }
          },
          user: true
        }
      })
    } else if (referenceCode) {
      transaction = await prisma.paymentTransaction.findUnique({
        where: { referenceCode },
        include: {
          subscription: {
            include: { plan: true }
          },
          user: true
        }
      })
    }

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transacción no encontrada' },
        { status: 404 }
      )
    }

    // Si ya está confirmada, retornar el estado actual
    if (transaction.status === 'APPROVED' || transaction.status === 'DECLINED') {
      return NextResponse.json({
        success: true,
        transaction: {
          id: transaction.id,
          status: transaction.status,
          referenceCode: transaction.referenceCode,
          amount: transaction.amount,
          currency: transaction.currency,
          paymentMethod: transaction.paymentMethod,
          processedAt: transaction.processedAt,
          confirmedAt: transaction.confirmedAt
        },
        subscription: transaction.subscription ? {
          id: transaction.subscription.id,
          status: transaction.subscription.status,
          currentPeriodEnd: transaction.subscription.currentPeriodEnd
        } : null,
        alreadyProcessed: true
      })
    }

    try {
      // Consultar estado del pago en PayU
      const paymentInfo = await payuService.getPaymentInfo(transaction.referenceCode)
      
      if (paymentInfo && paymentInfo.result && paymentInfo.result.payload) {
        const payload = paymentInfo.result.payload[0]
        const order = payload.orders?.[0]
        const payuTransaction = order?.transactions?.[0]

        if (payuTransaction) {
          let newStatus = 'PENDING'
          let isApproved = false

          // Mapear estados de PayU a nuestros estados
          switch (payuTransaction.transactionResponse?.state) {
            case 'APPROVED':
              newStatus = 'APPROVED'
              isApproved = true
              break
            case 'DECLINED':
              newStatus = 'DECLINED'
              break
            case 'ERROR':
              newStatus = 'ERROR'
              break
            case 'PENDING':
            default:
              newStatus = 'PENDING'
              break
          }

          // Actualizar transacción
          const updatedTransaction = await prisma.paymentTransaction.update({
            where: { id: transaction.id },
            data: {
              status: newStatus,
              payuTransactionId: payuTransaction.id,
              paymentMethod: payuTransaction.paymentMethod?.description,
              responseCode: payuTransaction.transactionResponse?.responseCode,
              responseMessage: payuTransaction.transactionResponse?.responseMessage,
              processedAt: new Date(),
              confirmedAt: isApproved ? new Date() : null
            }
          })

          // Si el pago fue aprobado, activar la suscripción
          if (isApproved && transaction.subscription) {
            const activatedSubscription = await prisma.subscription.update({
              where: { id: transaction.subscription.id },
              data: {
                status: 'ACTIVE',
                isActive: true,
                currentPeriodStart: new Date(),
                currentPeriodEnd: transaction.extra3 === 'quarterly' 
                  ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                  : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              }
            })

            console.log('✅ Suscripción activada:', activatedSubscription.id)

            // TODO: Enviar email de confirmación
            // TODO: Crear entrada en historial de pagos
          }

          return NextResponse.json({
            success: true,
            transaction: {
              id: updatedTransaction.id,
              status: updatedTransaction.status,
              referenceCode: updatedTransaction.referenceCode,
              amount: updatedTransaction.amount,
              currency: updatedTransaction.currency,
              paymentMethod: updatedTransaction.paymentMethod,
              processedAt: updatedTransaction.processedAt,
              confirmedAt: updatedTransaction.confirmedAt
            },
            subscription: isApproved && transaction.subscription ? {
              id: transaction.subscription.id,
              status: 'ACTIVE',
              currentPeriodEnd: transaction.extra3 === 'quarterly' 
                ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            } : null,
            paymentApproved: isApproved
          })
        }
      }

      // Si no se pudo obtener información de PayU, mantener como pendiente
      return NextResponse.json({
        success: true,
        transaction: {
          id: transaction.id,
          status: 'PENDING',
          referenceCode: transaction.referenceCode,
          amount: transaction.amount,
          currency: transaction.currency
        },
        message: 'Pago aún en proceso de verificación'
      })

    } catch (payuError) {
      console.error('Error consultando PayU:', payuError)
      
      return NextResponse.json({
        success: false,
        error: 'Error verificando el estado del pago',
        transaction: {
          id: transaction.id,
          status: transaction.status,
          referenceCode: transaction.referenceCode
        }
      }, { status: 503 })
    }

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// GET endpoint for simple payment status check
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const referenceCode = searchParams.get('referenceCode')
    const transactionId = searchParams.get('transactionId')

    if (!referenceCode && !transactionId) {
      return NextResponse.json(
        { success: false, error: 'Reference Code o Transaction ID requerido' },
        { status: 400 }
      )
    }

    let transaction
    if (transactionId) {
      transaction = await prisma.paymentTransaction.findUnique({
        where: { id: transactionId },
        include: {
          subscription: true
        }
      })
    } else if (referenceCode) {
      transaction = await prisma.paymentTransaction.findUnique({
        where: { referenceCode },
        include: {
          subscription: true
        }
      })
    }

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transacción no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      status: transaction.status,
      referenceCode: transaction.referenceCode,
      amount: transaction.amount,
      currency: transaction.currency,
      paymentMethod: transaction.paymentMethod,
      subscription: transaction.subscription ? {
        id: transaction.subscription.id,
        status: transaction.subscription.status,
        isActive: transaction.subscription.isActive
      } : null,
      createdAt: transaction.createdAt,
      processedAt: transaction.processedAt,
      confirmedAt: transaction.confirmedAt
    })

  } catch (error) {
    console.error('Error checking payment status:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}