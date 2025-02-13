import { type Bill } from "@/pages/home";
import RadialProgressBar from "@/components/radial-progress-bar";
import FriendIcon from "@/components/friend-icon";
import { useQuery } from "@tanstack/react-query";

const Bills = () => {
  const fetchBills = async (): Promise<Bill[]> => {
    const res = await fetch("/data-structures/bills.json");
    return res.json();
  };

  const { data: bills } = useQuery({
    queryKey: ["bills"],
    queryFn: fetchBills,
  });

  return (
    <>
      <div className="flex justify-between">
        <span className="font-semibold">Bills</span>
        <span>+ Add Bill</span>
      </div>
      <ul className="space-y-2">
        {bills?.map((bill: Bill) => (
          <BillList key={bill.bill_id} bill={bill} />
        ))}
      </ul>
    </>
  )
}

const BillList: React.FC<{ bill: Bill}> = ({ bill }) => {
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

export default Bills;