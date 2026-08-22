import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import {
  BusinessType,
  Language,
  Product,
  CartItem,
  Order,
  CustomerKhata,
  SupplierParty,
  RestaurantTable,
  TableReservation,
  Quotation,
  Coupon,
  PaymentGatewayConfig,
  PaymentGatewayId,
  SaaSPackage,
  TaxRule,
  StoreSettings,
  PaymentMethod,
  OrderType,
  OrderStatus,
  User,
  Tenant,
  UserRole,
  UserStatus,
  CustomerStatus,
  KhataStatus,
  KhataPaymentMethod,
  KhataTransaction,
  KhataTransactionType,
  VatTaxSettings,
  SaaSSubscriptionPlan,
  Domain,
  Purchase,
  AccountTransaction,
  AuditLog,
  DigitalMenuAPI,
  SplitPaymentDetails,
  ModulePermission,
  PermissionAction,
  PrinterConfig,
} from '../types';
import {
  initialProducts,
  initialCustomers,
  initialSuppliers,
  initialTables,
  initialReservations,
  initialOrders,
  initialQuotations,
  initialCoupons,
  initialPaymentGateways,
  initialSaaSPackages,
  initialTaxRules,
  initialSettings,
  initialTenants,
  initialUsers,
  initialDomains,
  initialPurchases,
  initialAccounts,
  initialDigitalMenuApis,
  initialAuditLogs,
} from '../data/mockData';

interface POSContextType {
  // Auth & RBAC State
  currentUser: User;
  currentTenant: Tenant | null;
  allTenants: Tenant[];
  allUsers: User[];
  tenantUsers: User[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (username: string, password?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  switchRoleQuick: (role: UserRole) => void;
  switchTenant: (tenantId: string) => void;
  hasPermission: (module: ModulePermission, action: PermissionAction) => boolean;

  // Domain & Subdomain System
  domains: Domain[];
  activeSubdomain: string;
  simulateDomainResolution: (subdomainOrDomain: string) => void;
  addDomain: (data: Omit<Domain, 'id' | 'createdAt'>) => void;
  deleteDomain: (id: string) => void;

  // Superadmin Tenant Management CRUD & Actions
  addTenant: (data: Partial<Tenant> & { adminUsername: string; adminPassword?: string }) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  toggleTenantStatus: (id: string) => void;
  changeTenantVertical: (id: string, vertical: BusinessType) => void;

  // Super Admin - Admin User Management CRUD & Actions
  addAdminUser: (data: Partial<User> & { password?: string }) => void;
  updateAdminUser: (id: string, updates: Partial<User>) => void;
  deleteAdminUser: (id: string) => void;
  toggleAdminStatus: (id: string, status?: UserStatus) => void;
  resetAdminPassword: (id: string, newPassword: string) => void;

  // Admin Tenant User Management CRUD & Actions (Staff List)
  addTenantUser: (data: Partial<User> & { password?: string }) => void;
  updateTenantUser: (id: string, updates: Partial<User>) => void;
  deleteTenantUser: (id: string) => void;
  toggleTenantUserStatus: (id: string) => void;

  // Navigation & View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  businessType: BusinessType;
  setBusinessType: (type: BusinessType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;

  // Products & Menu Items
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  adjustStock: (id: string, amount: number, reason?: string) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;

  // Cart & POS (Food Ordering System)
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string, addonIds?: string[], notes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setItemDiscount: (productId: string, discountPercent: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartDiscount: number;
  cartTotal: number;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  selectedTableNumber: string;
  setSelectedTableNumber: (tableNum: string) => void;
  selectedCustomer: CustomerKhata | null;
  setSelectedCustomer: (customer: CustomerKhata | null) => void;

  // Hold / Resume Carts
  heldCarts: { id: string; name: string; items: CartItem[]; timestamp: number; table?: string }[];
  holdCurrentCart: (name?: string) => void;
  resumeCart: (heldId: string) => void;
  deleteHeldCart: (heldId: string) => void;

  // Checkout & Order Lifecycle
  orders: Order[];
  completeCheckout: (
    paymentMethod: PaymentMethod,
    cashTendered?: number,
    notes?: string,
    splitDetails?: SplitPaymentDetails,
    gatewayName?: string
  ) => Order;
  lastOrder: Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateDeliveryStatus: (orderId: string, status: Order['deliveryStatus'], driverId?: string, driverName?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  refundOrder: (orderId: string, amount?: number, reason?: string) => void;
  createCallInOrder: (orderData: Partial<Order>) => Order;

  // 3-Step Bill Printing & KOT Operations
  activePrintModal: { order: Order; type: 'kot' | 'bill' | 'receipt' } | null;
  openPrintModal: (order: Order, type: 'kot' | 'bill' | 'receipt') => void;
  closePrintModal: () => void;
  printKotTicket: (order: Order) => void;
  printPreBillCheck: (order: Order) => void;
  printThermalReceipt: (order: Order) => void;

  // Waiter & Chef Operations
  sendKotFromWaiter: (tableNumber: string, items: CartItem[], guestCount?: number, notes?: string) => Order;
  bumpChefOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;

  // Table Management & Table Reservations
  tables: RestaurantTable[];
  addTable: (table: Omit<RestaurantTable, 'id' | 'tenantId'>) => void;
  updateTable: (id: string, updates: Partial<RestaurantTable>) => void;
  deleteTable: (id: string) => void;
  updateTableStatus: (id: string, status: RestaurantTable['status'], orderTotal?: number) => void;
  assignTableOrder: (tableNumber: string, orderId: string, total: number) => void;
  reservations: TableReservation[];
  addReservation: (data: Omit<TableReservation, 'id' | 'reservationNumber' | 'createdAt' | 'tenantId'>) => void;
  updateReservation: (id: string, updates: Partial<TableReservation>) => void;
  seatReservation: (reservationId: string) => void;
  cancelReservation: (reservationId: string) => void;

  // Quotations System (Convert to Sale)
  quotations: Quotation[];
  addQuotation: (data: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt' | 'tenantId' | 'createdBy'>) => void;
  updateQuotation: (id: string, updates: Partial<Quotation>) => void;
  deleteQuotation: (id: string) => void;
  convertQuotationToOrder: (quotationId: string) => Order;

  // Coupons & Promo Codes
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string; discountAmount?: number };
  removeCoupon: () => void;
  addCoupon: (data: Omit<Coupon, 'id' | 'tenantId' | 'usageCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;

  // Parties: Customers & Suppliers
  customers: CustomerKhata[];
  allCustomers: CustomerKhata[];
  addCustomer: (customer: Omit<CustomerKhata, 'id' | 'transactions' | 'netBalance' | 'lastActivity' | 'isActive'> & { openingBalance?: number; notes?: string }) => void;
  updateCustomer: (id: string, updates: Partial<CustomerKhata>) => void;
  deleteCustomer: (id: string) => void;
  archiveCustomer: (id: string) => void;
  restoreCustomer: (id: string) => void;
  toggleCustomerStatus: (id: string) => void;
  disableKhata: (customerId: string) => void;
  enableKhata: (customerId: string) => void;
  recordKhataCredit: (customerId: string, amount: number, description: string, billId?: string, notes?: string) => void;
  recordKhataPayment: (customerId: string, amount: number, description: string, paymentMode?: string, reference?: string, notes?: string) => void;
  selectedKhataCustomer: CustomerKhata | null;
  setSelectedKhataCustomer: (cust: CustomerKhata | null) => void;
  suppliers: SupplierParty[];
  addSupplier: (data: Omit<SupplierParty, 'id' | 'createdAt' | 'tenantId'>) => void;
  updateSupplier: (id: string, updates: Partial<SupplierParty>) => void;
  deleteSupplier: (id: string) => void;
  recordSupplierPayment: (supplierId: string, amount: number, paymentMode?: string, notes?: string) => void;

  // 11+ Payment Gateways
  paymentGateways: PaymentGatewayConfig[];
  updatePaymentGateway: (id: PaymentGatewayId, updates: Partial<PaymentGatewayConfig>) => void;
  togglePaymentGateway: (id: PaymentGatewayId) => void;

  // SaaS Packages & Subscriptions
  saasPackages: SaaSPackage[];
  upgradeSaaSPackage: (packageSlug: 'starter' | 'growth' | 'professional' | 'enterprise') => void;
  addSaaSPackage: (data: Omit<SaaSPackage, 'id'>) => void;
  updateSaaSPackage: (id: string, updates: Partial<SaaSPackage>) => void;

  // VAT & Tax Settings
  taxRules: TaxRule[];
  addTaxRule: (data: Omit<TaxRule, 'id' | 'tenantId'>) => void;
  updateTaxRule: (id: string, updates: Partial<TaxRule>) => void;
  deleteTaxRule: (id: string) => void;
  toggleTaxRule: (id: string) => void;

  // Daily Purchases
  purchases: Purchase[];
  addPurchase: (data: Omit<Purchase, 'id' | 'createdAt' | 'tenantId' | 'createdBy'>) => void;
  updatePurchase: (id: string, updates: Partial<Purchase>) => void;
  deletePurchase: (id: string) => void;

  // Daily Incomes & Expenses Accounts
  accounts: AccountTransaction[];
  addAccountTransaction: (data: Omit<AccountTransaction, 'id' | 'createdAt' | 'tenantId' | 'createdBy'>) => void;
  updateAccountTransaction: (id: string, updates: Partial<AccountTransaction>) => void;
  deleteAccountTransaction: (id: string) => void;

  // Thermal Bluetooth / WiFi / USB Printer Settings
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  updatePrinterConfig: (updates: Partial<PrinterConfig>) => void;
  testPrinterConnection: (type: 'bluetooth' | 'wifi' | 'usb') => Promise<{ success: boolean; message: string }>;

  // Audit Logs & Security
  auditLogs: AuditLog[];
  logAudit: (action: string, module: string, details: string, entityId?: string) => void;

  // Backup & Import/Export
  createFullBackupZip: () => Promise<Blob>;
  generateZipBackup: () => Promise<Blob>;
  restoreFromBackupData: (data: any) => Promise<{ success: boolean; message: string }>;
  restoreFromZip: (file: File) => Promise<{ success: boolean; message: string }>;
  resetToFactoryDefaults: () => void;

  // Scanner & Modals
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  handleScannedBarcode: (barcode: string) => { success: boolean; item?: Product; message: string };

  // Digital Menu API
  digitalMenuApis: DigitalMenuAPI[];
  createDigitalMenuApi: (data: Omit<DigitalMenuAPI, 'id' | 'createdAt' | 'totalCallsCount'>) => void;
  revokeDigitalMenuApi: (id: string) => void;
  connectTenantDigitalMenuApi: (apiKey?: string, secret?: string) => boolean;
  disconnectTenantDigitalMenuApi: () => void;

  // Superadmin & Domain Helpers
  isSuperadmin: boolean;
  setCurrentTenant: (tenant: Tenant | null) => void;
  resolveTenantByDomain: (domainStr: string) => Tenant | null;

  // Digital Menu API extra actions
  toggleDigitalMenuApiStatus: (id: string) => void;
  regenerateDigitalMenuApiKey: (id: string) => string;

  // Sound effects
  playSound: (soundType: 'beep' | 'success' | 'alert' | 'kot' | 'bell') => void;

  // Import / Export Helpers
  exportDataToCsv: (type: 'products' | 'customers' | 'orders' | 'purchases' | 'accounts') => void;
  importProductsFromCsv: (csvText: string) => { success: boolean; count: number; message: string };
  importCustomersFromCsv: (csvText: string) => { success: boolean; count: number; message: string };
  importCustomersFromData: (data: any[]) => { success: boolean; count: number; message: string };
  exportKhataToExcel: (mode?: string, customerId?: string) => void;
  recordKhataAdjustment: (customerId: string, amount: number, adjType?: string, reason?: string, notes?: string) => void;

  // SaaS Subscriptions & VAT
  currentSubscription: { planId: string; planName: string; expiryDate: string; isPro: boolean };
  upgradeSubscriptionPlan: (planId: string) => void;
  vatSettings: VatTaxSettings;
  updateVatSettings: (settings: Partial<VatTaxSettings>) => void;

  // Offline Sync State
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  pendingSyncCount: number;
  syncOfflineQueue: () => Promise<{ syncedOrders: number }>;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State from LocalStorage or Defaults
  const [businessType, setBusinessTypeState] = useState<BusinessType>(() => {
    return (localStorage.getItem('omnirestro_business_type') as BusinessType) || 'restaurant';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('omnirestro_language') as Language) || 'en';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Auth Users & Tenants
  const [allTenants, setAllTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('omnirestro_tenants');
    return saved ? JSON.parse(saved) : initialTenants;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('omnirestro_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('omnirestro_current_user');
    return saved ? JSON.parse(saved) : initialUsers[1]; // default to restro_admin
  });

  const currentTenant = allTenants.find((t) => t.id === currentUser.tenantId) || allTenants[0];

  // Core Datasets
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('omnirestro_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    const saved = localStorage.getItem('omnirestro_tables');
    return saved ? JSON.parse(saved) : initialTables;
  });

  const [reservations, setReservations] = useState<TableReservation[]>(() => {
    const saved = localStorage.getItem('omnirestro_reservations');
    return saved ? JSON.parse(saved) : initialReservations;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('omnirestro_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [customers, setCustomers] = useState<CustomerKhata[]>(() => {
    const saved = localStorage.getItem('omnirestro_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [suppliers, setSuppliers] = useState<SupplierParty[]>(() => {
    const saved = localStorage.getItem('omnirestro_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('omnirestro_quotations');
    return saved ? JSON.parse(saved) : initialQuotations;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('omnirestro_coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewayConfig[]>(() => {
    const saved = localStorage.getItem('omnirestro_gateways');
    return saved ? JSON.parse(saved) : initialPaymentGateways;
  });

  const [saasPackages, setSaaSPackages] = useState<SaaSPackage[]>(() => {
    const saved = localStorage.getItem('omnirestro_packages');
    return saved ? JSON.parse(saved) : initialSaaSPackages;
  });

  const [taxRules, setTaxRules] = useState<TaxRule[]>(() => {
    const saved = localStorage.getItem('omnirestro_taxes');
    return saved ? JSON.parse(saved) : initialTaxRules;
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('omnirestro_purchases');
    return saved ? JSON.parse(saved) : initialPurchases;
  });

  const [accounts, setAccounts] = useState<AccountTransaction[]>(() => {
    const saved = localStorage.getItem('omnirestro_accounts');
    return saved ? JSON.parse(saved) : initialAccounts;
  });

  const [domains, setDomains] = useState<Domain[]>(() => {
    const saved = localStorage.getItem('omnirestro_domains');
    return saved ? JSON.parse(saved) : initialDomains;
  });

  const [digitalMenuApis, setDigitalMenuApis] = useState<DigitalMenuAPI[]>(() => {
    const saved = localStorage.getItem('omnirestro_menu_apis');
    return saved ? JSON.parse(saved) : initialDigitalMenuApis;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('omnirestro_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [settings, setSettingsState] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('omnirestro_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerKhata | null>(null);
  const [selectedKhataCustomer, setSelectedKhataCustomer] = useState<CustomerKhata | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [heldCarts, setHeldCarts] = useState<{ id: string; name: string; items: CartItem[]; timestamp: number; table?: string }[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [activePrintModal, setActivePrintModal] = useState<{ order: Order; type: 'kot' | 'bill' | 'receipt' } | null>(null);
  const [activeSubdomain, setActiveSubdomain] = useState<string>('saffronspice');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('omnirestro_tenants', JSON.stringify(allTenants));
  }, [allTenants]);

  useEffect(() => {
    localStorage.setItem('omnirestro_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('omnirestro_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('omnirestro_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('omnirestro_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('omnirestro_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('omnirestro_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('omnirestro_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('omnirestro_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('omnirestro_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('omnirestro_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('omnirestro_gateways', JSON.stringify(paymentGateways));
  }, [paymentGateways]);

  useEffect(() => {
    localStorage.setItem('omnirestro_packages', JSON.stringify(saasPackages));
  }, [saasPackages]);

  useEffect(() => {
    localStorage.setItem('omnirestro_taxes', JSON.stringify(taxRules));
  }, [taxRules]);

  useEffect(() => {
    localStorage.setItem('omnirestro_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('omnirestro_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('omnirestro_domains', JSON.stringify(domains));
  }, [domains]);

  useEffect(() => {
    localStorage.setItem('omnirestro_menu_apis', JSON.stringify(digitalMenuApis));
  }, [digitalMenuApis]);

  useEffect(() => {
    localStorage.setItem('omnirestro_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('omnirestro_settings', JSON.stringify(settings));
  }, [settings]);

  // Online / Offline tracking
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filtered Products for current vertical & tenant
  const tenantProducts = products.filter((p) => {
    if (currentUser.role === 'superadmin') return p.businessType === businessType;
    return p.tenantId === currentUser.tenantId || !p.tenantId;
  });

  const categories = ['All', ...Array.from(new Set(tenantProducts.map((p) => p.category)))];

  const filteredProducts = tenantProducts.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const itemTotal = (item.unitPrice || 0) * item.quantity;
    const addonsTotal = (item.selectedAddons || []).reduce((a, b) => a + b.price, 0) * item.quantity;
    const itemDiscount = item.discountPercent ? ((itemTotal + addonsTotal) * item.discountPercent) / 100 : 0;
    return sum + (itemTotal + addonsTotal - itemDiscount);
  }, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'fixed') {
      cartDiscount = appliedCoupon.discountValue;
    } else {
      cartDiscount = (cartSubtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscountAmount && cartDiscount > appliedCoupon.maxDiscountAmount) {
        cartDiscount = appliedCoupon.maxDiscountAmount;
      }
    }
  }

  const activeTaxRate = taxRules.filter((r) => r.isActive && r.type === 'vat').reduce((sum, r) => sum + r.percentage, 0) || settings.taxRatePercent || 5.0;
  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const cartTax = Number(((taxableAmount * activeTaxRate) / 100).toFixed(2));
  const cartTotal = Number((taxableAmount + cartTax).toFixed(2));

  // Audit Logger Helper
  const logAudit = (action: string, module: string, details: string, entityId?: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      tenantId: currentUser.tenantId,
      tenantName: currentTenant?.name || 'Main Organization',
      userId: currentUser.id,
      username: currentUser.username,
      userName: currentUser.name,
      role: currentUser.role,
      action,
      module,
      details,
      timestamp: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      entityId,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 199)]);
  };

  // Translation Helper
  const t = (key: string, fallback?: string): string => {
    const translations: Record<Language, Record<string, string>> = {
      en: {
        dashboard: 'Dashboard',
        pos: 'POS & Food Order',
        orders: 'Orders Management',
        waiter_app: 'Waiter App',
        chef_app: 'Chef KDS Display',
        delivery_app: 'Delivery Dispatch',
        quotations: 'Quotations',
        tables: 'Tables & Booking',
        inventory: 'Menu Items & Stock',
        purchases: 'Purchases',
        parties: 'Customers & Suppliers',
        due_list: 'Due List & Khata',
        coupons: 'Coupons & Promos',
        accounts: 'Incomes & Expenses',
        transactions: 'Financial Ledger',
        vat_settings: 'VAT & Tax Rates',
        staff: 'Staff & Roles',
        subscriptions: 'SaaS Subscriptions',
        payment_gateways: '11+ Payment Gateways',
        reports: '13+ Analytics Reports',
        search_placeholder: 'Search delicious food, items, barcode...',
      },
      ml: {
        dashboard: 'ഡാഷ്‌ബോർഡ്',
        pos: 'ഫുഡ് ഓർഡർ പി.ഒ.എസ്',
        orders: 'ഓർഡർ മാനേജ്മെന്റ്',
        waiter_app: 'വെയിറ്റർ ആപ്പ്',
        chef_app: 'ഷെഫ് കിച്ചൻ ബോർഡ്',
        delivery_app: 'ഡെലിവറി',
        quotations: 'കൊട്ടേഷൻസ്',
        tables: 'ടേബിളുകൾ & ബുക്കിംഗ്',
        inventory: 'മെനു വിഭവങ്ങൾ & സ്റ്റോക്ക്',
        purchases: 'പർച്ചേസുകൾ',
        parties: 'പാർട്ടികൾ',
        due_list: 'ബാക്കി തുക & ഖാത്ത',
        coupons: 'കൂപ്പണുകൾ',
        accounts: 'വരവ് ചിലവ് കണക്കുകൾ',
        transactions: 'ലെഡ്ജർ ഇടപാടുകൾ',
        vat_settings: 'വാറ്റ് & നികുതി',
        staff: 'ജീവനക്കാർ',
        subscriptions: 'സബ്‌സ്‌ക്രിപ്ഷൻ',
        payment_gateways: 'പേയ്‌മെന്റ് ഗേറ്റ്‌വേകൾ',
        reports: '13+ അനലിറ്റിക്സ് റിപ്പോർട്ടുകൾ',
        search_placeholder: 'വിഭവങ്ങൾ, കോഡ് തിരയുക...',
      },
    };
    return translations[language]?.[key] || fallback || key;
  };

  // Auth & RBAC
  const login = async (username: string, password?: string): Promise<{ success: boolean; message: string }> => {
    const user = allUsers.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.isActive);
    if (user) {
      setCurrentUser(user);
      if (user.businessType) setBusinessTypeState(user.businessType);
      logAudit('LOGIN', 'Auth', `User ${user.name} logged in with role ${user.role.toUpperCase()}`);
      return { success: true, message: `Welcome back, ${user.name}!` };
    }
    return { success: false, message: 'Invalid credentials or inactive user account' };
  };

  const logout = () => {
    logAudit('LOGOUT', 'Auth', `User ${currentUser.name} logged out`);
    const defaultUser = allUsers.find((u) => u.role === 'admin') || allUsers[0];
    setCurrentUser(defaultUser);
  };

  const switchRoleQuick = (role: UserRole) => {
    const matchedUser = allUsers.find((u) => u.role === role) || {
      ...currentUser,
      role,
      name: `${role.toUpperCase()} User`,
    };
    setCurrentUser(matchedUser);
    logAudit('STATUS_CHANGE', 'RBAC', `Switched active role to ${role.toUpperCase()}`);
    // Auto route to dedicated interface if appropriate
    if (role === 'waiter') setActiveTab('waiter_app');
    else if (role === 'chef') setActiveTab('chef_app');
    else if (role === 'delivery_driver') setActiveTab('delivery_app');
  };

  const switchTenant = (tenantId: string) => {
    const tenant = allTenants.find((t) => t.id === tenantId);
    if (tenant) {
      const tenantAdmin = allUsers.find((u) => u.tenantId === tenantId) || {
        id: `usr-${tenantId}`,
        username: tenant.adminUsername,
        name: `${tenant.name} Manager`,
        role: 'admin' as UserRole,
        tenantId: tenant.id,
        tenantName: tenant.name,
        isActive: true,
      };
      setCurrentUser(tenantAdmin);
      setBusinessTypeState(tenant.businessVertical);
      logAudit('STATUS_CHANGE', 'Tenant', `Switched active tenant to ${tenant.name}`);
    }
  };

  const hasPermission = (module: ModulePermission, action: PermissionAction): boolean => {
    if (currentUser.role === 'superadmin') return true;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'manager') return action !== 'backup' && action !== 'delete';
    if (currentUser.role === 'waiter') return module === 'pos' || module === 'tables' || module === 'orders' || module === 'waiter_app';
    if (currentUser.role === 'chef') return module === 'chef_app' || module === 'orders';
    if (currentUser.role === 'delivery_driver') return module === 'delivery_app' || module === 'orders';
    if (currentUser.role === 'cashier') return module === 'pos' || module === 'orders' || module === 'customers' || module === 'quotations';
    return true;
  };

  const setBusinessType = (type: BusinessType) => {
    setBusinessTypeState(type);
    localStorage.setItem('omnirestro_business_type', type);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, variantId?: string, addonIds?: string[], notes?: string) => {
    const selectedVariant = product.variants?.find((v) => v.id === variantId);
    const selectedAddons = (product.addons || [])
      .filter((a) => addonIds?.includes(a.id))
      .map((a) => ({ id: a.id, name: a.name, price: a.price }));
    const unitPrice = selectedVariant ? selectedVariant.price : product.price;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id && item.selectedVariant?.id === variantId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (notes) updated[existingIndex].notes = notes;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          unitPrice,
          selectedVariant,
          selectedAddons,
          notes,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)));
  };

  const setItemDiscount = (productId: string, discountPercent: number) => {
    setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, discountPercent } : item)));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Hold / Resume Cart
  const holdCurrentCart = (name?: string) => {
    if (cart.length === 0) return;
    const holdName = name || (selectedTableNumber ? `Table ${selectedTableNumber}` : `Cart #${heldCarts.length + 1}`);
    const held = {
      id: 'held-' + Date.now(),
      name: holdName,
      items: [...cart],
      timestamp: Date.now(),
      table: selectedTableNumber,
    };
    setHeldCarts((prev) => [held, ...prev]);
    clearCart();
    setSelectedTableNumber('');
  };

  const resumeCart = (heldId: string) => {
    const target = heldCarts.find((h) => h.id === heldId);
    if (target) {
      setCart(target.items);
      if (target.table) setSelectedTableNumber(target.table);
      setHeldCarts((prev) => prev.filter((h) => h.id !== heldId));
    }
  };

  const deleteHeldCart = (heldId: string) => {
    setHeldCarts((prev) => prev.filter((h) => h.id !== heldId));
  };

  // Coupon Engine
  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === normalized && c.isActive);
    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSubtotal < coupon.minOrderAmount) {
      return { success: false, message: `Minimum food order amount of $${coupon.minOrderAmount} required.` };
    }
    if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
      return { success: false, message: 'This coupon has reached its maximum usage limit.' };
    }
    setAppliedCoupon(coupon);
    let disc = coupon.discountType === 'fixed' ? coupon.discountValue : (cartSubtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount && disc > coupon.maxDiscountAmount) disc = coupon.maxDiscountAmount;
    return { success: true, message: `Coupon ${coupon.code} applied! Saved $${disc.toFixed(2)}`, discountAmount: disc };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Checkout Completion
  const completeCheckout = (
    paymentMethod: PaymentMethod,
    cashTendered?: number,
    notes?: string,
    splitDetails?: SplitPaymentDetails,
    gatewayName?: string
  ): Order => {
    const orderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const kotNum = `KOT-${Math.floor(2000 + Math.random() * 8000)}`;
    const now = new Date();

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      orderNumber: orderNum,
      kotNumber: kotNum,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      type: orderType,
      tableNumber: orderType === 'dine-in' ? selectedTableNumber : undefined,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Guest',
      customerPhone: selectedCustomer ? selectedCustomer.phone : undefined,
      waiterId: currentUser.role === 'waiter' ? currentUser.id : undefined,
      waiterName: currentUser.role === 'waiter' ? currentUser.name : undefined,
      items: [...cart],
      subtotal: cartSubtotal,
      discountAmount: cartDiscount,
      couponCode: appliedCoupon?.code,
      taxAmount: cartTax,
      total: cartTotal,
      paymentMethod,
      paymentGateway: gatewayName,
      paymentStatus: paymentMethod === 'khata' ? 'unpaid' : 'paid',
      splitDetails,
      status: 'paid',
      cashTendered: cashTendered || cartTotal,
      changeAmount: cashTendered ? Math.max(0, cashTendered - cartTotal) : 0,
      notes,
      kotPrinted: true,
      receiptPrinted: true,
      preparationStartedAt: Date.now(),
      businessType,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);

    // If Khata (Customer Credit), record credit transaction
    if (paymentMethod === 'khata' && selectedCustomer) {
      recordKhataCredit(selectedCustomer.id, cartTotal, `Food Order #${orderNum}`, newOrder.id, notes);
    }

    // If dine-in table, release or update table
    if (orderType === 'dine-in' && selectedTableNumber) {
      const matchedTable = tables.find((t) => t.number === selectedTableNumber);
      if (matchedTable) {
        updateTableStatus(matchedTable.id, 'available');
      }
    }

    // Auto record in Accounts Income
    const newTx: AccountTransaction = {
      id: 'act-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      date: now.toISOString().split('T')[0],
      type: 'income',
      category: 'Sales Income',
      description: `POS Order #${orderNum} (${paymentMethod.toUpperCase()})`,
      amount: cartTotal,
      paymentMethod: paymentMethod === 'khata' ? 'credit' : paymentMethod === 'upi' ? 'upi' : paymentMethod === 'card' ? 'card' : 'cash',
      createdBy: currentUser.name,
      createdAt: now.toLocaleString(),
    };
    setAccounts((prev) => [newTx, ...prev]);

    // Deduct stock for items
    cart.forEach((item) => {
      adjustStock(item.product.id, -item.quantity, `Sale #${orderNum}`);
    });

    // Increment coupon usage
    if (appliedCoupon) {
      setCoupons((prev) => prev.map((c) => (c.id === appliedCoupon.id ? { ...c, usageCount: c.usageCount + 1 } : c)));
    }

    logAudit('SALE', 'Food Ordering', `Completed checkout for ${newOrder.orderNumber} - Total: $${cartTotal}`);

    // Confetti celebration
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }

    clearCart();
    setSelectedTableNumber('');
    setSelectedCustomer(null);

    // If auto-print enabled, trigger modal
    if (settings.autoPrintReceipt) {
      setActivePrintModal({ order: newOrder, type: 'receipt' });
    }

    return newOrder;
  };

  // 3-Step Bill Printing & KOT Operations
  const openPrintModal = (order: Order, type: 'kot' | 'bill' | 'receipt') => {
    setActivePrintModal({ order, type });
  };

  const closePrintModal = () => {
    setActivePrintModal(null);
  };

  const printKotTicket = (order: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, kotPrinted: true } : o)));
    logAudit('KOT_GENERATED', 'Kitchen KDS', `Printed KOT Ticket for Order #${order.orderNumber}`);
  };

  const printPreBillCheck = (order: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, billPrinted: true } : o)));
    logAudit('BILL_PRINTED', 'POS Billing', `Printed Pre-Bill Check for Order #${order.orderNumber}`);
  };

  const printThermalReceipt = (order: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, receiptPrinted: true } : o)));
    logAudit('RECEIPT_PRINTED', 'POS Billing', `Printed Paid Thermal Receipt for Order #${order.orderNumber}`);
  };

  // Waiter & Chef Operations
  const sendKotFromWaiter = (tableNumber: string, items: CartItem[], guestCount = 2, notes?: string): Order => {
    const orderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const kotNum = `KOT-${Math.floor(2000 + Math.random() * 8000)}`;
    const now = new Date();

    const subtotal = items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
    const tax = Number(((subtotal * 5) / 100).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      orderNumber: orderNum,
      kotNumber: kotNum,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      type: 'dine-in',
      tableNumber,
      customerName: `Table ${tableNumber} Guest`,
      waiterId: currentUser.id,
      waiterName: currentUser.name,
      items: [...items],
      subtotal,
      discountAmount: 0,
      taxAmount: tax,
      total,
      paymentMethod: 'cash',
      status: 'cooking',
      kotPrinted: true,
      preparationStartedAt: Date.now(),
      notes,
      businessType: 'restaurant',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update table status to occupied
    const matchedTable = tables.find((t) => t.number === tableNumber);
    if (matchedTable) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === matchedTable.id
            ? { ...t, status: 'occupied', currentOrderId: newOrder.id, currentTotal: total, guestCount, occupiedSince: 'Just now' }
            : t
        )
      );
    }

    logAudit('KOT_GENERATED', 'Waiter App', `Waiter ${currentUser.name} fired KOT ${kotNum} for Table ${tableNumber}`);
    return newOrder;
  };

  const bumpChefOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updates: Partial<Order> = { status: nextStatus };
          if (nextStatus === 'ready') updates.preparationReadyAt = Date.now();
          return { ...o, ...updates };
        }
        return o;
      })
    );
    logAudit('STATUS_CHANGE', 'Chef KDS', `Order #${orderId} moved to ${nextStatus.toUpperCase()}`);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    logAudit('STATUS_CHANGE', 'Orders', `Order #${orderId} updated to ${status}`);
  };

  const updateDeliveryStatus = (orderId: string, status: Order['deliveryStatus'], driverId?: string, driverName?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            deliveryStatus: status,
            deliveryDriverId: driverId || o.deliveryDriverId,
            deliveryDriverName: driverName || o.deliveryDriverName,
            status: status === 'delivered' ? 'delivered' : o.status,
          };
        }
        return o;
      })
    );
    logAudit('STATUS_CHANGE', 'Delivery', `Delivery Order #${orderId} marked as ${status}`);
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled', notes: reason ? `${o.notes || ''} [Cancelled: ${reason}]` : o.notes } : o)));
    logAudit('STATUS_CHANGE', 'Orders', `Order #${orderId} was CANCELLED. Reason: ${reason || 'None'}`);
  };

  const refundOrder = (orderId: string, amount?: number, reason?: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'refunded', paymentStatus: 'refunded' } : o)));
    logAudit('SALE', 'Orders', `Refunded Order #${orderId} for amount $${amount || 'Full'}. Reason: ${reason || 'None'}`);
  };

  const createCallInOrder = (orderData: Partial<Order>): Order => {
    const orderNum = `ORD-TEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      orderNumber: orderNum,
      kotNumber: `KOT-${Math.floor(2000 + Math.random() * 8000)}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      type: orderData.type || 'takeaway',
      customerName: orderData.customerName || 'Phone Order Customer',
      customerPhone: orderData.customerPhone || '',
      customerAddress: orderData.customerAddress,
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      discountAmount: orderData.discountAmount || 0,
      taxAmount: orderData.taxAmount || 0,
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'cash',
      status: 'cooking',
      kotPrinted: true,
      preparationStartedAt: Date.now(),
      businessType: 'restaurant',
      ...orderData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    logAudit('SALE', 'Phone Orders', `Received Call-In Food Order #${orderNum}`);
    return newOrder;
  };

  // Table Management & Table Reservations
  const addTable = (table: Omit<RestaurantTable, 'id' | 'tenantId'>) => {
    const newTable: RestaurantTable = {
      ...table,
      id: 'tbl-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
    };
    setTables((prev) => [...prev, newTable]);
    logAudit('CREATE', 'Tables', `Added table ${table.number} (${table.name})`);
  };

  const updateTable = (id: string, updates: Partial<RestaurantTable>) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    logAudit('UPDATE', 'Tables', `Updated table properties`);
  };

  const deleteTable = (id: string) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
    logAudit('DELETE', 'Tables', `Deleted table #${id}`);
  };

  const updateTableStatus = (id: string, status: RestaurantTable['status'], orderTotal?: number) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              currentTotal: status === 'available' ? undefined : orderTotal || t.currentTotal,
              currentOrderId: status === 'available' ? undefined : t.currentOrderId,
              occupiedSince: status === 'available' ? undefined : t.occupiedSince || 'Just now',
            }
          : t
      )
    );
  };

  const assignTableOrder = (tableNumber: string, orderId: string, total: number) => {
    setTables((prev) =>
      prev.map((t) =>
        t.number === tableNumber
          ? { ...t, status: 'occupied', currentOrderId: orderId, currentTotal: total, occupiedSince: 'Just now' }
          : t
      )
    );
  };

  const addReservation = (data: Omit<TableReservation, 'id' | 'reservationNumber' | 'createdAt' | 'tenantId'>) => {
    const resNum = `RES-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRes: TableReservation = {
      ...data,
      id: 'res-' + Date.now(),
      reservationNumber: resNum,
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setReservations((prev) => [newRes, ...prev]);

    // Mark table as reserved
    if (data.tableId) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === data.tableId
            ? { ...t, status: 'reserved', reservedTime: data.timeSlot, guestCount: data.guestCount }
            : t
        )
      );
    }
    logAudit('RESERVATION_CREATED', 'Table Booking', `Booked table ${data.tableNumber} for ${data.customerName}`);
  };

  const updateReservation = (id: string, updates: Partial<TableReservation>) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    logAudit('UPDATE', 'Table Booking', `Updated reservation #${id}`);
  };

  const seatReservation = (reservationId: string) => {
    const target = reservations.find((r) => r.id === reservationId);
    if (!target) return;
    setReservations((prev) => prev.map((r) => (r.id === reservationId ? { ...r, status: 'seated' } : r)));
    if (target.tableId) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === target.tableId
            ? { ...t, status: 'occupied', guestCount: target.guestCount, occupiedSince: 'Seated now' }
            : t
        )
      );
    }
    logAudit('RESERVATION_SEATED', 'Table Booking', `Seated guest ${target.customerName} on Table ${target.tableNumber}`);
  };

  const cancelReservation = (reservationId: string) => {
    const target = reservations.find((r) => r.id === reservationId);
    if (!target) return;
    setReservations((prev) => prev.map((r) => (r.id === reservationId ? { ...r, status: 'cancelled' } : r)));
    if (target.tableId) {
      setTables((prev) => prev.map((t) => (t.id === target.tableId ? { ...t, status: 'available', reservedTime: undefined } : t)));
    }
    logAudit('STATUS_CHANGE', 'Table Booking', `Cancelled reservation for ${target.customerName}`);
  };

  // Quotations System (Convert to Sale)
  const addQuotation = (data: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt' | 'tenantId' | 'createdBy'>) => {
    const quotNum = `QUOT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newQuot: Quotation = {
      ...data,
      id: 'quot-' + Date.now(),
      quotationNumber: quotNum,
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      createdBy: currentUser.name,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setQuotations((prev) => [newQuot, ...prev]);
    logAudit('QUOTATION_CREATED', 'Quotations', `Created formal Quotation #${quotNum} for ${data.customerName}`);
  };

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuotation = (id: string) => {
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    logAudit('DELETE', 'Quotations', `Deleted quotation #${id}`);
  };

  const convertQuotationToOrder = (quotationId: string): Order => {
    const target = quotations.find((q) => q.id === quotationId);
    if (!target) throw new Error('Quotation not found');

    const orderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();

    // Map quotation items to CartItems
    const cartItems: CartItem[] = target.items.map((item) => {
      const matchedProd = products.find((p) => p.name.toLowerCase() === item.name.toLowerCase()) || {
        id: 'prod-custom-' + Date.now(),
        name: item.name,
        sku: 'CUSTOM-ITEM',
        barcode: '000000',
        category: 'Catering / Quotation',
        unit: 'serving',
        stock: 999,
        minStockAlert: 0,
        price: item.unitPrice,
        businessType: 'restaurant' as BusinessType,
      };
      return {
        product: matchedProd,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      };
    });

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      tenantId: target.tenantId,
      orderNumber: orderNum,
      kotNumber: `KOT-${Math.floor(2000 + Math.random() * 8000)}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      type: 'takeaway',
      customerName: target.customerName,
      customerPhone: target.customerPhone,
      items: cartItems,
      subtotal: target.subtotal,
      discountAmount: target.discountAmount,
      taxAmount: target.taxAmount,
      total: target.totalAmount,
      paymentMethod: 'cash',
      status: 'confirmed',
      notes: `Converted from Quotation #${target.quotationNumber}. ${target.notes || ''}`,
      kotPrinted: true,
      businessType: 'restaurant',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setQuotations((prev) => prev.map((q) => (q.id === quotationId ? { ...q, status: 'converted', convertedOrderId: newOrder.id } : q)));
    logAudit('QUOTATION_CONVERTED', 'Quotations', `Converted Quotation #${target.quotationNumber} into Active Sale #${orderNum}`);
    return newOrder;
  };

  // Coupons CRUD
  const addCoupon = (data: Omit<Coupon, 'id' | 'tenantId' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...data,
      id: 'cpn-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      usageCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    logAudit('COUPON_CREATED', 'Coupons', `Created promo code ${data.code}`);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    logAudit('DELETE', 'Coupons', `Deleted promo code #${id}`);
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  // Customers & Khata Ledger
  const addCustomer = (customerData: Omit<CustomerKhata, 'id' | 'transactions' | 'netBalance' | 'lastActivity' | 'isActive'> & { openingBalance?: number; notes?: string }) => {
    const opening = customerData.openingBalance || 0;
    const initialTx: KhataTransaction[] = opening > 0
      ? [
          {
            id: 'tx-' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            type: 'opening_balance',
            amount: opening,
            creditAmount: opening,
            description: 'Opening Due Balance',
            balanceAfter: opening,
            recordedBy: currentUser.name,
          },
        ]
      : [];

    const newCustomer: CustomerKhata = {
      ...customerData,
      id: 'cust-' + Date.now(),
      customerId: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      netBalance: opening,
      totalCredit: opening,
      totalPayments: 0,
      totalPurchases: 0,
      transactions: initialTx,
      lastActivity: 'Just added',
      isActive: true,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    logAudit('CREATE', 'Parties', `Added customer party ${customerData.name}`);
  };

  const updateCustomer = (id: string, updates: Partial<CustomerKhata>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    logAudit('UPDATE', 'Parties', `Updated customer #${id}`);
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    logAudit('DELETE', 'Parties', `Deleted customer #${id}`);
  };

  const archiveCustomer = (id: string) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'archived' } : c)));
  };

  const restoreCustomer = (id: string) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'active' } : c)));
  };

  const toggleCustomerStatus = (id: string) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  const disableKhata = (customerId: string) => {
    setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, khataStatus: 'disabled' } : c)));
  };

  const enableKhata = (customerId: string) => {
    setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, khataStatus: 'enabled' } : c)));
  };

  const recordKhataCredit = (customerId: string, amount: number, description: string, billId?: string, notes?: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newBalance = c.netBalance + amount;
          const newTx: KhataTransaction = {
            id: 'tx-' + Date.now(),
            customerId,
            tenantId: c.tenantId,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            type: 'credit',
            amount,
            creditAmount: amount,
            description,
            billId,
            balanceAfter: newBalance,
            recordedBy: currentUser.name,
            notes,
          };
          return {
            ...c,
            netBalance: newBalance,
            totalCredit: (c.totalCredit || 0) + amount,
            lastActivity: 'Credit added',
            transactions: [newTx, ...c.transactions],
          };
        }
        return c;
      })
    );
    logAudit('CREDIT', 'Khata Book', `Added credit of $${amount} to customer #${customerId}`);
  };

  const recordKhataPayment = (customerId: string, amount: number, description: string, paymentMode = 'cash', reference?: string, notes?: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newBalance = Math.max(0, c.netBalance - amount);
          const newTx: KhataTransaction = {
            id: 'tx-' + Date.now(),
            customerId,
            tenantId: c.tenantId,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            type: 'payment',
            amount,
            paymentAmount: amount,
            description,
            paymentMode,
            reference,
            balanceAfter: newBalance,
            recordedBy: currentUser.name,
            notes,
          };
          return {
            ...c,
            netBalance: newBalance,
            totalPayments: (c.totalPayments || 0) + amount,
            lastActivity: 'Payment received',
            transactions: [newTx, ...c.transactions],
          };
        }
        return c;
      })
    );

    // Auto record in accounts
    const newTx: AccountTransaction = {
      id: 'act-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      date: new Date().toISOString().split('T')[0],
      type: 'income',
      category: 'Credit Collection',
      description: `Khata Payment Collection from Customer (${paymentMode.toUpperCase()})`,
      amount,
      paymentMethod: paymentMode === 'upi' ? 'upi' : paymentMode === 'card' ? 'card' : 'cash',
      createdBy: currentUser.name,
      createdAt: new Date().toLocaleString(),
    };
    setAccounts((prev) => [newTx, ...prev]);

    logAudit('PAYMENT', 'Khata Book', `Collected payment of $${amount} from customer #${customerId}`);
  };

  // Suppliers CRUD & Payments
  const addSupplier = (data: Omit<SupplierParty, 'id' | 'createdAt' | 'tenantId'>) => {
    const newSupplier: SupplierParty = {
      ...data,
      id: 'sup-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    logAudit('CREATE', 'Parties', `Added supplier party ${data.companyName}`);
  };

  const updateSupplier = (id: string, updates: Partial<SupplierParty>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    logAudit('UPDATE', 'Parties', `Updated supplier #${id}`);
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    logAudit('DELETE', 'Parties', `Deleted supplier #${id}`);
  };

  const recordSupplierPayment = (supplierId: string, amount: number, paymentMode = 'bank', notes?: string) => {
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === supplierId) {
          const newBalance = Math.max(0, s.netBalance - amount);
          return {
            ...s,
            netBalance: newBalance,
            totalPaid: (s.totalPaid || 0) + amount,
          };
        }
        return s;
      })
    );

    // Record in expense accounts
    const newTx: AccountTransaction = {
      id: 'act-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      category: 'Purchase Expense',
      description: `Payment to Supplier #${supplierId} (${paymentMode.toUpperCase()})`,
      amount,
      paymentMethod: paymentMode === 'upi' ? 'upi' : paymentMode === 'card' ? 'card' : paymentMode === 'bank' ? 'bank' : 'cash',
      createdBy: currentUser.name,
      createdAt: new Date().toLocaleString(),
    };
    setAccounts((prev) => [newTx, ...prev]);
    logAudit('PAYMENT', 'Purchases', `Paid $${amount} to supplier #${supplierId}`);
  };

  // 11+ Payment Gateways
  const updatePaymentGateway = (id: PaymentGatewayId, updates: Partial<PaymentGatewayConfig>) => {
    setPaymentGateways((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    logAudit('UPDATE', 'Payment Gateways', `Updated gateway configuration for ${id.toUpperCase()}`);
  };

  const togglePaymentGateway = (id: PaymentGatewayId) => {
    setPaymentGateways((prev) => prev.map((g) => (g.id === id ? { ...g, isEnabled: !g.isEnabled } : g)));
    logAudit('STATUS_CHANGE', 'Payment Gateways', `Toggled gateway ${id.toUpperCase()}`);
  };

  // SaaS Packages & Subscriptions
  const upgradeSaaSPackage = (packageSlug: 'starter' | 'growth' | 'professional' | 'enterprise') => {
    const pkg = saasPackages.find((p) => p.slug === packageSlug);
    if (!pkg) return;
    const planName = pkg.name.replace(' Plan', '') as 'Starter' | 'Growth' | 'Professional' | 'Enterprise';
    if (currentUser.tenantId) {
      setAllTenants((prev) => prev.map((t) => (t.id === currentUser.tenantId ? { ...t, plan: planName } : t)));
    }
    logAudit('UPDATE', 'SaaS Subscriptions', `Upgraded restaurant subscription to ${pkg.name}`);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const addSaaSPackage = (data: Omit<SaaSPackage, 'id'>) => {
    const newPkg: SaaSPackage = { ...data, id: 'pkg-' + Date.now() };
    setSaaSPackages((prev) => [...prev, newPkg]);
    logAudit('CREATE', 'SaaS Subscriptions', `Created new SaaS pricing package ${data.name}`);
  };

  const updateSaaSPackage = (id: string, updates: Partial<SaaSPackage>) => {
    setSaaSPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  // VAT & Tax Rules
  const addTaxRule = (data: Omit<TaxRule, 'id' | 'tenantId'>) => {
    const newTax: TaxRule = {
      ...data,
      id: 'tax-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
    };
    setTaxRules((prev) => [...prev, newTax]);
    logAudit('CREATE', 'VAT & Tax', `Created tax rule ${data.name} (${data.percentage}%)`);
  };

  const updateTaxRule = (id: string, updates: Partial<TaxRule>) => {
    setTaxRules((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTaxRule = (id: string) => {
    setTaxRules((prev) => prev.filter((t) => t.id !== id));
    logAudit('DELETE', 'VAT & Tax', `Deleted tax rule #${id}`);
  };

  const toggleTaxRule = (id: string) => {
    setTaxRules((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)));
  };

  // Products CRUD
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: 'prod-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
    };
    setProducts((prev) => [newProd, ...prev]);
    logAudit('CREATE', 'Inventory', `Added food item ${prodData.name}`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    logAudit('UPDATE', 'Inventory', `Updated product #${id}`);
  };

  const adjustStock = (id: string, amount: number, reason?: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + amount);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logAudit('DELETE', 'Inventory', `Deleted product #${id}`);
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive, isAvailable: !p.isActive } : p)));
  };

  // Purchases CRUD
  const addPurchase = (data: Omit<Purchase, 'id' | 'createdAt' | 'tenantId' | 'createdBy'>) => {
    const newPurchase: Purchase = {
      ...data,
      id: 'pur-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      createdBy: currentUser.name,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setPurchases((prev) => [newPurchase, ...prev]);

    // If pending amount > 0, update supplier netBalance
    if (data.supplierId && data.pendingAmount > 0) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === data.supplierId ? { ...s, netBalance: s.netBalance + data.pendingAmount } : s))
      );
    }

    logAudit('PURCHASE', 'Purchases', `Recorded purchase #${data.invoiceNumber} - Total: $${data.totalAmount}`);
  };

  const updatePurchase = (id: string, updates: Partial<Purchase>) => {
    setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePurchase = (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  };

  // Accounts CRUD
  const addAccountTransaction = (data: Omit<AccountTransaction, 'id' | 'createdAt' | 'tenantId' | 'createdBy'>) => {
    const newAcc: AccountTransaction = {
      ...data,
      id: 'act-' + Date.now(),
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      createdBy: currentUser.name,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setAccounts((prev) => [newAcc, ...prev]);
    logAudit('CREATE', 'Accounts', `Added ${data.type} transaction of $${data.amount} (${data.category})`);
  };

  const updateAccountTransaction = (id: string, updates: Partial<AccountTransaction>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAccountTransaction = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  // Settings & Printer
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...updates }));
    logAudit('UPDATE', 'Settings', `Updated store configuration settings`);
  };

  const updatePrinterConfig = (updates: Partial<PrinterConfig>) => {
    setSettingsState((prev) => ({
      ...prev,
      printer: { ...prev.printer, ...updates },
    }));
    logAudit('UPDATE', 'Settings', `Updated thermal printer configurations`);
  };

  const testPrinterConnection = async (type: 'bluetooth' | 'wifi' | 'usb'): Promise<{ success: boolean; message: string }> => {
    // Simulate printer ping
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      message: `Successfully connected to ${settings.printer.printerName || 'POS Printer'} via ${type.toUpperCase()} interface (Port Ready).`,
    };
  };

  // Domains
  const simulateDomainResolution = (subdomainOrDomain: string) => {
    setActiveSubdomain(subdomainOrDomain);
    const matchedDomain = domains.find((d) => d.subdomain === subdomainOrDomain || d.domain === subdomainOrDomain);
    if (matchedDomain) {
      const tenant = allTenants.find((t) => t.id === matchedDomain.tenantId);
      if (tenant) switchTenant(tenant.id);
    }
  };

  const addDomain = (data: Omit<Domain, 'id' | 'createdAt'>) => {
    const newDom: Domain = {
      ...data,
      id: 'dom-' + Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 10),
    };
    setDomains((prev) => [...prev, newDom]);
    logAudit('CREATE', 'Domains', `Added domain mapping ${data.domain}`);
  };

  const deleteDomain = (id: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
  };

  // Tenants
  const addTenant = (data: Partial<Tenant> & { adminUsername: string; adminPassword?: string }) => {
    const tenantId = 'tenant-' + Date.now();
    const newTenant: Tenant = {
      id: tenantId,
      name: data.name || 'New Restaurant',
      businessVertical: data.businessVertical || 'restaurant',
      subdomain: data.subdomain || 'newrestro',
      customDomain: data.customDomain,
      adminId: 'usr-' + tenantId,
      adminUsername: data.adminUsername,
      adminEmail: data.adminEmail || 'admin@restaurant.com',
      storePhone: data.storePhone || '+1 555-0000',
      city: data.city || 'San Francisco',
      gstNumber: data.gstNumber,
      plan: data.plan || 'Starter',
      isActive: true,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 10),
    };

    const newAdmin: User = {
      id: 'usr-' + tenantId,
      username: data.adminUsername,
      name: `${data.name} Manager`,
      role: 'admin',
      tenantId: tenantId,
      tenantName: newTenant.name,
      email: data.adminEmail,
      phone: data.storePhone,
      businessType: data.businessVertical || 'restaurant',
      isActive: true,
    };

    setAllTenants((prev) => [newTenant, ...prev]);
    setAllUsers((prev) => [newAdmin, ...prev]);
    logAudit('CREATE', 'Superadmin', `Created new tenant restaurant: ${newTenant.name}`);
  };

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    setAllTenants((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTenant = (id: string) => {
    setAllTenants((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTenantStatus = (id: string) => {
    setAllTenants((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)));
  };

  const changeTenantVertical = (id: string, vertical: BusinessType) => {
    setAllTenants((prev) => prev.map((t) => (t.id === id ? { ...t, businessVertical: vertical } : t)));
  };

  // Users & Staff
  const addAdminUser = (data: Partial<User> & { password?: string }) => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      username: data.username || 'admin_user',
      name: data.name || 'System Admin',
      role: 'superadmin',
      email: data.email,
      phone: data.phone,
      isActive: true,
      status: 'active',
      avatarColor: 'bg-amber-600',
    };
    setAllUsers((prev) => [...prev, newUser]);
  };

  const updateAdminUser = (id: string, updates: Partial<User>) => {
    setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteAdminUser = (id: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleAdminStatus = (id: string, status?: UserStatus) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: status || (u.isActive ? 'disabled' : 'active'), isActive: !u.isActive } : u))
    );
  };

  const resetAdminPassword = (id: string, newPassword: string) => {
    setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, password: newPassword } : u)));
    logAudit('PASSWORD_RESET', 'Security', `Reset password for user #${id}`);
  };

  const addTenantUser = (data: Partial<User> & { password?: string }) => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      username: data.username || 'staff_member',
      name: data.name || 'Staff Member',
      role: data.role || 'waiter',
      tenantId: currentUser.tenantId || 'tenant-resto-01',
      tenantName: currentTenant?.name,
      email: data.email,
      phone: data.phone,
      isActive: true,
      status: 'active',
      avatarColor: 'bg-indigo-600',
      assignedTables: data.assignedTables,
      vehicleNumber: data.vehicleNumber,
    };
    setAllUsers((prev) => [...prev, newUser]);
    logAudit('CREATE', 'Staff Management', `Added staff user ${newUser.name} with role ${newUser.role}`);
  };

  const updateTenantUser = (id: string, updates: Partial<User>) => {
    setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    logAudit('UPDATE', 'Staff Management', `Updated staff user #${id}`);
  };

  const deleteTenantUser = (id: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
    logAudit('DELETE', 'Staff Management', `Deleted staff user #${id}`);
  };

  const toggleTenantUserStatus = (id: string) => {
    setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)));
  };

  // Digital Menu API
  const createDigitalMenuApi = (data: Omit<DigitalMenuAPI, 'id' | 'createdAt' | 'totalCallsCount'>) => {
    const newApi: DigitalMenuAPI = {
      ...data,
      id: 'api-' + Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      totalCallsCount: 0,
    };
    setDigitalMenuApis((prev) => [newApi, ...prev]);
    logAudit('API_KEY_CREATE', 'API Management', `Generated Digital Menu API Key for ${data.appName}`);
  };

  const revokeDigitalMenuApi = (id: string) => {
    setDigitalMenuApis((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'revoked' } : a)));
    logAudit('API_KEY_REVOKE', 'API Management', `Revoked API Key #${id}`);
  };

  // Barcode Scanner handler
  const handleScannedBarcode = (barcode: string) => {
    const item = products.find((p) => p.barcode === barcode || p.sku.toLowerCase() === barcode.toLowerCase());
    if (item) {
      addToCart(item, 1);
      return { success: true, item, message: `Added ${item.name} to order.` };
    }
    return { success: false, message: `No food item found with barcode / SKU "${barcode}"` };
  };

  // Offline Sync
  const syncOfflineQueue = async (): Promise<{ syncedOrders: number }> => {
    await new Promise((r) => setTimeout(r, 800));
    setPendingSyncCount(0);
    return { syncedOrders: 3 };
  };

  // Backup & Factory Reset
  const createFullBackupZip = async (): Promise<Blob> => {
    const zip = new JSZip();
    const backupPayload = {
      backupDate: new Date().toISOString(),
      version: '2.0.0-saas',
      tenant: currentTenant,
      products,
      tables,
      reservations,
      orders,
      customers,
      suppliers,
      quotations,
      coupons,
      paymentGateways,
      saasPackages,
      taxRules,
      purchases,
      accounts,
      settings,
      auditLogs,
    };
    zip.file('omnirestro-full-backup.json', JSON.stringify(backupPayload, null, 2));
    logAudit('BACKUP', 'Backup', 'Created full restaurant system backup archive');
    return await zip.generateAsync({ type: 'blob' });
  };

  const restoreFromBackupData = async (data: any): Promise<{ success: boolean; message: string }> => {
    try {
      if (data.products) setProducts(data.products);
      if (data.tables) setTables(data.tables);
      if (data.reservations) setReservations(data.reservations);
      if (data.orders) setOrders(data.orders);
      if (data.customers) setCustomers(data.customers);
      if (data.suppliers) setSuppliers(data.suppliers);
      if (data.quotations) setQuotations(data.quotations);
      if (data.coupons) setCoupons(data.coupons);
      if (data.paymentGateways) setPaymentGateways(data.paymentGateways);
      if (data.taxRules) setTaxRules(data.taxRules);
      if (data.purchases) setPurchases(data.purchases);
      if (data.accounts) setAccounts(data.accounts);
      if (data.settings) setSettingsState(data.settings);
      logAudit('RESTORE', 'Backup', 'Restored system database from backup file');
      return { success: true, message: 'All database modules and records successfully restored!' };
    } catch (err: any) {
      return { success: false, message: `Restore failed: ${err.message}` };
    }
  };

  const restoreFromZip = async (file: File): Promise<{ success: boolean; message: string }> => {
    try {
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(file);
      const jsonFile = unzipped.file('omnirestro-full-backup.json') || Object.values(unzipped.files)[0];
      if (!jsonFile) {
        return { success: false, message: 'No backup JSON data found in the ZIP archive.' };
      }
      const text = await jsonFile.async('text');
      const data = JSON.parse(text);
      return await restoreFromBackupData(data);
    } catch (err: any) {
      return { success: false, message: `Failed reading zip backup: ${err.message}` };
    }
  };

  const connectTenantDigitalMenuApi = (apiKey?: string, secret?: string): boolean => {
    if (apiKey) {
      updateSettings({
        digitalMenuApiKey: apiKey,
        digitalMenuApiSecret: secret || '',
        digitalMenuConnected: true,
      });
      logAudit('CREATE', 'Digital Menu API', `Connected digital menu public API (${apiKey.substring(0, 10)}...)`);
      return true;
    }
    return false;
  };

  const disconnectTenantDigitalMenuApi = () => {
    updateSettings({
      digitalMenuApiKey: '',
      digitalMenuApiSecret: '',
      digitalMenuConnected: false,
    });
    logAudit('DELETE', 'Digital Menu API', 'Disconnected digital menu public API integration');
  };

  const resetToFactoryDefaults = () => {
    localStorage.clear();
    setProducts(initialProducts);
    setTables(initialTables);
    setReservations(initialReservations);
    setOrders(initialOrders);
    setCustomers(initialCustomers);
    setSuppliers(initialSuppliers);
    setQuotations(initialQuotations);
    setCoupons(initialCoupons);
    setPaymentGateways(initialPaymentGateways);
    setSaaSPackages(initialSaaSPackages);
    setTaxRules(initialTaxRules);
    setPurchases(initialPurchases);
    setAccounts(initialAccounts);
    setDomains(initialDomains);
    setSettingsState(initialSettings);
    setAuditLogs(initialAuditLogs);
    setAllTenants(initialTenants);
    setAllUsers(initialUsers);
    logAudit('RESTORE', 'System', 'Reset restaurant system to factory defaults');
  };

  // SaaS Subscriptions & VAT Settings State
  const [currentSubscription, setCurrentSubscription] = useState<{
    planId: string;
    planName: string;
    expiryDate: string;
    isPro: boolean;
  }>({
    planId: 'pro',
    planName: 'Pro Multi-Outlet SaaS',
    expiryDate: '2026-12-31',
    isPro: true,
  });

  const upgradeSubscriptionPlan = (planId: string) => {
    setCurrentSubscription({
      planId,
      planName: `${planId.toUpperCase()} Restaurant Plan`,
      expiryDate: '2027-12-31',
      isPro: true,
    });
    logAudit('UPDATE', 'SaaS Subscriptions', `Upgraded restaurant license plan to ${planId}`);
  };

  const [vatSettings, setVatSettings] = useState<VatTaxSettings>({
    taxName: 'VAT / GST',
    taxRate: 5.0,
    isTaxInclusive: false,
    serviceChargeRate: 5.0,
    taxNumber: 'GST-992144',
  });

  const updateVatSettings = (newSettings: Partial<VatTaxSettings>) => {
    setVatSettings((prev) => ({ ...prev, ...newSettings }));
    logAudit('UPDATE', 'VAT Settings', 'Updated VAT / Tax calculations configuration');
  };

  const resolveTenantByDomain = (domainStr: string): Tenant | null => {
    const clean = domainStr.toLowerCase();
    return (
      allTenants.find(
        (t) =>
          t.subdomain.toLowerCase() === clean ||
          t.customDomain?.toLowerCase() === clean ||
          clean.includes(t.subdomain.toLowerCase())
      ) || null
    );
  };

  const toggleDigitalMenuApiStatus = (id: string) => {
    setDigitalMenuApis((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === 'active' ? 'disabled' : 'active' } : a))
    );
  };

  const regenerateDigitalMenuApiKey = (id: string): string => {
    const newKey = `omni_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
    setDigitalMenuApis((prev) => prev.map((a) => (a.id === id ? { ...a, apiKey: newKey } : a)));
    logAudit('UPDATE', 'Digital Menu API', `Regenerated API Key #${id}`);
    return newKey;
  };

  const playSound = (soundType: 'beep' | 'success' | 'alert' | 'kot' | 'bell') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = soundType === 'kot' ? 880 : soundType === 'alert' ? 440 : soundType === 'success' ? 980 : 1200;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // Audio not permitted or supported
    }
  };

  const recordKhataAdjustment = (customerId: string, amount: number, _adjType?: string, reason?: string, _notes?: string) => {
    recordKhataCredit(customerId, amount, `Adjustment: ${reason || 'Manual Adjustment'}`);
  };

  const exportKhataToExcel = (_mode?: string, _customerId?: string) => {
    exportDataToCsv('customers');
  };

  const exportDataToCsv = (type: 'products' | 'customers' | 'orders' | 'purchases' | 'accounts') => {
    let rows: string[] = [];
    let filename = `${type}_export_${Date.now()}.csv`;

    if (type === 'products') {
      rows.push('Name,Category,SellingPrice,CostPrice,Stock,Unit,Barcode');
      products.forEach((p) => {
        rows.push(`"${p.name}","${p.category}",${p.price},${p.costPrice || 0},${p.stock},"${p.unit}","${p.barcode}"`);
      });
    } else if (type === 'customers') {
      rows.push('Name,Phone,Email,Address,NetBalance,CreditLimit');
      customers.forEach((c) => {
        rows.push(`"${c.name}","${c.phone}","${c.email || ''}","${c.address || ''}",${c.netBalance},${c.creditLimit}`);
      });
    } else if (type === 'orders') {
      rows.push('OrderNumber,Date,Customer,Type,Total,PaymentMethod,Status');
      orders.forEach((o) => {
        rows.push(`"${o.orderNumber}","${o.date}","${o.customerName || 'Walk-in'}","${o.type}",${o.total},"${o.paymentMethod}","${o.status}"`);
      });
    } else if (type === 'purchases') {
      rows.push('InvoiceNumber,Date,Supplier,TotalAmount,PaidAmount,PendingAmount');
      purchases.forEach((p) => {
        rows.push(`"${p.invoiceNumber}","${p.purchaseDate}","${p.supplier}",${p.totalAmount},${p.paidAmount},${p.pendingAmount}`);
      });
    } else if (type === 'accounts') {
      rows.push('Date,Type,Category,Description,Amount,PaymentMethod');
      accounts.forEach((a) => {
        rows.push(`"${a.date}","${a.type}","${a.category}","${a.description}",${a.amount},"${a.paymentMethod}"`);
      });
    }

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    logAudit('EXPORT', 'Import/Export', `Exported ${type} dataset as CSV`);
  };

  const importProductsFromCsv = (csvText: string) => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length <= 1) return { success: false, count: 0, message: 'CSV has no data rows' };

      let count = 0;
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 3 && parts[0]) {
          const newProduct: Product = {
            id: 'p-' + Date.now() + '-' + i,
            tenantId: currentUser.tenantId || 'tenant-resto-01',
            name: parts[0],
            category: parts[1] || 'Main Menu',
            price: Number(parts[2]) || 10,
            costPrice: Number(parts[3]) || 5,
            stock: Number(parts[4]) || 50,
            unit: parts[5] || 'Pcs',
            barcode: parts[6] || `SKU-${Date.now()}-${i}`,
            sku: parts[6] || `SKU-${Date.now()}-${i}`,
            minStockAlert: 10,
            businessType: 'restaurant',
            isAvailable: true,
            isActive: true,
          };
          setProducts((prev) => [newProduct, ...prev]);
          count++;
        }
      }
      logAudit('IMPORT', 'Import/Export', `Imported ${count} products via CSV`);
      return { success: true, count, message: `Successfully imported ${count} items into menu catalog!` };
    } catch (e: any) {
      return { success: false, count: 0, message: e.message };
    }
  };

  const importCustomersFromCsv = (csvText: string) => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length <= 1) return { success: false, count: 0, message: 'CSV has no data rows' };

      let count = 0;
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 2 && parts[0]) {
          addCustomer({
            name: parts[0],
            phone: parts[1] || '',
            email: parts[2] || '',
            address: parts[3] || '',
            creditLimit: Number(parts[4]) || 5000,
            openingBalance: Number(parts[5]) || 0,
            status: 'active',
            khataStatus: 'enabled',
          });
          count++;
        }
      }
      logAudit('IMPORT', 'Import/Export', `Imported ${count} customer parties via CSV`);
      return { success: true, count, message: `Successfully imported ${count} customer parties!` };
    } catch (e: any) {
      return { success: false, count: 0, message: e.message };
    }
  };

  const importCustomersFromData = (data: any[]) => {
    let count = 0;
    data.forEach((d) => {
      addCustomer({
        name: d.name || 'Customer',
        phone: d.phone || '',
        email: d.email || '',
        address: d.address || '',
        creditLimit: d.creditLimit || 5000,
        status: 'active',
        khataStatus: 'enabled',
      });
      count++;
    });
    return { success: true, count, message: `Imported ${count} customers!` };
  };

  const tenantUsers = allUsers.filter((u) => u.tenantId === currentUser.tenantId || currentUser.role === 'superadmin');

  return (
    <POSContext.Provider
      value={{
        currentUser,
        currentTenant,
        allTenants,
        allUsers,
        tenantUsers,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        logout,
        switchRoleQuick,
        switchTenant,
        hasPermission,

        domains,
        activeSubdomain,
        simulateDomainResolution,
        addDomain,
        deleteDomain,

        addTenant,
        updateTenant,
        deleteTenant,
        toggleTenantStatus,
        changeTenantVertical,

        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        toggleAdminStatus,
        resetAdminPassword,

        addTenantUser,
        updateTenantUser,
        deleteTenantUser,
        toggleTenantUserStatus,

        activeTab,
        setActiveTab,
        businessType,
        setBusinessType,
        language,
        setLanguage,
        t,

        products,
        filteredProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        categories,
        addProduct,
        updateProduct,
        adjustStock,
        deleteProduct,
        toggleProductStatus,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        setItemDiscount,
        clearCart,
        cartSubtotal,
        cartTax,
        cartDiscount,
        cartTotal,
        orderType,
        setOrderType,
        selectedTableNumber,
        setSelectedTableNumber,
        selectedCustomer,
        setSelectedCustomer,

        heldCarts,
        holdCurrentCart,
        resumeCart,
        deleteHeldCart,

        orders,
        completeCheckout,
        lastOrder,
        updateOrderStatus,
        updateDeliveryStatus,
        cancelOrder,
        refundOrder,
        createCallInOrder,

        activePrintModal,
        openPrintModal,
        closePrintModal,
        printKotTicket,
        printPreBillCheck,
        printThermalReceipt,

        sendKotFromWaiter,
        bumpChefOrderStatus,

        tables,
        addTable,
        updateTable,
        deleteTable,
        updateTableStatus,
        assignTableOrder,
        reservations,
        addReservation,
        updateReservation,
        seatReservation,
        cancelReservation,

        quotations,
        addQuotation,
        updateQuotation,
        deleteQuotation,
        convertQuotationToOrder,

        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,

        customers,
        allCustomers: customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        archiveCustomer,
        restoreCustomer,
        toggleCustomerStatus,
        disableKhata,
        enableKhata,
        recordKhataCredit,
        recordKhataPayment,
        selectedKhataCustomer,
        setSelectedKhataCustomer,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        recordSupplierPayment,

        paymentGateways,
        updatePaymentGateway,
        togglePaymentGateway,

        saasPackages,
        upgradeSaaSPackage,
        addSaaSPackage,
        updateSaaSPackage,

        taxRules,
        addTaxRule,
        updateTaxRule,
        deleteTaxRule,
        toggleTaxRule,

        purchases,
        addPurchase,
        updatePurchase,
        deletePurchase,

        accounts,
        addAccountTransaction,
        updateAccountTransaction,
        deleteAccountTransaction,

        settings,
        updateSettings,
        updatePrinterConfig,
        testPrinterConnection,

        auditLogs,
        logAudit,

        createFullBackupZip,
        generateZipBackup: createFullBackupZip,
        restoreFromBackupData,
        restoreFromZip,
        resetToFactoryDefaults,

        isScannerOpen,
        setIsScannerOpen,
        handleScannedBarcode,

        digitalMenuApis,
        createDigitalMenuApi,
        revokeDigitalMenuApi,
        toggleDigitalMenuApiStatus,
        regenerateDigitalMenuApiKey,
        connectTenantDigitalMenuApi,
        disconnectTenantDigitalMenuApi,

        isSuperadmin: currentUser.role === 'superadmin',
        setCurrentTenant: (t: Tenant | null) => {
          if (t) switchTenant(t.id);
        },
        resolveTenantByDomain,

        playSound,
        exportDataToCsv,
        importProductsFromCsv,
        importCustomersFromCsv,
        importCustomersFromData,
        exportKhataToExcel,
        recordKhataAdjustment,

        currentSubscription,
        upgradeSubscriptionPlan,
        vatSettings,
        updateVatSettings,

        isOffline,
        setIsOffline,
        pendingSyncCount,
        syncOfflineQueue,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = (): POSContextType => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
