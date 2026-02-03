import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

export interface UserConfig {
  title: string;
  initial: string;
  menu: MenuItem[];
}

// Added to fix the error in mockData.ts
export interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  addedBy: string;
  status: string;
}