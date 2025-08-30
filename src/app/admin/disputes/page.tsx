"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

export default function AdminDisputes() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || (session.user as any)?.role !== "ADMIN") {
      router.push("/login");
      return;
    }
    
    setLoading(false);
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dispute Resolution</h1>
          <p className="text-gray-600">Handle payment disputes, refund requests, and customer complaints</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Payment Dispute - Booking #12345</h3>
                  <p className="text-sm text-gray-600">Client: John Smith | Agent: Jane Doe</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$450.00</p>
                  <p className="text-sm text-orange-600">Open</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Refund Request - Booking #12346</h3>
                  <p className="text-sm text-gray-600">Client: Sarah Johnson | Agent: Mike Wilson</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$320.00</p>
                  <p className="text-sm text-yellow-600">Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
