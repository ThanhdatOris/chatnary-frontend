"use client";

import {
    login as authLogin,
    logout as authLogout,
    register as authRegister,
    LoginRequest,
    RegisterRequest,
    silentRefresh,
    startSilentRefresh,
    stopSilentRefresh,
    User
} from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    credentials: LoginRequest
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    credentials: RegisterRequest
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // ========================================
  // 🔓 BYPASS LOGIN - TẠM THỜI FAKE USER
  // ========================================
  const [user, setUser] = useState<User | null>({
    id: "test-user-id",
    email: "test@example.com",
    name: "Test User",
    role: "USER"
  });
  const [isLoading, setIsLoading] = useState(false); // Set to false to skip loading
  const router = useRouter();

  // Initialize auth state on mount
  useEffect(() => {
    // ========================================
    // 🔓 BYPASS LOGIN - DISABLE AUTH CHECK
    // TODO: Uncomment code bên dưới để bật lại authentication
    // ========================================
    setIsLoading(false);
    
    // const initAuth = async () => {
    //   setIsLoading(true);

    //   // Check if we have stored user and try to get valid access token
    //   const storedUser = getStoredUser();

    //   if (storedUser && checkIsAuthenticated()) {
    //     // Try to get a valid access token (will refresh if needed)
    //     const accessToken = await getValidAccessToken();

    //     if (accessToken) {
    //       setUser(storedUser);
    //       startSilentRefresh();
    //     } else {
    //       // Token refresh failed, clear everything
    //       clearTokens();
    //       setUser(null);
    //     }
    //   } else {
    //     setUser(null);
    //   }

    //   setIsLoading(false);
    // };

    // initAuth();

    // Cleanup on unmount
    return () => {
      stopSilentRefresh();
    };
  }, []);

  const login = useCallback(
    async (
      credentials: LoginRequest
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      const result = await authLogin(credentials);

      if (result.success && result.data) {
        setUser(result.data.user);
        startSilentRefresh();
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: result.error };
    },
    []
  );

  const register = useCallback(
    async (
      credentials: RegisterRequest
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      const result = await authRegister(credentials);

      setIsLoading(false);

      if (result.success) {
        return { success: true };
      }

      return { success: false, error: result.error };
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    stopSilentRefresh();

    await authLogout();

    setUser(null);
    setIsLoading(false);

    router.push("/login");
  }, [router]);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    const result = await silentRefresh();

    if (!result.success) {
      setUser(null);
      return false;
    }

    return true;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth(redirectTo: string = "/login") {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}
