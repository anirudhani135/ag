
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userRole: 'admin' | 'developer' | 'buyer' | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserRole: () => Promise<void>;
}

export type UserRole = 'admin' | 'developer' | 'buyer' | null;
