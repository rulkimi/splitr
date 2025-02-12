import FriendIcon from "@/components/friend-icon";
import { type Friend } from "@/pages/home";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Friends = () => {
  const [name, setName] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fetchFriends = async (): Promise<Friend[]> => {
    const { data, error } = await supabase.from('friends').select();
    if (error) throw error;
    return data ?? [];
  };

  const { data: friends, refetch } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
  });


  const addFriend = async (): Promise<void> => {
    await supabase.from('friends').insert({
      id: Math.floor(Math.random() * 2147483647),
      name: name
    });
    await refetch();
    setIsDialogOpen(false);
  }

  return (
    <div className="flex gap-0.5">

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <div
            className="bg-gray-100 w-12 h-12 flex items-center justify-center rounded-full aspect-square font-bold border-2 border-gray-400 border-dashed"
          >
            <Plus className="text-gray-500" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Friend</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}  
              />
            </div>
            <div>
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file" />
            </div>
          </DialogDescription>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={addFriend}>Add Friend</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ul className="flex gap-0.5">
        {friends?.map(friend => (
          <FriendIcon key={friend.id} size="lg" friend={friend} />
        ))}
      </ul>
    </div>
  )
}

export default Friends;