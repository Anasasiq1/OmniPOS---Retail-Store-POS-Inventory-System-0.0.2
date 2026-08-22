import React from 'react';
import { UserRole } from '../../types';
import { usePOS } from '../../context/POSContext';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * RoleGuard Component:
 * Conditionally renders child components only if the logged-in user possesses one of the allowed roles.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { currentUser } = usePOS();

  if (!currentUser) return <>{fallback}</>;

  if (allowedRoles.includes(currentUser.role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
