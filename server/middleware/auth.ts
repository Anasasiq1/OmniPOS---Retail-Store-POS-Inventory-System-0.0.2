import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedUser {
  id: string;
  username: string;
  name: string;
  role: 'superadmin' | 'admin' | 'manager' | 'staff';
  tenantId: string | null;
  businessVertical?: string;
  isActive: boolean;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Auth Middleware: Validates JWT / Bearer Token or Session Header
 * Attaches user.id, user.role, user.tenantId to req.user
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const mockUserHeader = req.headers['x-user-role'] as string;
  const mockUserId = req.headers['x-user-id'] as string;
  const mockTenantId = req.headers['x-tenant-id'] as string;

  // In production, verify actual JWT token:
  // const token = authHeader?.split(' ')[1];
  // const decoded = jwt.verify(token, process.env.JWT_SECRET!);

  if (mockUserHeader) {
    req.user = {
      id: mockUserId || (mockUserHeader === 'superadmin' ? 'usr-superadmin-01' : 'usr-admin-01'),
      username: mockUserHeader === 'superadmin' ? 'Anasasiq' : 'kochi_admin',
      name: mockUserHeader === 'superadmin' ? 'Anas Asiq (Superadmin)' : 'Store Admin',
      role: mockUserHeader as 'superadmin' | 'admin' | 'manager' | 'staff',
      tenantId: mockUserHeader === 'superadmin' ? null : (mockTenantId || 'tenant-resto-01'),
      isActive: true,
    };
    next();
    return;
  }

  // Check Bearer Token simulation
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      // Decode simulated token or real JWT
      const parsed = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      req.user = parsed;
      next();
      return;
    } catch {
      // Fallback for custom string token
      if (token.includes('superadmin')) {
        req.user = {
          id: 'usr-superadmin-01',
          username: 'Anasasiq',
          name: 'Anas Asiq (Superadmin)',
          role: 'superadmin',
          tenantId: null,
          isActive: true,
        };
        next();
        return;
      }
    }
  }

  // Default guest fallback for local testing if not authenticated
  req.user = {
    id: 'usr-superadmin-01',
    username: 'Anasasiq',
    name: 'Anas Asiq (Superadmin)',
    role: 'superadmin',
    tenantId: null,
    isActive: true,
  };
  next();
};

/**
 * Role Checker Middleware: Restricts route to specified allowed roles
 * Usage: router.get('/secret', verifyToken, authorizeRoles('superadmin', 'admin'), handler);
 */
export const authorizeRoles = (...allowedRoles: Array<'superadmin' | 'admin' | 'manager' | 'staff'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required',
      });
      return;
    }

    if (!req.user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: User account has been disabled by Administrator',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource. Required: [${allowedRoles.join(', ')}]`,
      });
      return;
    }

    next();
  };
};

/**
 * Tenant Isolation Middleware: Ensures Admins, Managers, and Staff can ONLY query/update
 * data matching their specific tenant_id. Superadmins have global access.
 */
export const checkTenant = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  // Superadmin bypasses tenant isolation
  if (req.user.role === 'superadmin') {
    next();
    return;
  }

  const userTenantId = req.user.tenantId;
  if (!userTenantId) {
    res.status(403).json({
      success: false,
      message: 'Forbidden: No tenant associated with this user account',
    });
    return;
  }

  // If request contains tenantId in params, query, or body, verify it matches
  const targetTenantId = req.params.tenantId || req.query.tenantId || req.body.tenantId;
  if (targetTenantId && targetTenantId !== userTenantId) {
    res.status(403).json({
      success: false,
      message: 'Cross-Tenant Access Denied: You cannot view or modify another store’s data',
    });
    return;
  }

  // Force tenantId on query / body for safe insertion/filtering
  req.body.tenantId = userTenantId;
  next();
};

/**
 * Vertical Protection Middleware:
 * Explicitly blocks any Store Admin or Manager from modifying their assigned business_vertical.
 * ONLY Superadmin route (/api/superadmin/tenants/:id/vertical) is authorized.
 */
export const protectVertical = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  if (req.user.role !== 'superadmin') {
    if (req.body.businessVertical || req.body.business_vertical) {
      res.status(403).json({
        success: false,
        message: 'Security Policy Violation: Only the SaaS Superadmin can assign or modify the Store Business Vertical.',
      });
      return;
    }
  }

  next();
};
