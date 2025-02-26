import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Bill, type Friend } from "@/types";
import { useState } from "react";
import { FriendSelector } from "./friend-selector";
import { BillSummary } from "./bill-summary";

const ItemsPurchased = ({ bill }: { bill: Bill }) => {
  const [itemFriends, setItemFriends] = useState<Record<string, Friend[]>>({});

  const handleAddFriendToItem = (friend: Friend, itemId: string) => {
    const newFriends = [...(itemFriends[itemId] || [])];
    const friendIndex = newFriends.findIndex(
      (f) => f.friend_id === friend.friend_id
    );
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
                <FriendSelector
                  itemId={item.item_id}
                  friends={bill.friends || []}
                  selectedFriends={itemFriends[item.item_id] || []}
                  onFriendSelect={handleAddFriendToItem}
                />
              </div>
            </TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell className="text-right">
              {item.total_price.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <BillSummary financial_summary={bill.financial_summary} />
    </Table>
  );
};

export default ItemsPurchased;
