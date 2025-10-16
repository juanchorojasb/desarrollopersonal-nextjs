import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido de vuelta
          </h1>
          <p className="text-gray-600">
            Inicia sesión para continuar tu crecimiento personal
          </p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
              card: 'shadow-lg border-0',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
            }
          }}
        />
      </div>
    </div>
  )
}
