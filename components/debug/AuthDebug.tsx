'use client'

import { useUser } from '@clerk/nextjs'

interface AuthDebugProps {
  enabled?: boolean
}

export default function AuthDebug({ enabled = false }: AuthDebugProps) {
  const { user, isSignedIn, isLoaded } = useUser()
  
  if (!enabled || process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>Is Loaded: {isLoaded ? '✅' : '❌'}</div>
        <div>Is Signed In: {isSignedIn ? '✅' : '❌'}</div>
        <div>User ID: {user?.id || 'No disponible'}</div>
        <div>Email: {user?.primaryEmailAddress?.emailAddress || 'No disponible'}</div>
        <div>Email Verified: {user?.primaryEmailAddress?.verification?.status || 'No verificado'}</div>
        <div>Current Path: {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</div>
      </div>
    </div>
  )
}