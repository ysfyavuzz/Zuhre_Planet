/**
 * useAuth Hook Tests
 * 
 * Unit tests for the useAuth authentication hook.
 * Tests authentication state, login/logout, and context provider.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import React from 'react';

// Wrapper component for testing hooks with context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth Hook', () => {
  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should provide login function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.login).toBeDefined();
    expect(typeof result.current.login).toBe('function');
  });

  it('should provide logout function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.logout).toBeDefined();
    expect(typeof result.current.logout).toBe('function');
  });

  it('should update user state after login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'client' as const,
    };
    
    await act(async () => {
      await result.current.login(mockUser);
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should clear user state after logout', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // First login
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'client' as const,
    };
    
    await act(async () => {
      await result.current.login(mockUser);
    });
    
    expect(result.current.user).toEqual(mockUser);
    
    // Then logout
    await act(async () => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle multiple login calls', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const user1 = {
      id: 1,
      email: 'user1@example.com',
      role: 'client' as const,
    };
    
    const user2 = {
      id: 2,
      email: 'user2@example.com',
      role: 'escort' as const,
    };
    
    await act(async () => {
      await result.current.login(user1);
    });
    expect(result.current.user).toEqual(user1);
    
    await act(async () => {
      await result.current.login(user2);
    });
    expect(result.current.user).toEqual(user2);
  });

  it('should preserve user role', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const escortUser = {
      id: 1,
      email: 'escort@example.com',
      role: 'escort' as const,
    };
    
    await act(async () => {
      await result.current.login(escortUser);
    });
    
    expect(result.current.user?.role).toBe('escort');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};
    
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow();
    
    console.error = originalError;
  });
});

describe('AuthProvider', () => {
  it('should render children', () => {
    const TestComponent = () => {
      const { isAuthenticated } = useAuth();
      return <div>Auth: {isAuthenticated ? 'Yes' : 'No'}</div>;
    };
    
    const { container } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(container.textContent).toContain('Auth: No');
  });

  it('should provide context to nested components', () => {
    const NestedComponent = () => {
      const { user } = useAuth();
      return <div>User: {user?.email || 'None'}</div>;
    };
    
    const { container } = render(
      <AuthProvider>
        <div>
          <NestedComponent />
        </div>
      </AuthProvider>
    );
    
    expect(container.textContent).toContain('User: None');
  });
});

// Helper function for rendering with AuthProvider
function render(component: React.ReactElement) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );
  
  const utils = renderHook(() => ({}), {
    wrapper: Wrapper,
    initialProps: {},
  });
  
  return {
    container: document.createElement('div'),
  };
}
