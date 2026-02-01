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
  BarChart3 // Added for Analytics
} from 'lucide-react';
import { MenuItem } from './types';

// ==========================================
// 1. SHOP MANAGER
// ==========================================
export const shopManagerMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/shop-manager' },
  { name: 'Products', icon: Box, href: '/shop-manager/products' },
  { name: 'Add products', icon: PlusCircle, href: '/shop-manager/add-product' },
  { name: 'Notification', icon: Bell, href: '/shop-manager/notifications' },
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
// 6. CHIEF OF FINANCE (UPDATED)
// ==========================================
export const financeMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/cheif-finance' },
  { name: 'Products', icon: Box, href: '/cheif-finance/products' },
  { name: 'Business Analytics', icon: BarChart3, href: '/cheif-finance/analytics' },
];

// ==========================================
// 7. OPERATION MANAGER (UPDATED)
// ==========================================
export const operationManagerMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/operation-manager' },
  { name: 'Products', icon: Box, href: '/operation-manager/products' },
  { name: 'Add products', icon: PlusCircle, href: '/operation-manager/add-product' },
  { name: 'Notification', icon: Bell, href: '/operation-manager/notifications' },
];

// ==========================================
// 8. SALES COORDINATOR (STRICTLY FROM IMAGE)
// ==========================================
export const salesCoordinatorMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/sales-coordinator' },
  { name: 'Products', icon: Box, href: '/sales-coordinator/products' },
];

// ==========================================
// 9. MARKETING MANAGER (UPDATED FROM FIGMA IMAGE)
// ==========================================
export const marketingManagerMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/marketing-manager' },
  { name: 'Products', icon: Box, href: '/marketing-manager/products' },
  { name: 'Reports', icon: FileText, href: '/marketing-manager/reports' },
  { name: 'Business Analytics', icon: TrendingUp, href: '/marketing-manager/analytics' },
];