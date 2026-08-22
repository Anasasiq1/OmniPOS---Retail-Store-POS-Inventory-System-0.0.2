export type BusinessType = 'grocery' | 'electronics' | 'restaurant' | 'shop' | 'retail' | 'supermarket' | 'bakery' | 'cafe' | 'pharmacy';

export type Language = 'en' | 'ml';

export type UserRole = 
  | 'superadmin' 
  | 'admin' 
  | 'manager' 
  | 'cashier' 
  | 'waiter' 
  | 'chef' 
  | 'delivery_driver' 
  | 'staff'
  | 'customer';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'enable' | 'disable' | 'export' | 'import' | 'backup';

export type ModulePermission = 
  | 'dashboard'
  | 'pos'
  | 'products'
  | 'inventory'
  | 'purchases'
  | 'sales'
  | 'expenses'
  | 'income'
  | 'customers'
  | 'tables'
  | 'orders'
  | 'reports'
  | 'employees'
  | 'settings'
  | 'backup'
  | 'import_export'
  | 'digital_menu'
  | 'audit_logs'
  | 'coupons'
  | 'quotations'
  | 'subscriptions'
  | 'waiter_app'
  | 'chef_app'
  | 'delivery_app';

export type UserStatus = 'active' | 'disabled' | 'suspended';

export type CustomerStatus = 'active' | 'disabled' | 'suspended' | 'archived';

export type KhataStatus = 'enabled' | 'disabled' | 'cleared';

export type KhataTransactionType = 
  | 'credit' 
  | 'payment' 
  | 'partial_payment' 
  | 'full_payment' 
  | 'adjustment' 
  | 'refund' 
  | 'opening_balance';

export type KhataPaymentMethod = 'cash' | 'upi' | 'card' | 'bank' | 'wallet' | 'cheque' | 'credit' | 'other';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  tenantId?: string | null; // null for superadmin
  tenantName?: string;
  email?: string;
  phone?: string;
  password?: string;
  storeId?: string;
  storeName?: string;
  businessType?: BusinessType;
  isActive: boolean;
  status?: UserStatus;
  avatarColor?: string;
  createdAt?: string;
  permissions?: Record<ModulePermission, PermissionAction[]>;
  assignedTables?: string[];
  vehicleNumber?: string;
}

export interface Domain {
  id: string;
  tenantId: string;
  tenantName: string;
  domain: string;
  subdomain: string;
  isCustom: boolean;
  sslActive: boolean;
  sslStatus?: 'active' | 'pending' | 'expired';
  status: 'active' | 'pending' | 'disabled';
  isPrimary?: boolean;
  type?: 'subdomain' | 'custom' | 'cname';
  createdAt: string;
}

export interface Store {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  city: string;
  managerId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  businessVertical: BusinessType;
  subdomain: string;
  customDomain?: string;
  adminId: string;
  adminUsername: string;
  adminEmail: string;
  storePhone: string;
  city: string;
  gstNumber?: string;
  plan: 'Starter' | 'Growth' | 'Professional' | 'Enterprise';
  planExpiryDate?: string;
  isActive: boolean;
  createdAt: string;
  totalOrdersCount?: number;
  totalRevenue?: number;
  stores?: Store[];
}

export interface ProductVariant {
  id: string;
  name: string; // Regular, Medium, Large, Full, Half
  price: number;
  sku?: string;
}

export interface ProductAddon {
  id: string;
  name: string; // Extra Cheese, Spicy Mayo, Garlic Dip
  price: number;
  isVeg?: boolean;
}

export interface Product {
  id: string;
  tenantId?: string;
  storeId?: string;
  name: string;
  nameMl?: string;
  sku: string;
  barcode: string;
  category: string;
  subCategory?: string;
  unit: string;
  openingStock?: number;
  stock: number;
  minStockAlert: number;
  maxStockAlert?: number;
  price: number; // Selling price
  costPrice?: number; // Purchase price
  taxPercent?: number;
  supplier?: string;
  expiryDate?: string;
  batchNumber?: string;
  warehouse?: string;
  image?: string;
  requiresImei?: boolean;
  imeiNumbers?: string[];
  isExpiringSoon?: boolean;
  isVeg?: boolean;
  dietaryType?: 'veg' | 'non-veg' | 'vegan' | 'halal';
  isAvailable?: boolean;
  isActive?: boolean;
  description?: string;
  businessType: BusinessType;
  prepTimeMinutes?: number;
  calories?: number;
  allergens?: string[];
  variants?: ProductVariant[];
  addons?: ProductAddon[];
}

export interface CartItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  selectedVariant?: ProductVariant;
  selectedAddons?: CartItemAddon[];
  discountPercent?: number;
  imeiOrSerial?: string;
  notes?: string;
}

export type OrderType = 'dine-in' | 'takeaway' | 'delivery' | 'counter' | 'online' | 'call_in';

export type PaymentMethod = 
  | 'upi' 
  | 'cash' 
  | 'card' 
  | 'khata' 
  | 'split' 
  | 'wallet' 
  | 'bank'
  | 'stripe'
  | 'paypal'
  | 'razorpay'
  | 'paystack'
  | 'flutterwave'
  | 'mollie'
  | 'mercadopago'
  | 'sslcommerz'
  | 'bkash'
  | 'cod';

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'kot_sent'
  | 'cooking'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'served'
  | 'paid' 
  | 'pending' 
  | 'hold'
  | 'cancelled'
  | 'refunded';

export interface SplitPaymentDetails {
  cash: number;
  upi: number;
  card: number;
  khata: number;
  online?: number;
  isSplit?: boolean;
}

export interface Order {
  id: string;
  tenantId?: string;
  storeId?: string;
  orderNumber: string;
  date: string;
  time: string;
  timestamp: number;
  type: OrderType;
  tableNumber?: string;
  tableId?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  waiterId?: string;
  waiterName?: string;
  chefId?: string;
  deliveryDriverId?: string;
  deliveryDriverName?: string;
  deliveryStatus?: 'pending' | 'assigned' | 'picked_up' | 'on_the_way' | 'delivered';
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  taxAmount: number;
  serviceCharge?: number;
  deliveryFee?: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentGateway?: string;
  paymentStatus?: 'paid' | 'unpaid' | 'partial' | 'refunded';
  splitDetails?: SplitPaymentDetails;
  status: OrderStatus;
  cashTendered?: number;
  changeAmount?: number;
  notes?: string;
  kotNumber?: string;
  kotPrinted?: boolean;
  billPrinted?: boolean;
  receiptPrinted?: boolean;
  preparationStartedAt?: number;
  preparationReadyAt?: number;
  syncedOffline?: boolean;
  businessType: BusinessType;
}

export interface KhataTransaction {
  id: string;
  customerId?: string;
  tenantId?: string;
  date: string;
  time: string;
  timestamp: number;
  type: KhataTransactionType;
  amount: number;
  creditAmount?: number;
  paymentAmount?: number;
  description: string;
  billId?: string;
  balanceAfter: number;
  paymentMode?: string;
  paymentMethod?: KhataPaymentMethod | string;
  reference?: string;
  recordedBy?: string;
  createdBy?: string;
  notes?: string;
  attachmentUrl?: string;
  cycleId?: string;
}

export interface CustomerKhata {
  id: string;
  customerId?: string; // e.g. CUST-1001
  tenantId?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  avatarColor?: string;
  profileImage?: string;
  status: CustomerStatus;
  khataStatus: KhataStatus;
  netBalance: number; // positive = customer owes merchant / outstanding
  creditLimit: number;
  totalCredit?: number;
  totalPayments?: number;
  totalPurchases?: number;
  openingBalance?: number;
  transactions: KhataTransaction[];
  lastActivity: string;
  createdAt?: string;
  createdDate?: string;
  notes?: string;
  isActive: boolean;
}

export interface SupplierParty {
  id: string;
  tenantId?: string;
  name: string;
  companyName: string;
  phone: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  contactPerson?: string;
  category?: string;
  categorySupplied: string;
  openingBalance: number;
  netBalance: number; // positive = we owe supplier (Payable)
  totalPurchases: number;
  totalPaid: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  productId?: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  rate: number;
  discount?: number;
  tax?: number;
  total: number;
}

export interface Purchase {
  id: string;
  tenantId: string;
  storeId?: string;
  purchaseDate: string;
  supplier: string;
  supplierId?: string;
  invoiceNumber: string;
  items: PurchaseItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'credit' | 'bank' | 'upi';
  paidAmount: number;
  pendingAmount: number;
  notes?: string;
  billImageUrl?: string;
  createdBy: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'partial';
}

export interface AccountTransaction {
  id: string;
  tenantId: string;
  storeId?: string;
  date: string;
  type: 'income' | 'expense';
  category: 
    | 'Sales Income'
    | 'Catering Income'
    | 'Event Booking'
    | 'Commission Income'
    | 'Other Income'
    | 'Cash Income'
    | 'Bank Income'
    | 'UPI Income'
    | 'Card Income'
    | 'Credit Collection'
    | 'Purchase Expense'
    | 'Kitchen Groceries'
    | 'LPG Gas Cylinder'
    | 'Staff Salary'
    | 'Electricity'
    | 'Water'
    | 'Rent'
    | 'Transport'
    | 'Maintenance'
    | 'Packaging'
    | 'Marketing'
    | 'Other Expense';
  description: string;
  amount: number;
  paymentMethod: 'cash' | 'bank' | 'upi' | 'card' | 'credit';
  referenceNumber?: string;
  attachmentUrl?: string;
  createdBy: string;
  createdAt: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'disabled';

export interface RestaurantTable {
  id: string;
  tenantId?: string;
  number: string;
  name: string;
  capacity: number;
  floor?: string;
  status: TableStatus;
  currentOrderId?: string;
  currentTotal?: number;
  guestCount?: number;
  reservedTime?: string;
  occupiedSince?: string;
  assignedWaiter?: string;
  qrCodeUrl?: string;
  isActive?: boolean;
}

export interface TableReservation {
  id: string;
  tenantId?: string;
  reservationNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  guestCount: number;
  tableId?: string;
  tableNumber: string;
  reservationDate: string;
  date?: string;
  timeSlot: string;
  specialRequests?: string;
  notes?: string;
  advanceDeposit: number;
  depositPaymentMethod?: PaymentMethod;
  status: 'confirmed' | 'seated' | 'cancelled' | 'completed' | 'no_show';
  createdAt: string;
}

export interface QuotationItem {
  id: string;
  productId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  taxPercent?: number;
  total: number;
}

export interface Quotation {
  id: string;
  tenantId?: string;
  quotationNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  eventDate?: string;
  guestCount?: number;
  validUntil: string;
  items: QuotationItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  termsAndConditions?: string;
  status: 'draft' | 'sent' | 'accepted' | 'converted' | 'expired';
  convertedOrderId?: string;
  createdBy: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  tenantId?: string;
  code: string;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  validUntil?: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  applicableTo: 'all' | 'dine-in' | 'takeaway' | 'delivery' | 'online';
}

export type PaymentGatewayId = 
  | 'stripe' 
  | 'paypal' 
  | 'razorpay' 
  | 'paystack' 
  | 'flutterwave' 
  | 'mollie' 
  | 'mercadopago' 
  | 'sslcommerz' 
  | 'bkash' 
  | 'cashfree'
  | 'square'
  | 'authorize_net'
  | 'cod' 
  | 'cash'
  | 'pos_terminal';

export interface PaymentGatewayConfig {
  id: PaymentGatewayId;
  name: string;
  category?: 'international' | 'regional' | 'mobile_wallet' | 'manual';
  isEnabled: boolean;
  isSandbox?: boolean;
  apiKey?: string;
  apiSecret?: string;
  publicKey?: string;
  secretKey?: string;
  merchantId?: string;
  currency?: string;
  supportedCurrencies?: string[];
  region?: string;
  icon?: string;
  transactionFeePercent?: number;
  supportedRegions?: string[];
  instructions?: string;
}

export interface SaaSSubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  isPopular?: boolean;
  maxUsers: number;
  maxOutlets: number;
  maxOrdersPerMonth: number;
  features: string[];
}

export interface SaaSPackage {
  id: string;
  name: string;
  slug: 'starter' | 'growth' | 'professional' | 'enterprise';
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: string[];
  maxOrdersPerMonth: number; // -1 for unlimited
  maxTables: number;
  maxStaff: number;
  maxBranches: number;
  hasWaiterApp: boolean;
  hasChefApp: boolean;
  hasTableBooking: boolean;
  hasOnlineOrdering: boolean;
  hasApiAccess: boolean;
  isPopular?: boolean;
  isActive: boolean;
}

export interface VatTaxSettings {
  taxName: string;
  taxRate: number;
  isTaxInclusive: boolean;
  serviceChargeRate: number;
  taxNumber?: string;
}

export interface TaxRule {
  id: string;
  tenantId?: string;
  name: string;
  percentage: number;
  type: 'vat' | 'gst' | 'cgst' | 'sgst' | 'service_charge';
  isInclusive: boolean;
  isActive: boolean;
}

export interface PrinterConfig {
  printerName: string;
  connectionType: 'bluetooth' | 'wifi' | 'usb' | 'cable' | 'network';
  thermalWidth: '80mm' | '58mm';
  ipAddress?: string;
  port?: number;
  bluetoothDeviceId?: string;
  autoPrintKot: boolean;
  autoPrintBill: boolean;
  autoPrintReceipt: boolean;
  cutPaper: boolean;
  openCashDrawer: boolean;
  buzzerAlert: boolean;
  showLogo: boolean;
  headerTitle?: string;
  footerNote?: string;
}

export interface DigitalMenuAPI {
  id: string;
  tenantId: string;
  tenantName: string;
  apiKey: string;
  apiSecret: string;
  appName: string;
  allowedDomains: string;
  rateLimitPerMin: number;
  status: 'active' | 'revoked' | 'disabled';
  assignedStoreId?: string;
  createdAt: string;
  lastUsedAt?: string;
  totalCallsCount: number;
  permissions: string[];
}

export interface AuditLog {
  id: string;
  tenantId?: string | null;
  tenantName?: string;
  userId?: string;
  username?: string;
  userName?: string;
  role?: UserRole;
  userRole?: UserRole | string;
  action: 
    | 'LOGIN'
    | 'LOGOUT'
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'ENABLE'
    | 'DISABLE'
    | 'PURCHASE'
    | 'SALE'
    | 'PAYMENT'
    | 'CREDIT'
    | 'CREDIT_PAYMENT'
    | 'BACKUP'
    | 'RESTORE'
    | 'IMPORT'
    | 'EXPORT'
    | 'KOT_GENERATED'
    | 'BILL_PRINTED'
    | 'RECEIPT_PRINTED'
    | 'QUOTATION_CREATED'
    | 'QUOTATION_CONVERTED'
    | 'RESERVATION_CREATED'
    | 'RESERVATION_SEATED'
    | 'COUPON_CREATED'
    | 'STATUS_CHANGE'
    | string;
  module: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  entityId?: string;
  previousState?: any;
}

export interface StoreSettings {
  storeName: string;
  businessType: BusinessType;
  subdomain?: string;
  customDomain?: string;
  tagline: string;
  address: string;
  phone: string;
  email?: string;
  gstNumber: string;
  currency: string;
  currencySymbol: string;
  taxRatePercent: number;
  serviceChargePercent: number;
  taxInclusive: boolean;
  autoPrintReceipt: boolean;
  autoPrintKot: boolean;
  receiptThermalWidth: '80mm' | '58mm';
  enableWhatsAppReceipts: boolean;
  enableKhataBook: boolean;
  enableTableManagement: boolean;
  enableQuotations: boolean;
  enableDeliveryTracking: boolean;
  printer: PrinterConfig;
  webhookStockUrl?: string;
  webhookOrderUrl?: string;
  menuApiEndpoint?: string;
  menuSyncFrequency?: string;
  globalSyncEnabled?: boolean;
  realtimeStockSync?: boolean;
  lowStockWebAlerts?: boolean;
  outOfStockAutoHide?: boolean;
  syncOutOfStockItems?: boolean;
  digitalMenuApiKey?: string;
  digitalMenuApiSecret?: string;
  digitalMenuConnected?: boolean;
  activeIntegrations?: {
    shopify: boolean;
    woocommerce: boolean;
    customApi: boolean;
    digitalMenu: boolean;
  };
}

export type NavTab =
  | 'dashboard'
  | 'pos'
  | 'orders'
  | 'waiter_app'
  | 'chef_app'
  | 'chef_kds'
  | 'delivery'
  | 'delivery_app'
  | 'quotations'
  | 'tables'
  | 'inventory'
  | 'purchases'
  | 'parties'
  | 'due_list'
  | 'coupons'
  | 'accounts'
  | 'transactions'
  | 'vat_settings'
  | 'staff'
  | 'subscriptions'
  | 'gateways'
  | 'payment_gateways'
  | 'reports'
  | 'digital_menu'
  | 'khata'
  | 'import_export'
  | 'backup'
  | 'audit_logs'
  | 'settings'
  | 'tenants'
  | 'saas_packages'
  | 'domains'
  | 'super_menu_api'
  | 'super_admins';
