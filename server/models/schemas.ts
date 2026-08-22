/**
 * Database Schema Definitions (Mongoose & TypeScript representation)
 * Implements Multi-Tenant SaaS Isolation with Strict RBAC
 */

export interface TenantSchema {
  id: string;
  name: string;
  business_vertical: 'restaurant' | 'grocery' | 'electronics' | 'shop';
  admin_id: string;
  admin_username: string;
  admin_email: string;
  store_phone: string;
  city: string;
  gst_number?: string;
  is_active: boolean; // Toggle switch enable/disable
  plan: 'Starter' | 'Professional' | 'Enterprise';
  created_at: Date;
  updated_at: Date;
}

export interface UserSchema {
  id: string;
  username: string;
  password_hash: string;
  name: string;
  role: 'superadmin' | 'admin' | 'manager' | 'staff';
  tenant_id: string | null; // NULL for superadmin, required for admin/manager/staff
  email?: string;
  phone?: string;
  is_active: boolean; // Toggle switch enable/disable
  created_at: Date;
  updated_at: Date;
}

export interface ProductSchema {
  id: string;
  tenant_id: string; // Tenant isolation key
  name: string;
  name_ml?: string;
  sku: string;
  barcode: string;
  category: string;
  price: number;
  cost_price?: number;
  stock: number;
  min_stock_alert: number;
  unit: string;
  image?: string;
  requires_imei?: boolean;
  imei_numbers?: string[];
  expiry_date?: string;
  is_expiring_soon?: boolean;
  is_veg?: boolean;
  is_available: boolean;
  is_active: boolean; // Universal Toggle Switch
  business_type: 'restaurant' | 'grocery' | 'electronics' | 'shop';
  created_at: Date;
  updated_at: Date;
}

export interface KhataCustomerSchema {
  id: string;
  tenant_id: string; // Tenant isolation key
  name: string;
  phone: string;
  email?: string;
  address?: string;
  net_balance: number;
  credit_limit: number;
  is_active: boolean; // Universal Toggle Switch
  last_activity: Date;
  created_at: Date;
  updated_at: Date;
}

export interface OrderSchema {
  id: string;
  tenant_id: string; // Tenant isolation key
  order_number: string;
  date: string;
  time: string;
  timestamp: number;
  type: string;
  table_number?: string;
  customer_name?: string;
  customer_phone?: string;
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    unit_price: number;
    discount_percent?: number;
  }>;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  payment_method: string;
  status: string;
  cash_tendered?: number;
  change_amount?: number;
  business_type: string;
  created_at: Date;
}
