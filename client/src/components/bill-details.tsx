import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";

const BillDetails = () => {
  return (
    <Card>
      <CardHeader>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">The Fancy Restaurant</h3>
            <p className="text-sm text-muted-foreground">Date: May 15, 2025</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">Total: $120.50</p>
            <p className="text-sm text-muted-foreground">Tax: $10.50</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ItemsPurchased />
      </CardContent>
    </Card>
  )
};

const items = [
  { name: "Pasta Carbonara", amount: "2", price: "30.00" },
  { name: "Grilled Salmon", amount: "1", price: "25.00" },
  { name: "Caesar Salad", amount: "1", price: "12.00" },
  { name: "Tiramisu", amount: "2", price: "16.00" },
]

const ItemsPurchased = () => {
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
        {items.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.amount}</TableCell>
            <TableCell className="text-right">{item.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default BillDetails;
