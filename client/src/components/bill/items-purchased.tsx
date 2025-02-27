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
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const ItemsPurchased = ({ bill }: { bill: Bill }) => {
  const [itemFriends, setItemFriends] = useState<Record<string, Friend[]>>(() => (
    bill.items.reduce((acc, item) => {
      acc[item.item_id] = item.assigned_to || [];
      return acc;
    }, {} as Record<string, Friend[]>)
  ));

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

  const handleProceed = async () => {
    const updatedItems = bill.items.map((item) => {
      const assignedFriends = itemFriends[item.item_id] || [];
      const pricePerPerson = assignedFriends.length > 0 ? item.total_price / assignedFriends.length : item.total_price;

      const updatedAssignedTo = assignedFriends.map((friend) => ({
        ...friend,
        amount_owed: friend.amount_owed === undefined ? pricePerPerson : friend.amount_owed + pricePerPerson,
      }));

      return {
        ...item,
        assigned_to: updatedAssignedTo,
      };
    });

    const updatedBill = {
      ...bill,
      items: updatedItems,
      friends: bill.friends.map((friend) => {
        const friendItems = updatedItems.filter((item) =>
          item.assigned_to?.find((f) => f.friend_id === friend.friend_id)
        );
        const totalAmountOwed = friendItems.reduce((sum, item) => {
          const friendItem = item.assigned_to?.find((f) => f.friend_id === friend.friend_id);
          return sum + (friendItem?.amount_owed || 0);
        }, 0);
        return { ...friend, amount_owed: totalAmountOwed, items: friendItems };
      }),
    };

    const { error } = await supabase
      .from("bills")
      .update({ items: updatedBill.items, friends: updatedBill.friends })
      .eq("bill_id", bill.bill_id);
    if (error) {
      console.error("Error updating bill:", error);
    } else {
      console.log("Bill updated successfully!");
    }

    updatedBill.friends.forEach(friend => {
      console.log(`${friend.name} owes RM ${friend.amount_owed.toFixed(2)}`);
      friend.items.forEach(item => {
        const amountOwedForItem = item.assigned_to?.find(f => f.friend_id === friend.friend_id)?.amount_owed || 0;
        console.log(`  - For ${item.name}: RM ${amountOwedForItem.toFixed(2)}`);
      })
    })
  };

  return (
    <div>
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

      <div className="flex space-x-2 py-4">
        <Link to="/" className="w-full">
          <Button className="w-full" variant="outline" size="lg">
            Back
          </Button>
        </Link>
        <Button className="w-full" variant="default" size="lg" onClick={handleProceed}>
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default ItemsPurchased;
