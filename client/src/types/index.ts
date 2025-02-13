export interface Item {
  item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  assigned_to: number | null;
}

export interface Friend {
  friend_id: number;
  name: string;
  photo: string | null;
  amount_owed: number;
  paid: boolean;
  items: {
    item_id: string;
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
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