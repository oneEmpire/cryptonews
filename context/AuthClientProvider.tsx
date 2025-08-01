// src/providers/AuthClientProvider.tsx
'use client'; // This directive is crucial for this component

import { useEffect, useRef } from 'react'; // useRef to prevent double initialization
import { AuthStore } from '@/lib/AuthStore'; // Adjust this path if your AuthStore is located elsewhere
import Loading from '@/app/loading';

interface AuthClientProviderProps {
  children: React.ReactNode;
}

export function AuthClientProvider({ children }: AuthClientProviderProps) {
  // Select the initialize action and the loading state from your AuthStore
  const initializeAuth = AuthStore((state) => state.initialize);
  const pageisLoading = AuthStore((state) => state.pageisLoading);

  // A ref to ensure initializeAuth is called only once per client-side load.
  // This helps prevent potential issues if StrictMode is enabled, which
  // can cause useEffect to run twice in development.
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      console.log("AuthClientProvider: Initializing AuthStore...");
      initializeAuth();
      initialized.current = true; // Mark as initialized
    }

    // Optional: If you had a specific cleanup function exposed by AuthStore
    // for the onAuthStateChange listener (e.g., `AuthStore.getState().cleanupListener`),
    // you would call it here.
    // However, your current `AuthStore`'s `setupAuthListener` assigns `unsubscribe`
    // to a variable outside the return of `create`, making it global to the store
    // instance. For a simple app, this might be fine as the listener persists
    // for the app's lifecycle. If you need strict unsubscription on provider unmount,
    // you'd need to modify AuthStore to return the unsubscribe function.
    // For now, the existing setup is usually acceptable.

  }, [initializeAuth]); // Dependency array: initializeAuth is stable (Zustand action)

  // Render a loading state while authentication is being initialized
  if (pageisLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <Loading/>
      </div>
    );
  }

  // Once authentication is loaded, render the rest of the application
  return <>{children}</>;
}