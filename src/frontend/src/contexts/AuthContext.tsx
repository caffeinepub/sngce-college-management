import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserRole = "student" | "staff" | null;

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole;
  studentId: string | null;
  userName: string | null;
}

interface AuthContextType extends AuthState {
  login: (
    role: NonNullable<UserRole>,
    name: string,
    studentId?: string,
  ) => void;
  logout: () => void;
}

const AUTH_KEY = "sngce_auth";

const defaultState: AuthState = {
  isLoggedIn: false,
  role: null,
  studentId: null,
  userName: null,
};

const AuthContext = createContext<AuthContextType>({
  ...defaultState,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth]);

  const login = useCallback(
    (role: NonNullable<UserRole>, name: string, studentId?: string) => {
      setAuth({
        isLoggedIn: true,
        role,
        studentId: studentId ?? null,
        userName: name,
      });
    },
    [],
  );

  const logout = useCallback(() => {
    setAuth(defaultState);
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
