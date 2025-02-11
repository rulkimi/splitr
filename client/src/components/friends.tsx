import FriendIcon from "@/components/friend-icon";
import { type Friend } from "@/pages/home";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

const Friends = () => {
  const fetchFriends = async (): Promise<Friend[]> => {
    const res = await fetch("/data-structures/friends.json");
    return res.json();
  };

  const { data: friends } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
  });

  return (
    <div className="flex gap-0.5">
      <div
        className="bg-gray-100 w-12 h-12 flex items-center justify-center rounded-full aspect-square font-bold border-2 border-gray-400 border-dashed"
      >
        <Plus className="text-gray-500" />
      </div>
      <ul className="flex gap-0.5">
        {friends?.map(friend => (
          <li key={friend.id}>
            <FriendIcon size="lg" friend={friend} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Friends;