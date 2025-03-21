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
// import { useNavigate } from "react-router-dom";
import { type FriendSummaryType } from "@/types";
import FriendSummary from "./friend-summary";
import { formatCurrency } from "@/lib/utils";

const ItemsPurchased = ({ bill }: { bill: Bill }) => {
  // const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [itemFriends, setItemFriends] = useState<Record<string, Friend[]>>(() =>
    bill.items.reduce((acc, item) => {
      acc[item.item_id] = item.assigned_to || [];
      return acc;
    }, {} as Record<string, Friend[]>)
  );
  const [friendSummary, setFriendSummary] = useState<FriendSummaryType[]>();

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
      const basePricePerPerson =
        assignedFriends.length > 0
          ? item.total_price / assignedFriends.length
          : item.total_price;

      const updatedAssignedTo = assignedFriends.map((friend) => ({
        ...friend,
        amount_owed:
          friend.amount_owed === undefined
            ? basePricePerPerson
            : friend.amount_owed + basePricePerPerson,
      }));

      return {
        ...item,
        assigned_to: updatedAssignedTo,
      };
    });

    const numFriends = bill.friends.length;
    const taxPerPerson = numFriends > 0 ? bill.financial_summary.tax / numFriends : bill.financial_summary.tax;
    const serviceChargePerPerson = numFriends > 0 ? bill.financial_summary.service_charge / numFriends : bill.financial_summary.service_charge;


    const updatedBill = {
      ...bill,
      items: updatedItems,
      friends: bill.friends.map((friend) => {
        const friendItems = updatedItems.filter((item) =>
          item.assigned_to?.find((f) => f.friend_id === friend.friend_id)
        );
        const totalAmountOwed = friendItems.reduce((sum, item) => {
          const friendItem = item.assigned_to?.find(
            (f) => f.friend_id === friend.friend_id
          );
          return sum + (friendItem?.amount_owed || 0);
        }, 0) + taxPerPerson + serviceChargePerPerson;
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

    const friendSummary = updatedBill.friends.map((friend) => ({
      id: friend.friend_id,
      name: friend.name,
      photo: friend.photo,
      amountOwed: friend.amount_owed.toFixed(2),
      items: friend.items.map((item) => ({
        itemId: item.item_id,
        itemName: item.name,
        amountOwedForItem: (
          item.assigned_to?.find((f) => f.friend_id === friend.friend_id)
            ?.amount_owed || 0
        ).toFixed(2),
      })),
    }));
    setFriendSummary(friendSummary);
    setShowSummary(true);
  };

  return (
    <div>
      {showSummary && friendSummary ? (
        <FriendSummary friendSummary={friendSummary} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Price (RM)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bill.items.map((item, index) => (
              <TableRow key={`${item.item_id}-${index}`}>
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
                  {formatCurrency(item.total_price.toFixed(2)).replace("RM", "")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <BillSummary financial_summary={bill.financial_summary} />
        </Table>
      )}

      <div className="flex space-x-2 py-4">
        <Link to="/" className="w-full">
          <Button className="w-full" variant="outline" size="lg">
            Back
          </Button>
        </Link>
        <Button
          className="w-full"
          variant="default"
          size="lg"
          onClick={handleProceed}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default ItemsPurchased;
