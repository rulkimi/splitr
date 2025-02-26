import Friends from "@/components/friends";
import Bills from "@/components/bill/bills";

export default function Home() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="font-semibold">Friends</span>
        <Friends />
      </div>
      <div className="space-y-2">
        <Bills />
      </div>
    </div>
  );
}
