import { 
  LayoutDashboard, 
  Box, 
  PlusCircle, 
  Bell, 
  Package, 
  Truck, 
  Users, 
  FileText, 
  TrendingUp, 
  Megaphone,
  PieChart,
  BarChart3,
  ClipboardList, 
  Settings,
  Tag 
} from 'lucide-react';

export interface MenuItem {
  name: string;
  icon: any;
  href: string;
}

// ==========================================
// 1. SHOP MANAGER
// ==========================================
export const shopManagerMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/shop-manager' },
  { name: 'Orders', icon: ClipboardList, href: '/shop-manager/orders' },
  { name: 'Notifications', icon: Bell, href: '/shop-manager/notifications' },
  { name: 'Reports', icon: FileText, href: '/shop-manager/reports' },
  { name: 'Settings', icon: Settings, href: '/shop-manager/settings' },
];

// ==========================================
// 2. BAKER ASSISTANT
// ==========================================
export const bakerMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/baker-assistant' },
  { name: 'Products', icon: Package, href: '/baker-assistant/products' },
  { name: 'Add products', icon: PlusCircle, href: '/baker-assistant/add-product' },
  { name: 'Notification', icon: Bell, href: '/baker-assistant/notifications' },
];

// ==========================================
// 3. STORE KEEPER
// ==========================================
export const storeKeeperMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/store-keeper' },
  { name: 'Products', icon: Box, href: '/store-keeper/products' },       
  { name: 'Add products', icon: PlusCircle, href: '/store-keeper/add-product' }, 
  { name: 'Notification', icon: Bell, href: '/store-keeper/notifications' },
];

// ==========================================
// 4. PRODUCTION MANAGER
// ==========================================
export const productionManagerMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/production-manager' },
  { name: 'Products', icon: Box, href: '/production-manager/products' },
  { name: 'Add products', icon: PlusCircle, href: '/production-manager/add-product' }, 
  { name: 'Notification', icon: Bell, href: '/production-manager/notifications' },
];

// ==========================================
// 5. CICM 
// ==========================================
export const cicmMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/cicm' },
  { name: 'Products', icon: Box, href: '/cicm/products' },
  { name: 'Report', icon: FileText, href: '/cicm/report' },
  { name: 'Notification', icon: Bell, href: '/cicm/notifications' },
];

// ==========================================
// 6. CHIEF OF FINANCE (UPDATED LINK SPELLING)
// ==========================================
export const cheifFinanceMenu: MenuItem[] = [
  { 
    name: 'Dashboard', 
    icon: LayoutDashboard, 
    // Matches your folder 'cheif-finance'
    href: '/cheif-finance' 
  },
  { 
    name: 'Report', 
    icon: FileText, 
    // Matches your folder 'cheif-finance/report'
    href: '/cheif-finance/report' 
  },
];

// ==========================================
// 7. OPERATION MANAGER
// ==========================================
export const operationManagerMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/operation-manager' },
  { name: 'Products', icon: Box, href: '/operation-manager/products' },
  { name: 'Add products', icon: PlusCircle, href: '/operation-manager/add-product' },
  { name: 'Notification', icon: Bell, href: '/operation-manager/notifications' },
];

// ==========================================
// 8. SALES COORDINATOR
// ==========================================
export const salesCoordinatorMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/sales-coordinator' },
  { name: 'Products', icon: Box, href: '/sales-coordinator/products' },
];

// ==========================================
// 9. MARKETING MANAGER
// ==========================================
export const marketingManagerMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/marketing-manager' },
  { name: 'Pricing', icon: Tag, href: '/marketing-manager/pricing' },
  { name: 'Reports', icon: FileText, href: '/marketing-manager/reports' },
  { name: 'Business Analytics', icon: TrendingUp, href: '/marketing-manager/analytics' },
];