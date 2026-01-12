import DashboardNav from '@/components/layout/DashboardNav'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar Navigation */}
        <DashboardNav />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
