import BaseLayout from "@/layouts";
import RadialProgressBar from "@/components/radial-progress-bar";
import FriendIcon from "@/components/friend-icon";
import Friends from "@/components/friends";

import { useQuery } from "@tanstack/react-query";

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

export default function Home() {
  const fetchBills = async (): Promise<Bill[]> => {
    const res = await fetch("/data-structures/bills.json");
    return res.json();
  };

  const { data: bills } = useQuery({
    queryKey: ["bills"],
    queryFn: fetchBills,
  });

  return (
    <BaseLayout className="space-y-4">
      <div className="space-y-2">
        <span className="font-semibold">Friends</span>
        <Friends />
      </div>
      <div className="space-y-2">
        <span className="font-semibold">Bills</span>
        {bills ? <Bills bills={bills} /> : 'No bills found.'}
      </div>
    </BaseLayout>
  );
};

const Bills: React.FC<{ bills: Bill[]}> = ({ bills }) => {
  return (
    <ul className="space-y-2">
      {bills.map((bill: Bill) => (
        <BillList key={bill.bill_id} bill={bill} />
      ))}
    </ul>
  )
}

export const BillList: React.FC<{ bill: Bill}> = ({ bill }) => {
  return (
    <li className="bg-white p-3 rounded-lg space-y-2 relative">
      <div>
        <div className="flex justify-between gap-2 font-semibold">
          <div>{bill.restaurant_name}</div>
          <div>RM {bill.financial_summary.total}</div>
        </div>
        <div className="text-gray-500">{bill.date} | {bill.time}</div>
      </div>
      <ul className="flex">
        {bill.friends.map((friend, index) => (
          <FriendIcon key={friend.friend_id} friend={friend} className={`${index === 0 ? '' : 'ml-[-12px]' }`} />
        ))}
      </ul>
      <div className="absolute bottom-2 right-4">
        <RadialProgressBar 
          progress={Math.round((bill.financial_summary.total_paid / bill.financial_summary.total) * 100)}
          size={65}
          color="text-green-500"
        />
      </div>
    </li>
  )
}

