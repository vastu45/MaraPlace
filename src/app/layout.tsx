import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MaraPlace - Migration Agent Marketplace',
  description: 'Find and book trusted migration agents in Australia. Connect with MARA registered agents for visa applications, appeals, and immigration services.',
  keywords: 'migration agent, visa, immigration, Australia, MARA, booking, consultation',
  authors: [{ name: 'MaraPlace Team' }],
  openGraph: {
    title: 'MaraPlace - Migration Agent Marketplace',
    description: 'Find and book trusted migration agents in Australia',
    type: 'website',
    locale: 'en_AU',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 