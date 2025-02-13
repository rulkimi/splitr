import { type Friend } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FriendIcon: React.FC<{
  friend: Friend;
  className?: string;
  size?: "lg" | "md";
  onClick?: () => void;
}> = ({ friend, className, size, onClick }) => {
  return (
    <li className={className} onClick={onClick}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              className={`bg-gray-100 ${
                size === "lg" ? "w-12 h-12" : "w-8 h-8"
              } flex items-center justify-center rounded-full aspect-square font-bold text-gray-500 border border-white relative`}
            >
              {friend.photo ? (
                <img
                  src={friend.photo}
                  alt={`${friend.name} icon`}
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                friend.name.charAt(0)
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{friend.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};

export default FriendIcon;
