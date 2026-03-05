import { 
  LayoutDashboard, 
  Box, 
  PlusCircle, 
  Bell, 
  Package, 
  FileText, 
  TrendingUp, 
  Settings,
  Tag,
  ClipboardList 
} from 'lucide-react';

export interface MenuItem {
  name: string;
  icon: any;
  href: string;
}

// ==========================================
// DYNAMIC GETTER FUNCTIONS
// These functions inject the branchId into the URLs
// ==========================================

export const getShopManagerMenu = (branchId: string): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/${branchId}/shop-manager` },
  { name: 'Orders', icon: ClipboardList, href: `/${branchId}/shop-manager/orders` },
  { name: 'Notifications', icon: Bell, href: `/${branchId}/shop-manager/notifications` },
  { name: 'Reports', icon: FileText, href: `/${branchId}/shop-manager/reports` },
  { name: 'Settings', icon: Settings, href: `/${branchId}/shop-manager/settings` },
];

export const getBakerMenu = (branchId: string): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/${branchId}/baker-assistant` },
  { name: 'Products', icon: Package, href: `/${branchId}/baker-assistant/products` },
  { name: 'Add products', icon: PlusCircle, href: `/${branchId}/baker-assistant/add-product' `},
];

export const getStoreKeeperMenu = (branchId: string): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/${branchId}/store-keeper` },
  { name: 'Products', icon: Box, href: `/${branchId}/store-keeper/products` },       
  { name: 'Add products', icon: PlusCircle, href: `/${branchId}/store-keeper/add-product` }, 
  { name: 'Add Other', icon: PlusCircle, href: `/${branchId}/store-keeper/add-other` },
  { name: 'Notification', icon: Bell, href: `/${branchId}/store-keeper/notifications` },
];

export const getProductionManagerMenu = (branchId: string): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/${branchId}/production-manager` },
  { name: 'Notification', icon: Bell, href: `/${branchId}/production-manager/notifications` },
];

// ==========================================
// GLOBAL ROLES (No Branch ID needed)
// ==========================================

export const cicmMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/cicm' },
  { name: 'Report', icon: FileText, href: '/cicm/report' },
];

export const cheifFinanceMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/cheif-finance' },
  { name: 'Report', icon: FileText, href: '/cheif-finance/report' },
];

export const marketingManagerMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/marketing-manager' },
  { name: 'Pricing', icon: Tag, href: '/marketing-manager/pricing' },
  { name: 'Reports', icon: FileText, href: '/marketing-manager/reports' },
  { name: 'Business Analytics', icon: TrendingUp, href: '/marketing-manager/analytics' },
];