import { type Friend } from "@/pages/home";

const FriendIcon: React.FC<{ friend: Friend, className?: string, size?: "lg" | "md" }> = ({ friend, className, size }) => {
  return (
    <li className={className}>
      <div
        className={`bg-gray-100 ${size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'} flex items-center justify-center rounded-full aspect-square font-bold text-gray-500 border border-white`}
        title={friend.name}
      >
        {friend.photo ? friend.photo : friend.name.charAt(0)}
      </div>
    </li>
  )
}

export default FriendIcon;