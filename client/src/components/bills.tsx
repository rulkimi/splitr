import { type Bill } from "@/types";
import RadialProgressBar from "@/components/radial-progress-bar";
import FriendIcon from "@/components/friend-icon";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Bills = () => {
  const [newBill, setNewBill] = useState<File | null>(null);
  const fetchBills = async (): Promise<Bill[]> => {
    const { data, error } = await supabase.from('bills').select();
    if (error) throw error;
    return data ?? [];
  };

  const { data: bills } = useQuery({
    queryKey: ["bills"],
    queryFn: fetchBills,
  });

  const billId = Math.floor(Math.random() * 2147483647);

  const addBill = () => {
    console.log("new bill uploaded", billId, newBill)
  }
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedBill = event.target.files?.[0] || null;
    setNewBill(selectedBill);
  }

  return (
    <>
      <div className="flex justify-between">
        <span className="font-semibold">Bills</span>
        <Dialog>
          <DialogTrigger>
            + Add Bill
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bill</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <span className="block">
                <Label htmlFor="new-bill-image">Upload a bill</Label>
                <Input id="new-bill-image" type="file" onChange={handleImageUpload} />
              </span>
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={addBill}>Add Bill</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {bills && bills.length > 0 ? (
        <ul className="space-y-2">
          {bills.map((bill: Bill) => (
            <BillList key={bill.bill_id} bill={bill} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No bills found. Add one.</p>
      )}
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