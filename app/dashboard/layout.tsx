import DashboardNav from '@/components/layout/DashboardNav'
import { ProtectedRoute } from '@/components/auth/protected-route'
import AssistantBubble from '@/components/AssistantBubble'

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

        {/* Floating AI assistant bubble (available on all dashboard pages) */}
        <AssistantBubble />
      </div>
    </ProtectedRoute>
  )
}
