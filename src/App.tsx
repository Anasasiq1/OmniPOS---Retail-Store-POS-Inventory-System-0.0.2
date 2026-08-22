import React from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { TopNav } from './components/Navigation/TopNav';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { POSTerminal } from './components/POS/POSTerminal';
import { WaiterView } from './components/WaiterApp/WaiterView';
import { ChefKDSView } from './components/ChefApp/ChefKDSView';
import { TableManager } from './components/Tables/TableManager';
import { OrdersManager } from './components/Orders/OrdersManager';
import { DeliveryManager } from './components/Delivery/DeliveryManager';
import { QuotationsManager } from './components/Quotations/QuotationsManager';
import { PartiesManager } from './components/Parties/PartiesManager';
import { DueListManager } from './components/DueList/DueListManager';
import { CouponsManager } from './components/Coupons/CouponsManager';
import { PaymentGatewaysManager } from './components/PaymentGateways/PaymentGatewaysManager';
import { SaaSSubscriptionsManager } from './components/Subscriptions/SaaSSubscriptionsManager';
import { VatSettingsManager } from './components/VatSettings/VatSettingsManager';
import { InventoryManager } from './components/Inventory/InventoryManager';
import { KhataBook } from './components/Khata/KhataBook';
import { ReportsAnalytics } from './components/Analytics/ReportsAnalytics';
import { SettingsView } from './components/Settings/SettingsView';
import { TenantManagement } from './components/Superadmin/TenantManagement';
import { AdminManagement } from './components/Superadmin/AdminManagement';
import { DomainManagement } from './components/Superadmin/DomainManagement';
import { SuperAdminDigitalMenu } from './components/Superadmin/SuperAdminDigitalMenu';
import { TenantDigitalMenuApi } from './components/DigitalMenu/TenantDigitalMenuApi';
import { PurchaseManager } from './components/Purchases/PurchaseManager';
import { AccountsManager } from './components/Accounts/AccountsManager';
import { BackupManager } from './components/Backup/BackupManager';
import { AuditLogViewer } from './components/Audit/AuditLogViewer';
import { ImportExportManager } from './components/ImportExport/ImportExportManager';
import { StaffManagement } from './components/Users/StaffManagement';
import { ScannerModal } from './components/Modals/ScannerModal';
import { AuthModal } from './components/Auth/AuthModal';

const MainLayout: React.FC = () => {
  const { activeTab } = usePOS();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900 antialiased selection:bg-orange-500 selection:text-white">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col h-full overflow-hidden">
        {/* Sticky Top Bar */}
        <TopNav />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'pos' && <POSTerminal />}
          {activeTab === 'waiter_app' && <WaiterView />}
          {activeTab === 'chef_kds' && <ChefKDSView />}
          {activeTab === 'tables' && <TableManager />}
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'delivery' && <DeliveryManager />}
          {activeTab === 'quotations' && <QuotationsManager />}
          {activeTab === 'parties' && <PartiesManager />}
          {activeTab === 'due_list' && <DueListManager />}
          {activeTab === 'coupons' && <CouponsManager />}
          {activeTab === 'gateways' && <PaymentGatewaysManager />}
          {activeTab === 'subscriptions' && <SaaSSubscriptionsManager />}
          {activeTab === 'vat_settings' && <VatSettingsManager />}
          {activeTab === 'digital_menu' && <TenantDigitalMenuApi />}
          {activeTab === 'inventory' && <InventoryManager />}
          {activeTab === 'purchases' && <PurchaseManager />}
          {activeTab === 'accounts' && <AccountsManager />}
          {activeTab === 'khata' && <KhataBook />}
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'reports' && <ReportsAnalytics />}
          {activeTab === 'import_export' && <ImportExportManager />}
          {activeTab === 'backup' && <BackupManager />}
          {activeTab === 'audit_logs' && <AuditLogViewer />}
          {activeTab === 'staff' && <StaffManagement />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'tenants' && <TenantManagement />}
          {activeTab === 'super_admins' && <AdminManagement />}
          {activeTab === 'domains' && <DomainManagement />}
          {activeTab === 'super_menu_api' && <SuperAdminDigitalMenu />}
        </main>
      </div>

      {/* Universal Optical Scanner Modal */}
      <ScannerModal />

      {/* RBAC & Role Switcher Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <MainLayout />
    </POSProvider>
  );
}
