import { useLocation } from "react-router-dom";
import { type Bill } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ItemsPurchased from "@/components/bill/items-purchased";

const Bill = () => {
  const location = useLocation();
  const bill = location.state?.billData as Bill | undefined;

  if (!bill) {
    return <div>No bill data found.</div>;
  }

  return (
    <div>
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold">{bill.restaurant_name}</h3>
              <p className="text-sm text-muted-foreground">{bill.date}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                Total: RM {bill.financial_summary.total.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                {bill.financial_summary.tax > 0 &&
                  `Tax: RM ${bill.financial_summary.tax.toFixed(2)}`}
                {bill.financial_summary.service_charge > 0 &&
                  `Service Charge: RM ${bill.financial_summary.service_charge.toFixed(
                    2
                  )}`}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ItemsPurchased bill={bill} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Bill;
