import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { type Bill } from "@/types";

export const BillSummary = ({ financial_summary }: Pick<Bill, 'financial_summary'>) => (
  <TableFooter>
    {financial_summary.tax > 0 && (
      <TableRow>
        <TableCell colSpan={2}>Tax</TableCell>
        <TableCell className="text-right">RM {financial_summary.tax.toFixed(2)}</TableCell>
      </TableRow>
    )}
    {financial_summary.service_charge > 0 && (
      <TableRow>
        <TableCell>Service Charge</TableCell>
        <TableCell colSpan={2} className="text-right">
          RM {financial_summary.service_charge.toFixed(2)}
        </TableCell>
      </TableRow>
    )}
    <TableRow>
      <TableCell>Total</TableCell>
      <TableCell colSpan={2} className="text-right">
        RM {financial_summary.subtotal.toFixed(2)}
      </TableCell>
    </TableRow>
  </TableFooter>
);