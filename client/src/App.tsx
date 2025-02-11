import BaseLayout from "@/layouts";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}

export interface Item {
  item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  assigned_to: number | null;
}

export interface Friend {
  id: number;
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
  id: string;
  restaurant_name: string;
  date: string;
  time: string;
  financial_summary: {
    subtotal: number;
    tax: number;
    service_charge: number;
    total: number;
  };
  items: Item[];
  friends: Friend[];
}


function Home() {
  const fetchBills = async (): Promise<Bill[]> => {
    const res = await fetch("/data-structures/bills.json");
    return res.json();
  };

  const { data: bills } = useQuery({
    queryKey: ["bills"],
    queryFn: fetchBills,
  });

  return (
    <BaseLayout>
      <ul className="space-y-2">
        {bills?.map((bill: Bill) => (
          <BillList key={bill.id} bill={bill} />
        ))}
      </ul>
    </BaseLayout>
  );
}

export const BillList: React.FC<{ bill: Bill}> = ({ bill }) => {
  return (
    <li className="bg-white p-3 rounded-lg space-y-2">
      <div>
        <div className="flex justify-between gap-2 font-semibold">
          <div>{bill.restaurant_name}</div>
          <div>RM {bill.financial_summary.total}</div>
        </div>
        <div className="text-gray-500">{bill.date} | {bill.time}</div>
      </div>
      <ul className="flex">
        {bill.friends.map((friend, index) => (
          <FriendIcon key={friend.id} friend={friend} index={index} />
        ))}
      </ul>
    </li>
  )
}

const FriendIcon: React.FC<{ friend: Friend, index: number }> = ({ friend, index }) => {
  return (
    <li className={`${index === 0 ? '' : 'ml-[-12px]' }`}>
      <div
        className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full aspect-square font-bold text-gray-500 border border-white"
        title={friend.name}
      >
        {friend.photo ? friend.photo : friend.name.charAt(0)}
      </div>
    </li>
  )
}


