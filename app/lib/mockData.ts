import { ProductItem } from './types';

export const productsData: ProductItem[] = [
  {
    id: '1',
    name: 'White Bread',
    quantity: 100,
    unit: 'pieces',
    addedBy: 'baker assistant',
    status: 'baked',
  },
  {
    id: '2',
    name: 'Chocolate Cookies',
    quantity: 50,
    unit: 'packets',
    addedBy: 'Head Baker',
    status: 'available',
  },
  {
    id: '3',
    name: 'Wedding Cake (Tier 3)',
    quantity: 2,
    unit: 'pieces',
    addedBy: 'Manager',
    status: 'baked',
  },
  {
    id: '4',
    name: 'Vanilla Cupcakes',
    quantity: 0,
    unit: 'box',
    addedBy: 'baker assistant',
    status: 'out_of_stock',
  },
  {
    id: '5',
    name: 'Sourdough Loaf',
    quantity: 15,
    unit: 'pieces',
    addedBy: 'baker assistant',
    status: 'available',
  },
];