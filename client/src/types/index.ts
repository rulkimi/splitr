export interface Item {
  item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  assigned_to?: Friend[];
}

export interface Friend {
  bills?: string[]
  friend_id: number;
  name: string;
  photo: string | null;
  amount_owed: number;
  paid: boolean;
  items: Item[]
}

export interface Bill {
  bill_id: string;
  restaurant_name: string;
  date: string;
  time: string;
  financial_summary: {
    subtotal: number;
    tax: number;
    service_charge: number;
    total: number;
    total_paid: number;
  };
  items: Item[];
  friends: Friend[];
}

export interface SummaryItem {
  itemName: string;
  amountOwedForItem: string;
}

export interface FriendSummaryType {
  name: string;
  photo: string | null;
  amountOwed: string;
  items: SummaryItem[];
}
