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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { type Bill } from "@/types";
import FriendIcon from "@/components/friend-icon";
import { Plus } from "lucide-react";
import { type Friend } from "@/types";
import { useState } from "react";

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
              {bill.financial_summary.tax > 0 && `Tax: RM ${bill.financial_summary.tax.toFixed(2)}`}
              {bill.financial_summary.service_charge > 0 && `Service Charge: RM ${bill.financial_summary.service_charge.toFixed(2)}`}
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
  const [itemFriends, setItemFriends] = useState<Record<string, Friend[]>>({});

  const handleAddFriendToItem = (friend: Friend, itemId: string) => {
    const newFriends = [...(itemFriends[itemId] || [])];
    const friendIndex = newFriends.findIndex((f) => f.friend_id === friend.friend_id);
    if (friendIndex === -1) {
      newFriends.push(friend);
    } else {
      newFriends.splice(friendIndex, 1);
    }
    setItemFriends({ ...itemFriends, [itemId]: newFriends });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Price (RM)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bill.items.map((item) => (
          <TableRow key={item.item_id}>
            <TableCell>
              <div className="space-y-1">
                <div>{item.name}</div>
                <ul className="flex gap-[0.5px]">
                  <Popover>
                    <PopoverTrigger>
                      <div
                        className="bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full aspect-square font-bold border-2 border-gray-400 border-dashed"
                      >
                        <Plus className="text-gray-500" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent side="top">
                      <span className="flex gap-0.5">
                        {bill.friends?.map((friend) => (
                          <FriendIcon
                            key={friend.friend_id}
                            className={`list-none ${
                              (itemFriends[item.item_id] || []).find(
                                (f) => f.friend_id === friend.friend_id
                              )
                                ? "opacity-100"
                                : "opacity-50"
                            }`}
                            size="lg"
                            friend={friend}
                            onClick={() => handleAddFriendToItem(friend, item.item_id)}
                          />
                        ))}
                      </span>
                    </PopoverContent>
                  </Popover>
                  {(itemFriends[item.item_id] || []).map((friend) => (
                    <FriendIcon key={friend.friend_id} friend={friend} size="sm" />
                  ))}
                </ul>
              </div>
            </TableCell>
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
