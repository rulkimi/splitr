import FriendIcon from "../friend-icon";
import RadialProgressBar from "../radial-progress-bar";
import { type Bill } from "@/types";

interface BillListProps {
  bill: Bill;
  onClick: () => void;
}

const BillList = ({ bill, onClick }: BillListProps) => {
  return (
    <li
      className="bg-white p-3 rounded-lg space-y-2 relative cursor-pointer hover:bg-gray-50 hover:shadow-md"
      onClick={onClick}
    >
      <div>
        <div className="flex justify-between gap-2 font-semibold">
          <div>{bill.restaurant_name}</div>
          <div>RM {bill.financial_summary.total}</div>
        </div>
        <div className="text-gray-500">
          {bill.date} | {bill.time}
        </div>
      </div>
      <ul className="flex min-h-[28px]">
        {bill.friends?.map((friend, index) => (
          <FriendIcon
            key={friend.friend_id}
            friend={friend}
            className={`${index === 0 ? "" : "ml-[-12px]"}`}
          />
        ))}
      </ul>
      <div className="absolute bottom-2 right-4">
        <RadialProgressBar
          progress={Math.round(
            (bill.financial_summary.total_paid / bill.financial_summary.total) *
              100
          )}
          size={65}
          color="text-green-500"
        />
      </div>
    </li>
  );
};

export default BillList;
