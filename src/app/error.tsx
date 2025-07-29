"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h1>
          <p className="text-gray-600">
            We're sorry, but something unexpected happened. This might be due to a temporary issue.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={reset}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Try again
          </Button>
          
          <Button
            onClick={() => window.location.href = "/"}
            variant="outline"
            className="w-full"
          >
            Go to homepage
          </Button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Error: {error.message}</p>
          {error.digest && <p>Error ID: {error.digest}</p>}
        </div>
      </div>
    </div>
  );
} 