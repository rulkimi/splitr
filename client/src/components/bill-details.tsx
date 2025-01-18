import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Receipt } from "@/App";

const BillDetails = ({ receipt }: { receipt: Receipt }) => {
  return (
    <Card>
      <CardHeader>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">{receipt.metadata.restaurant_name}</h3>
            <p className="text-sm text-muted-foreground">{receipt.metadata.date}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">Total: RM {receipt.financial_summary.total.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {receipt.financial_summary.tax && `Tax: RM ${receipt.financial_summary.tax.toFixed(2)}`}
              {receipt.financial_summary.service_charge && `Service Charge: RM ${receipt.financial_summary.service_charge.toFixed(2)}`}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ItemsPurchased receipt={receipt} />
      </CardContent>
    </Card>
  );
};

const ItemsPurchased = ({ receipt }: { receipt: Receipt }) => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="text-right">Price (RM)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipt.items.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell className="text-right">{item.total_price.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {receipt.financial_summary.tax && (
          <TableRow>
            <TableCell colSpan={2}>Tax</TableCell>
            <TableCell className="text-right">{receipt.financial_summary.tax.toFixed(2)}</TableCell>
          </TableRow>
        )}
        {receipt.financial_summary.service_charge && (
          <TableRow>
            <TableCell colSpan={2}>Service Charge</TableCell>
            <TableCell className="text-right">{receipt.financial_summary.service_charge.toFixed(2)}</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">RM {receipt.financial_summary.subtotal.toFixed(2)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default BillDetails;
