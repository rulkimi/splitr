import { useLocation } from "react-router-dom";
import { type Bill } from "@/types";
import BillDetails from "@/components/bill-details";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Bill = () => {
  const location = useLocation();
  const billData = location.state?.billData as Bill | undefined;

  if (!billData) {
    return <div>No bill data found.</div>;
  }

  return (
    <div>
      <BillDetails bill={billData} />
      <div className="flex space-x-2 py-2">
        <Link to="/" className="w-full">
          <Button className="w-full" variant="outline" size="lg">
            Back
          </Button>
        </Link>
        <Button className="w-full" variant="default" size="lg">
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default Bill;
