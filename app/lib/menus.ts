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
// DYNAMIC GETTER FUNCTIONS (Branch-Specific)
// ==========================================

export const getShopManagerMenu = (branchId: string): MenuItem[] => [
   { name: 'Dashboard', icon: LayoutDashboard, href: `/${branchId}/shop-manager` },
   { name: 'Notifications', icon: Bell, href: `/${branchId}/shop-manager/notifications` },
];

// --- BAKER ASSISTANT (GLOBAL - NO BRANCH ID) ---
export const getBakerMenu =  (): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/baker-assistant` },
  { name: 'Products', icon: Package, href: `/baker-assistant/products` },
  { name: 'Add products', icon: PlusCircle, href: `/baker-assistant/add-product` },
];

export const getStoreKeeperMenu = (branchId: string): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/${branchId}/store-keeper` },
  { name: 'Products', icon: Box, href: `/${branchId}/store-keeper/products` },       
  { name: 'Add products', icon: PlusCircle, href: `/${branchId}/store-keeper/add-product` }, 
  { name: 'Add Other', icon: PlusCircle, href: `/${branchId}/store-keeper/add-other` },
  { name: 'Notification', icon: Bell, href: `/${branchId}/store-keeper/notifications` },
];

export const getProductionManagerMenu = (): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/production-manager` },
  { name: 'Notification', icon: Bell, href: `/production-manager/notifications` },
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
export const getMarketingManagerMenu = (): MenuItem[] => [
  { name: 'Admin Dashboard', icon: LayoutDashboard, href: '/marketing-manager' },
  { name: 'Pricing Strategy', icon: Tag, href: '/marketing-manager/pricing' },
];