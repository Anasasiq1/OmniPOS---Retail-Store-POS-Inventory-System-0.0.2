import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import {
  verifyToken,
  authorizeRoles,
  checkTenant,
  protectVertical,
} from '../middleware/auth';
import {
  TenantSchema,
  UserSchema,
  ProductSchema,
  KhataCustomerSchema,
  OrderSchema,
} from '../models/schemas';

const router = Router();

// ==========================================
// Security & Password Hashing Utilities
// ==========================================
const AUTH_SALT = process.env.AUTH_SECRET || 'omnipos_secure_salt_2026_super_key';

export const hashPassword = (password: string): string => {
  return crypto.createHmac('sha256', AUTH_SALT).update(password).digest('hex');
};

export const verifyPassword = (password: string, storedHash: string): boolean => {
  const computedHash = hashPassword(password);
  return computedHash === storedHash || password === storedHash;
};

// ==========================================
// In-Memory Database Store (Seeded on start)
// ==========================================

export const tenantsDB: TenantSchema[] = [
  {
    id: 'tenant-resto-01',
    name: 'Kochi Gourmet Dine & Cafe',
    business_vertical: 'restaurant',
    admin_id: 'usr-admin-resto',
    admin_username: 'kochi_admin',
    admin_email: 'admin@kochigourmet.com',
    store_phone: '+91 98470 12345',
    city: 'Kochi, Kerala',
    gst_number: '32ABCDE1234F1Z5',
    is_active: true,
    plan: 'Enterprise',
    created_at: new Date('2026-01-10'),
    updated_at: new Date('2026-01-10'),
  },
  {
    id: 'tenant-super-02',
    name: 'Malabar Daily Fresh Mart',
    business_vertical: 'grocery',
    admin_id: 'usr-admin-super',
    admin_username: 'malabar_admin',
    admin_email: 'care@malabarmart.in',
    store_phone: '+91 94471 99887',
    city: 'Calicut, Kerala',
    gst_number: '32XYZPQ9876M2K8',
    is_active: true,
    plan: 'Professional',
    created_at: new Date('2026-01-15'),
    updated_at: new Date('2026-01-15'),
  },
  {
    id: 'tenant-tech-03',
    name: 'TechnoPark Smart Electronics',
    business_vertical: 'electronics',
    admin_id: 'usr-admin-tech',
    admin_username: 'techno_admin',
    admin_email: 'sales@technoparksmart.com',
    store_phone: '+91 99955 44332',
    city: 'Trivandrum, Kerala',
    gst_number: '32QWERT5432Y9Z1',
    is_active: false,
    plan: 'Starter',
    created_at: new Date('2026-02-01'),
    updated_at: new Date('2026-02-01'),
  },
];

const superAdminUsername = process.env.SUPER_ADMIN_USERNAME || 'Anasasiq';
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'Anasasiq4302@';

export const usersDB: UserSchema[] = [
  // Master Superadmin Controller (Hashed bootstrap credentials)
  {
    id: 'usr-superadmin-01',
    username: superAdminUsername,
    password_hash: hashPassword(superAdminPassword),
    name: 'Anas Asiq (Superadmin Master)',
    role: 'superadmin',
    tenant_id: null,
    email: 'anasasiq@omnipos.saas',
    phone: '+91 98460 00001',
    is_active: true,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  },
  // Store Admins (Tenants)
  {
    id: 'usr-admin-resto',
    username: 'kochi_admin',
    password_hash: hashPassword('admin123'),
    name: 'Suresh Menon (Store Owner)',
    role: 'admin',
    tenant_id: 'tenant-resto-01',
    email: 'admin@kochigourmet.com',
    phone: '+91 98470 12345',
    is_active: true,
    created_at: new Date('2026-01-10'),
    updated_at: new Date('2026-01-10'),
  },
  {
    id: 'usr-admin-super',
    username: 'malabar_admin',
    password_hash: hashPassword('admin123'),
    name: 'Faizal Rahman (Store Owner)',
    role: 'admin',
    tenant_id: 'tenant-super-02',
    email: 'care@malabarmart.in',
    phone: '+91 94471 99887',
    is_active: true,
    created_at: new Date('2026-01-15'),
    updated_at: new Date('2026-01-15'),
  },
  // Store Managers
  {
    id: 'usr-manager-resto',
    username: 'anu_manager',
    password_hash: hashPassword('manager123'),
    name: 'Anupama V (Floor Manager)',
    role: 'manager',
    tenant_id: 'tenant-resto-01',
    email: 'anu@kochigourmet.com',
    phone: '+91 98470 54321',
    is_active: true,
    created_at: new Date('2026-01-12'),
    updated_at: new Date('2026-01-12'),
  },
  // Cashiers & Staff
  {
    id: 'usr-staff-resto',
    username: 'rahul_cashier',
    password_hash: hashPassword('staff123'),
    name: 'Rahul K (Cashier POS)',
    role: 'staff',
    tenant_id: 'tenant-resto-01',
    email: 'rahul@kochigourmet.com',
    phone: '+91 98470 11223',
    is_active: true,
    created_at: new Date('2026-01-14'),
    updated_at: new Date('2026-01-14'),
  },
];

export const productsDB: ProductSchema[] = [];
export const ordersDB: OrderSchema[] = [];

// ==========================================
// 1. AUTHENTICATION & SESSION ROUTES
// ==========================================

/**
 * POST /api/auth/login
 * Validates credentials against hashed passwords and returns session payload
 */
router.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      success: false,
      message: 'Username and password are required',
    });
    return;
  }

  const user = usersDB.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase()
  );

  if (!user || !verifyPassword(password, user.password_hash)) {
    res.status(401).json({
      success: false,
      message: 'Invalid username or password',
    });
    return;
  }

  if (!user.is_active) {
    res.status(403).json({
      success: false,
      message: 'Account disabled. Please contact the platform Superadmin.',
    });
    return;
  }

  let tenant: TenantSchema | undefined;
  if (user.tenant_id) {
    tenant = tenantsDB.find((t) => t.id === user.tenant_id);
    if (tenant && !tenant.is_active && user.role !== 'superadmin') {
      res.status(403).json({
        success: false,
        message: 'Your Store Tenant subscription is disabled. Please contact Superadmin support.',
      });
      return;
    }
  }

  // Generate Base64 signed token
  const tokenPayload = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    tenantId: user.tenant_id,
    businessVertical: tenant?.business_vertical || 'restaurant',
    isActive: user.is_active,
  };
  const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    token,
    user: tokenPayload,
    tenant: tenant || null,
  });
});

/**
 * GET /api/auth/me
 * Returns current authenticated user and tenant info
 */
router.get('/auth/me', verifyToken, (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  let tenant: TenantSchema | undefined;
  if (req.user.tenantId) {
    tenant = tenantsDB.find((t) => t.id === req.user?.tenantId);
  }

  res.json({
    success: true,
    user: req.user,
    tenant: tenant || null,
  });
});

// ==========================================
// 2. SUPERADMIN ROUTES (Master SaaS Controller)
// ==========================================

/**
 * GET /api/superadmin/tenants
 * Lists all store tenants on the platform
 */
router.get(
  '/superadmin/tenants',
  verifyToken,
  authorizeRoles('superadmin'),
  (req: Request, res: Response) => {
    res.json({
      success: true,
      data: tenantsDB,
      total: tenantsDB.length,
    });
  }
);

/**
 * POST /api/superadmin/tenants
 * Creates a new Store Tenant and its Owner Admin account
 */
router.post(
  '/superadmin/tenants',
  verifyToken,
  authorizeRoles('superadmin'),
  (req: Request, res: Response) => {
    const {
      name,
      business_vertical,
      admin_name,
      admin_username,
      admin_password,
      admin_email,
      store_phone,
      city,
      gst_number,
      plan,
    } = req.body;

    if (!name || !business_vertical || !admin_username) {
      res.status(400).json({
        success: false,
        message: 'Missing required tenant details: name, business_vertical, and admin_username required',
      });
      return;
    }

    const tenantId = `tenant-${Date.now()}`;
    const adminId = `usr-admin-${Date.now()}`;

    // Create Admin User with hashed password
    const newAdmin: UserSchema = {
      id: adminId,
      username: admin_username,
      password_hash: hashPassword(admin_password || 'admin123'),
      name: admin_name || `${name} Owner`,
      role: 'admin',
      tenant_id: tenantId,
      email: admin_email || `${admin_username}@omnipos.store`,
      phone: store_phone || '',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    usersDB.push(newAdmin);

    // Create Tenant
    const newTenant: TenantSchema = {
      id: tenantId,
      name,
      business_vertical: business_vertical || 'restaurant',
      admin_id: adminId,
      admin_username,
      admin_email: admin_email || `${admin_username}@omnipos.store`,
      store_phone: store_phone || '',
      city: city || 'Kerala, India',
      gst_number: gst_number || '',
      plan: plan || 'Professional',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    tenantsDB.unshift(newTenant);

    res.status(201).json({
      success: true,
      message: `Tenant '${name}' created successfully with vertical: ${business_vertical}`,
      data: newTenant,
    });
  }
);

/**
 * PUT /api/superadmin/tenants/:id
 * Updates store details
 */
router.put(
  '/superadmin/tenants/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const index = tenantsDB.findIndex((t) => t.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Tenant not found' });
      return;
    }

    tenantsDB[index] = {
      ...tenantsDB[index],
      ...req.body,
      updated_at: new Date(),
    };

    res.json({
      success: true,
      message: 'Tenant updated successfully',
      data: tenantsDB[index],
    });
  }
);

/**
 * PATCH /api/superadmin/tenants/:id/status
 * Universal Toggle: Enable / Disable a Tenant Store
 */
router.patch(
  '/superadmin/tenants/:id/status',
  verifyToken,
  authorizeRoles('superadmin'),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const tenant = tenantsDB.find((t) => t.id === id);
    if (!tenant) {
      res.status(404).json({ success: false, message: 'Tenant not found' });
      return;
    }

    tenant.is_active = typeof req.body.is_active === 'boolean' ? req.body.is_active : !tenant.is_active;
    tenant.updated_at = new Date();

    res.json({
      success: true,
      message: `Tenant '${tenant.name}' is now ${tenant.is_active ? 'ENABLED' : 'DISABLED'}`,
      data: tenant,
    });
  }
);

/**
 * PATCH /api/superadmin/tenants/:id/vertical
 * EXCLUSIVE SUPERADMIN ACTION: Assign or change Store Business Vertical
 */
router.patch(
  '/superadmin/tenants/:id/vertical',
  verifyToken,
  authorizeRoles('superadmin'),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const { business_vertical } = req.body;

    const tenant = tenantsDB.find((t) => t.id === id);
    if (!tenant) {
      res.status(404).json({ success: false, message: 'Tenant not found' });
      return;
    }

    if (!['restaurant', 'grocery', 'electronics', 'shop'].includes(business_vertical)) {
      res.status(400).json({
        success: false,
        message: "Invalid business vertical. Choose from: 'restaurant', 'grocery', 'electronics', 'shop'",
      });
      return;
    }

    tenant.business_vertical = business_vertical;
    tenant.updated_at = new Date();

    res.json({
      success: true,
      message: `Tenant '${tenant.name}' business vertical switched to: ${business_vertical.toUpperCase()}`,
      data: tenant,
    });
  }
);

/**
 * DELETE /api/superadmin/tenants/:id
 * Deletes a tenant and cascades delete to tenant users
 */
router.delete(
  '/superadmin/tenants/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const index = tenantsDB.findIndex((t) => t.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Tenant not found' });
      return;
    }

    const [deleted] = tenantsDB.splice(index, 1);
    // Remove users belonging to this tenant
    const remainingUsers = usersDB.filter((u) => u.tenant_id !== id);
    usersDB.length = 0;
    usersDB.push(...remainingUsers);

    res.json({
      success: true,
      message: `Tenant '${deleted.name}' deleted successfully`,
    });
  }
);

// ==========================================
// 3. TENANT USER MANAGEMENT (Admin & Manager)
// ==========================================

/**
 * GET /api/tenant/users
 * Returns list of managers & staff for current tenant
 */
router.get(
  '/tenant/users',
  verifyToken,
  authorizeRoles('superadmin', 'admin', 'manager'),
  checkTenant,
  (req: Request, res: Response) => {
    const tenantId = req.user?.role === 'superadmin' ? req.query.tenantId : req.user?.tenantId;
    const tenantUsers = tenantId
      ? usersDB.filter((u) => u.tenant_id === tenantId)
      : usersDB.filter((u) => u.role !== 'superadmin');

    // Never return password hashes
    const sanitized = tenantUsers.map(({ password_hash, ...rest }) => rest);

    res.json({
      success: true,
      data: sanitized,
    });
  }
);

/**
 * POST /api/tenant/users
 * Admin creates new Staff or Manager for their store
 */
router.post(
  '/tenant/users',
  verifyToken,
  authorizeRoles('superadmin', 'admin'),
  checkTenant,
  (req: Request, res: Response) => {
    const { username, name, password, role, email, phone } = req.body;
    const tenantId = req.user?.tenantId;

    if (!username || !role) {
      res.status(400).json({ success: false, message: 'Username and Role required' });
      return;
    }

    if (['superadmin', 'admin'].includes(role) && req.user?.role !== 'superadmin') {
      res.status(403).json({
        success: false,
        message: 'Store Admins can only create Manager and Staff roles',
      });
      return;
    }

    const newUser: UserSchema = {
      id: `usr-${role}-${Date.now()}`,
      username,
      password_hash: hashPassword(password || '123456'),
      name: name || username,
      role,
      tenant_id: tenantId || null,
      email: email || '',
      phone: phone || '',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    usersDB.push(newUser);

    const { password_hash, ...sanitized } = newUser;

    res.status(201).json({
      success: true,
      message: `User '${name}' (${role.toUpperCase()}) created successfully`,
      data: sanitized,
    });
  }
);

/**
 * PATCH /api/tenant/users/:id/status
 * Universal Toggle: Enable / Disable a Staff or Manager user
 */
router.patch(
  '/tenant/users/:id/status',
  verifyToken,
  authorizeRoles('superadmin', 'admin'),
  checkTenant,
  (req: Request, res: Response) => {
    const { id } = req.params;
    const user = usersDB.find((u) => u.id === id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Protection: Store Admin cannot disable Superadmins or other Tenant Owners
    if (user.role === 'superadmin' && req.user?.role !== 'superadmin') {
      res.status(403).json({ success: false, message: 'Cannot modify Superadmin status' });
      return;
    }

    user.is_active = typeof req.body.is_active === 'boolean' ? req.body.is_active : !user.is_active;
    user.updated_at = new Date();

    const { password_hash, ...sanitized } = user;

    res.json({
      success: true,
      message: `User '${user.name}' is now ${user.is_active ? 'ACTIVE' : 'DISABLED'}`,
      data: sanitized,
    });
  }
);

/**
 * DELETE /api/tenant/users/:id
 * Delete a user
 */
router.delete(
  '/tenant/users/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin'),
  checkTenant,
  (req: Request, res: Response) => {
    const { id } = req.params;
    const index = usersDB.findIndex((u) => u.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (usersDB[index].role === 'superadmin') {
      res.status(403).json({ success: false, message: 'Cannot delete Superadmin account' });
      return;
    }

    const [deleted] = usersDB.splice(index, 1);
    res.json({
      success: true,
      message: `User '${deleted.name}' deleted successfully`,
    });
  }
);

export default router;
