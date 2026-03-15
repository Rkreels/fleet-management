'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { toast } from '@/hooks/use-toast'

interface LayoutProps {
  children: ReactNode
}

// Main layout component with sidebar, header, and footer
export function Layout({ children }: LayoutProps) {
  const router = useRouter()

  const handleLinkClick = (pageName: string) => {
    toast({ title: 'Coming Soon', description: `${pageName} page will be available soon` })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar />
      <Header />
      <main className="ml-64 mt-16 flex-1 p-6">
        {children}
      </main>
      <footer className="ml-64 border-t border-border bg-background p-4 mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>© 2026 FleetPro Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              onClick={() => handleLinkClick('Privacy Policy')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
            <a
              onClick={() => handleLinkClick('Terms of Service')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Terms of Service
            </a>
            <a
              onClick={() => handleLinkClick('Support')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
