import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar />
      <Header />
      <main className="ml-64 mt-16 flex-1 p-6">
        <Outlet />
      </main>
      <footer className="ml-64 border-t border-border bg-background p-4 mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>© 2026 FleetPro Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-foreground transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-foreground transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-foreground transition-colors cursor-pointer">
              Support
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
