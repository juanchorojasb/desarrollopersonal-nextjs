'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function VerifyEmailPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && user) {
      // If user is already signed in, redirect to dashboard
      router.push('/dashboard')
    } else if (isLoaded && !user) {
      // If no user, redirect to sign-in
      router.push('/sign-in')
    }
  }, [isLoaded, user, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificando tu email...</h2>
        <p className="text-gray-600">Te redirigiremos en un momento.</p>
      </div>
    </div>
  )
}