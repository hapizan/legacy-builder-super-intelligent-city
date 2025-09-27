// Mock server client - no external dependencies
interface User {
  id: string;
  email?: string;
  user_metadata?: any;
}

// Mock server client that simulates authentication without external services
class MockServerAuthClient {
  async getUser(): Promise<{ data: { user: User | null } }> {
    // In a real app, you'd check server-side session/cookies here
    return { data: { user: null } };
  }
}

class MockServerSupabaseClient {
  auth = new MockServerAuthClient();
  
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

/**
 * Mock server client that doesn't require any external dependencies
 */
export async function createClient() {
  return new MockServerSupabaseClient();
}
