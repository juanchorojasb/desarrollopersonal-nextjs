import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json(
        { error: 'Código promocional requerido' },
        { status: 400 }
      )
    }

    const isValid = code.toLowerCase() === 'prueba'
    
    if (isValid) {
      return NextResponse.json({
        valid: true,
        benefit: 'free_month',
        message: '¡Código válido! Obtienes 1 mes gratis'
      })
    } else {
      return NextResponse.json({
        valid: false,
        message: 'Código promocional inválido'
      })
    }
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}