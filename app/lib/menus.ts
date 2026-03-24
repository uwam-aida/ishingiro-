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
   { name: 'Cake Orders', icon: ClipboardList, href: `/${branchId}/shop-manager/cake-orders` }, // Added this line
   { name: 'Notifications', icon: Bell, href: `/${branchId}/shop-manager/notifications` },
];

// --- BAKER ASSISTANT (GLOBAL - NO BRANCH ID) ---
export const getBakerMenu =  (): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/baker-assistant` },
  { name: 'Products', icon: Package, href: `/baker-assistant/products` },
  { name: 'Add products', icon: PlusCircle, href: `/baker-assistant/add-product` },
];

export const getStoreKeeperMenu = (): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/store-keeper` },
  { name: 'Products', icon: Box, href: `/store-keeper/products` },       
  { name: 'Add products', icon: PlusCircle, href: `/store-keeper/add-product` }, 
  { name: 'Add Other', icon: PlusCircle, href: `/store-keeper/add-other` },
  { name: 'Cake Orders', icon: ClipboardList, href: `/store-keeper/cake-orders` },
  { name: 'Notification', icon: Bell, href: `/store-keeper/notifications` },
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