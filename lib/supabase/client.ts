// Mock authentication client - no external dependencies
interface User {
  id: string;
  email?: string;
  user_metadata?: any;
}

interface AuthResponse {
  error?: Error | null;
  user?: User | null;
}

interface Session {
  user: User;
  access_token: string;
}

// Mock client that simulates authentication without external services
class MockAuthClient {
  private currentUser: User | null = null;
  private listeners: ((event: string, session: Session | null) => void)[] = [];

  async signUp({ email, password, options }: any): Promise<AuthResponse> {
    // Simulate successful signup
    const user: User = {
      id: 'mock-user-' + Date.now(),
      email,
      user_metadata: options?.data || {}
    };
    this.currentUser = user;
    this.notifyListeners('SIGNED_IN', { user, access_token: 'mock-token' });
    return { user, error: null };
  }

  async signInWithPassword({ email, password }: any): Promise<AuthResponse> {
    // Simulate successful login
    const user: User = {
      id: 'mock-user-' + Date.now(),
      email,
      user_metadata: {}
    };
    this.currentUser = user;
    this.notifyListeners('SIGNED_IN', { user, access_token: 'mock-token' });
    return { user, error: null };
  }

  async signOut(): Promise<{ error?: Error | null }> {
    this.currentUser = null;
    this.notifyListeners('SIGNED_OUT', null);
    return { error: null };
  }

  async getSession(): Promise<{ data: { session: Session | null } }> {
    return {
      data: {
        session: this.currentUser ? {
          user: this.currentUser,
          access_token: 'mock-token'
        } : null
      }
    };
  }

  async getUser(): Promise<{ data: { user: User | null } }> {
    return { data: { user: this.currentUser } };
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    this.listeners.push(callback);
    return {
      data: { subscription: { unsubscribe: () => {
        const index = this.listeners.indexOf(callback);
        if (index > -1) this.listeners.splice(index, 1);
      }}}
    };
  }

  private notifyListeners(event: string, session: Session | null) {
    this.listeners.forEach(callback => callback(event, session));
  }
}

// Mock Supabase client
class MockSupabaseClient {
  auth = new MockAuthClient();
  
  // Mock database methods
  from(table: string) {
    return {
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null })
    };
  }
}

export function createClient() {
  return new MockSupabaseClient();
}
