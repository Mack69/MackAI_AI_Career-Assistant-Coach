import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background">
      <div className="space-y-6 max-w-md">
        {/* Animated 404 */}
        <div className="relative">
          <h1 className="text-2xl md:text-19xl font-bold gradient-title animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 blur-3xl -z-10" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold">
          Page Not Found
        </h2>
        
        <p className="text-muted-foreground">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild variant="default">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href="javascript:history.back()" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}