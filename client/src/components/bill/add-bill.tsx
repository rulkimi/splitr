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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FriendIcon from "@/components/friend-icon";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { type Friend } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const AddBill = () => {
  const [friendsInvolved, setFriendsInvolved] = useState<Friend[]>([]);
  const [newBill, setNewBill] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

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
      const response = await axios.post("http://localhost:8000/analyze/", formData);
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

  return (
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
  )
}

export default AddBill;