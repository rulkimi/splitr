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

const BillDetails = ({ receipt }: { receipt: Receipt }) => {
  return (
    <Card>
      <CardHeader>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">{receipt.restaurant_name}</h3>
            <p className="text-sm text-muted-foreground">{receipt.date}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">Total: RM {receipt.total}</p>
            <p className="text-sm text-muted-foreground">
              Tax: RM {receipt.tax}
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

// const items = [
//   { name: "Pasta Carbonara", amount: "2", price: "30.00" },
//   { name: "Grilled Salmon", amount: "1", price: "25.00" },
//   { name: "Caesar Salad", amount: "1", price: "12.00" },
//   { name: "Tiramisu", amount: "2", price: "16.00" },
// ]

interface Item {
  name: string;
  quantity: number;
  total_price: string;
}

interface Receipt {
  total: string;
  restaurant_name: string;
  date: string;
  tax: string;
  items: Item[];
}

const ItemsPurchased = ({ receipt }: { receipt: Receipt }) => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipt.items.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell className="text-right">{item.total_price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">RM {receipt.financial_summary.total}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default BillDetails;
