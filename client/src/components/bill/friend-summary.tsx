import { type FriendSummaryType } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

const FriendSummary = ({ friendSummary }: { friendSummary: FriendSummaryType[] }) => {
  return (
    <div className="space-y-4">
      {friendSummary.map((friend) => (
        <Table key={friend.name}>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center space-x-2">
                  {friend.photo && (
                    <img
                      src={friend.photo}
                      alt={`${friend.name}'s photo`}
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  <span>{friend.name}</span>
                </div>
              </TableHead>
              <TableHead className="text-end">
                <span className="font-bold text-black">{formatCurrency(friend.amountOwed)}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {friend.items.map((item) => (
              <TableRow key={item.itemName}>
                <TableCell>{item.itemName}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.amountOwedForItem)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ))}
    </div>
  );
};

export default FriendSummary;