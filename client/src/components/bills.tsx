import { type Bill, type Friend } from "@/types";
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
  DialogClose,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";

const Bills = () => {
  const [newBill, setNewBill] = useState<File | null>(null);
  const [friendsInvolved, setFriendsInvolved] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate()

  const fetchBills = async (): Promise<Bill[]> => {
    const { data, error } = await supabase.from("bills").select();
    if (error) throw error;
    return data ?? [];
  };

  const { data: bills } = useQuery({
    queryKey: ["bills"],
    queryFn: fetchBills,
  });

  const fetchFriends = async (): Promise<Friend[]> => {
    const { data, error } = await supabase.from("friends").select();
    if (error) throw error;
    return data ?? [];
  };

  const { data: friends } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
  });

  const billId = Math.floor(Math.random() * 2147483647);

  const addBill = async () => {
    if (!newBill) return;
    const formData = new FormData();
    formData.append("file", newBill);
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/analyze/",
        formData
      );
      const billData = response.data;
      const finalBillData = {
        user_id: localStorage.getItem("userId"),
        ...billData,
        bill_id: billId,
        friends: friendsInvolved,
      };
      await supabase.from("bills").insert(finalBillData);
      navigate(`/bill/${billId}`, { state: { billData: finalBillData } });
    } catch (error) {
      console.error("Error adding bill:", error);
    } finally {
      setIsLoading(false)
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedBill = event.target.files?.[0] || null;
    setNewBill(selectedBill);
  };

  const handleAddFriends = (friend: Friend) => {
    const newFriendsInvolved = [...friendsInvolved];
    const friendIndex = newFriendsInvolved.findIndex(
      (f) => f.friend_id === friend.friend_id
    );
    if (friendIndex === -1) {
      newFriendsInvolved.push(friend);
    } else {
      newFriendsInvolved.splice(friendIndex, 1);
    }
    setFriendsInvolved(newFriendsInvolved);
  };

  const handleBillClick = (bill: Bill) => {
    navigate(`/bill/${bill.bill_id}`, { state: { billData: bill } });
  }

  return (
    <>
      <div className="flex justify-between">
        <span className="font-semibold">Bills</span>
        <Dialog>
          <DialogTrigger>+ Add Bill</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bill</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <span className="flex gap-0.5">
                {friends?.map((friend) => (
                  <FriendIcon
                    className={`list-none ${
                      friendsInvolved.find(
                        (friendInvolved) =>
                          friendInvolved.friend_id === friend.friend_id
                      )
                        ? "opacity-100"
                        : "opacity-50"
                    }`}
                    key={friend.friend_id}
                    size="lg"
                    friend={friend}
                    onClick={() => handleAddFriends(friend)}
                  />
                ))}
              </span>
              <span className="block">
                <Label htmlFor="new-bill-image">Upload a bill</Label>
                <Input
                  id="new-bill-image"
                  type="file"
                  onChange={handleImageUpload}
                />
              </span>
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={addBill} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Plus />}
                "Add Bill"
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {bills && bills.length > 0 ? (
        <ul className="space-y-2">
          {bills.map((bill: Bill) => (
            <BillList key={bill.bill_id} bill={bill} onClick={() => handleBillClick(bill)} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No bills found. Add one.</p>
      )}
    </>
  );
};

const BillList: React.FC<{ bill: Bill, onClick: () => void }> = ({ bill, onClick }) => {
  return (
    <li className="bg-white p-3 rounded-lg space-y-2 relative cursor-pointer hover:bg-gray-50 hover:shadow-md" onClick={onClick}>
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

export default Bills;
