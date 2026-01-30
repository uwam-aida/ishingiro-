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