import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-6 p-8">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
        <p className="text-gray-600 max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="space-x-4">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/">
              Go home
            </Link>
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
} 