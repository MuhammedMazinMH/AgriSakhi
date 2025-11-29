"use client";

import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full w-fit">
            <WifiOff className="h-12 w-12 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-2xl">You&apos;re Offline</CardTitle>
          <CardDescription>
            No internet connection detected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            AgriSakhi works best with an internet connection. Some features may be limited while offline.
          </p>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Available Offline:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                View previous detection history
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Browse cached disease information
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Access saved treatment guides
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-4">
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </Link>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> Install AgriSakhi as an app for better offline access and faster loading!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
