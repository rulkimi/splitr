import { Friend } from "@/types";
import FriendIcon from "@/components/friend-icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus } from "lucide-react";

interface FriendSelectorProps {
  itemId: string;
  friends: Friend[];
  selectedFriends: Friend[];
  onFriendSelect: (friend: Friend, itemId: string) => void;
}

export const FriendSelector = ({ itemId, friends, selectedFriends, onFriendSelect }: FriendSelectorProps) => (
  <ul className="flex gap-[0.5px]">
    <li>
      <Popover>
        <PopoverTrigger>
          <div className="bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full aspect-square font-bold border-2 border-gray-400 border-dashed">
            <Plus className="text-gray-500" />
          </div>
        </PopoverTrigger>
        <PopoverContent side="top">
          <span className="flex gap-0.5" tabIndex={0}>
            {friends?.map((friend) => (
              <FriendIcon
                key={friend.friend_id}
                className={`list-none ${selectedFriends.find((f) => f.friend_id === friend.friend_id) ? "opacity-100" : "opacity-50"}`}
                size="lg"
                friend={friend}
                onClick={() => onFriendSelect(friend, itemId)}
              />
            ))}
          </span>
        </PopoverContent>
      </Popover>
    </li>
    {selectedFriends.map((friend) => (
      <FriendIcon key={friend.friend_id} friend={friend} size="sm" />
    ))}
  </ul>
);