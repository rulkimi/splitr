import BaseLayout from "@/layouts";
import Friends from "@/components/friends";
import Bills from "@/components/bills";

export default function Home() {
  return (
    <BaseLayout className="space-y-4">
      <div className="space-y-2">
        <span className="font-semibold">Friends</span>
        <Friends />
      </div>
      <div className="space-y-2">
        <Bills />
      </div>
    </BaseLayout>
  );
};



