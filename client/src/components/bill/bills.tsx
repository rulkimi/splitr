import { type Bill } from "@/types";
import BillList from "./bill-list";
import AddBill from "./add-bill";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const Bills = () => {
  const navigate = useNavigate();

  const fetchBills = async (): Promise<Bill[]> => {
    const { data, error } = await supabase.from("bills").select();
    if (error) throw error;
    return data ?? [];
  };

  const { data: bills } = useQuery({
    queryKey: ["bills"],
    queryFn: fetchBills,
  });

  const handleBillClick = (bill: Bill) => {
    navigate(`/bill/${bill.bill_id}`, { state: { billData: bill } });
  };

  return (
    <>
      <div className="flex justify-between">
        <span className="font-semibold">Bills</span>
        <AddBill />
      </div>
      {bills && bills.length > 0 ? (
        <ul className="space-y-2">
          {bills.map((bill: Bill, index) => (
            <BillList
              key={`${bill.bill_id}-${index}`}
              bill={bill}
              onClick={() => handleBillClick(bill)}
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No bills found. Add one.</p>
      )}
    </>
  );
};

export default Bills;
