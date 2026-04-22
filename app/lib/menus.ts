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
  ClipboardList,
  UserCheck,
  Megaphone,
  ShieldCheck, // Added for Password Management
  Target // <-- Added for Weekly Targets
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
   { name: 'Cake Orders', icon: ClipboardList, href: `/${branchId}/shop-manager/cake-orders` },
   { name: 'Notifications', icon: Bell, href: `/${branchId}/shop-manager/notifications` },
];

export const getBakerMenu = (): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/baker-assistant` },
  { name: 'Add Product', icon: PlusCircle, href: '/baker-assistant/add-product' },
  { name: 'Notifications', icon: Bell, href: `/baker-assistant/notifications` },
];

export const getStoreKeeperMenu = (): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/store-keeper` },     
  { name: 'Add products', icon: PlusCircle, href: `/store-keeper/add-product` }, 
  { name: 'Add Other', icon: PlusCircle, href: `/store-keeper/add-other` },
  { name: 'Notification', icon: Bell, href: `/store-keeper/notifications` },
];

export const getProductionManagerMenu = (): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/production-manager` },
  { name: 'Notification', icon: Bell, href: `/production-manager/notifications` },
];

// ==========================================
// GLOBAL ROLES
// ==========================================

export const getSalesCoordinatorMenu = (): MenuItem[] => [
  { name: 'Dashboard', icon: LayoutDashboard, href: `/sales-coordinator` },
  { name: 'Cake Orders', icon: ClipboardList, href: `/sales-coordinator/cake-orders` },
  { name: 'Messages', icon: Megaphone, href: '/sales-coordinator/messages' },
  { name: 'Weekly Targets', icon: Target, href: `/sales-coordinator/target` }, // <-- Added Targets Page

];

export const getMarketingManagerMenu = (): MenuItem[] => [
  { name: 'Admin Dashboard', icon: LayoutDashboard, href: '/marketing-manager' },
  { name: 'Manage Passwords', icon: ShieldCheck, href: '/marketing-manager/manage-passwords' }, // Added for Security
];

// ⚠️ Note: I kept this array version of the Sales Coordinator menu just in case you 
// are importing it directly somewhere, but usually you should just use getSalesCoordinatorMenu()
export const salesCoordinatorMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/sales-coordinator' }, 
  { name: 'Messages', icon: Megaphone, href: '/sales-coordinator/messages' },
  { name: 'Targets', icon: Target, href: `/sales-coordinator/target` },
];

export const cicmMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/cicm' },
  { name: 'Report', icon: FileText, href: '/cicm/report' },
];

export const cheifFinanceMenu: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/cheif-finance' },
  { name: 'Products', icon: Package, href: '/cheif-finance/products' }, 
  { name: 'Report', icon: FileText, href: '/cheif-finance/report' },
  { name: 'Pricing Strategy', icon: Tag, href: '/cheif-finance/pricing' },
  { name: 'Analytics', icon: Tag, href: '/cheif-finance/analytics' },
];