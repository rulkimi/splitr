import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Bill } from "@/types";

const BillDetails = ({ bill }: { bill: Bill }) => {
  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">{bill.restaurant_name}</h3>
            <p className="text-sm text-muted-foreground">{bill.date}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">Total: RM {bill.financial_summary.total.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {bill.financial_summary.tax && `Tax: RM ${bill.financial_summary.tax.toFixed(2)}`}
              {bill.financial_summary.service_charge && `Service Charge: RM ${bill.financial_summary.service_charge.toFixed(2)}`}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ItemsPurchased bill={bill} />
      </CardContent>
    </Card>
  );
};

const ItemsPurchased = ({ bill }: { bill: Bill }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="text-right">Price (RM)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bill.items.map((item) => (
          <TableRow key={item.item_id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell className="text-right">{item.total_price.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {bill.financial_summary.tax > 0 && (
          <TableRow>
            <TableCell colSpan={2}>Tax</TableCell>
            <TableCell className="text-right">RM {bill.financial_summary.tax.toFixed(2)}</TableCell>
          </TableRow>
        )}
        {bill.financial_summary.service_charge > 0 && (
          <TableRow>
            <TableCell>Service Charge</TableCell>
            <TableCell colSpan={2} className="text-right">RM {bill.financial_summary.service_charge.toFixed(2)}</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell colSpan={2} className="text-right">RM {bill.financial_summary.subtotal.toFixed(2)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default BillDetails;
