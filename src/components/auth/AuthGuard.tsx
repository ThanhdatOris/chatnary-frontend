"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard - Protects routes that require authentication
 *
 * Usage:
 * <AuthGuard>
 *   <ProtectedContent />
 * </AuthGuard>
 */
export function AuthGuard({
  children,
  fallback,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return fallback || <AuthLoadingFallback />;
  }

  // Not authenticated - redirect is happening
  if (!isAuthenticated) {
    return fallback || <AuthLoadingFallback />;
  }

  // Authenticated - render children
  return <>{children}</>;
}

/**
 * Default loading fallback
 */
function AuthLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400">
          Đang kiểm tra xác thực...
        </p>
      </div>
    </div>
  );
}

/**
 * GuestGuard - Protects routes that should only be accessible to guests (not logged in)
 *
 * Usage:
 * <GuestGuard>
 *   <LoginPage />
 * </GuestGuard>
 */
export function GuestGuard({
  children,
  redirectTo = "/dashboard",
}: Omit<AuthGuardProps, "fallback">) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return <AuthLoadingFallback />;
  }

  // Authenticated - redirect is happening
  if (isAuthenticated) {
    return <AuthLoadingFallback />;
  }

  // Not authenticated - render children
  return <>{children}</>;
}

export default AuthGuard;
