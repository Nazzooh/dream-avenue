import { motion } from 'motion/react';
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminGuard } from "../hooks/useAdminGuard";
import { supabase } from '../../utils/supabase/client';
import { AdminPermission, can } from '../lib/adminPermissions';

/**
 * Extract role from session (utility for debugging)
 */
export function extractRoleFromSession(session: any) {
  if (!session) return null;
  const rootRole = session.user?.role ?? null;
  return { rootRole, finalIsAdmin: rootRole === 'admin' };
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  permission?: AdminPermission;
}

export function ProtectedRoute({ children, requireAdmin = false, permission }: ProtectedRouteProps) {
  const { loading, isAdmin, user, profile, profileError } = useAdminGuard();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Clean up any debug global variables
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        delete (window as any).isAdsAdmin;
      }
    } catch (e) {
      console.warn('Admin guard init error', e);
    }
  }, []);

  const handleLogoutAndLogin = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/admin/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading state while checking auth
  if (loading || isLoggingOut) {
    console.log('🛡️ ProtectedRoute: Loading auth state...');
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-cream)' }}>
        <div className="text-center">
          <motion.div 
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"
          />
          <p className="mt-4 text-gray-600">
            {isLoggingOut ? 'Signing out...' : 'Verifying access...'}
          </p>
        </div>
      </div>
    );
  }

  console.log('🛡️ ProtectedRoute: Auth loaded', { hasUser: !!user, isAdmin, requireAdmin });

  // Show friendly error if there was a profile fetch problem
  if (profileError) {
    console.error('❌ ProtectedRoute: Profile error', profileError);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h2 className="text-xl mb-2 text-red-800">Authentication Error</h2>
            <p className="text-red-600 mb-4">
              There was a problem loading your profile. Please try logging in again.
            </p>
            <button
              onClick={handleLogoutAndLogin}
              className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer font-medium"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('🚫 ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    console.log('🚫 ProtectedRoute: Admin required but user is not admin');
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-cream)' }}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl mb-2 text-yellow-800 font-semibold">Access Denied</h2>
            <p className="text-yellow-700 mb-2">
              The currently logged-in account (<strong>{user.email}</strong>) does not have admin permissions.
            </p>
            <p className="text-sm text-yellow-600 mb-4">
              Please sign out and log in with an administrator account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleLogoutAndLogin}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition cursor-pointer font-medium text-sm shadow-sm"
              >
                Log Out & Sign In with Admin
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm font-medium"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (permission && !can(profile?.role, permission)) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6" style={{ background: 'var(--bg-cream)' }}>
        <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-amber-900">Permission required</h2>
          <p className="mt-2 text-sm text-amber-800">Your role can access the admin workspace, but not this protected section.</p>
          <a href="/admin/dashboard" className="mt-5 inline-flex rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white">Return to overview</a>
        </div>
      </div>
    );
  }

  console.log('✅ ProtectedRoute: Access granted');
  // Render protected content
  return <>{children}</>;
}
