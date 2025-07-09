import { useState } from "react";

export function useToast() {
  // Minimal placeholder: no real toast logic
  const [toasts] = useState<any[]>([]);
  return {
    toasts,
    // Add more toast logic here as needed
  };
} 