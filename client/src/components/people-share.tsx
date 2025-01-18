import React, { useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDrag } from "react-dnd";
import { type Item as ItemProps, type Receipt } from "@/App";

interface PersonShare {
  person_id: string;
  name: string;
  assigned_items: ItemProps[];
  share_amount: number;
}

const PersonList: React.FC<{
  person: PersonShare;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number, item: any) => void;
}> = ({ person, index: personIndex, moveItem }) => {
  const [, drop] = useDrop({
    accept: "item",
    drop: (item: ItemProps) => {
      moveItem(personIndex, -1, item);
    },
  });

  return (
    <div ref={drop} className="p-4 border rounded-md mb-4">
      <h4 className="font-semibold">
        {person.name} - Total: ${person.share_amount.toFixed(2)}
      </h4>
      <ul>
        {person.assigned_items.map((item) => (
          <Item key={item.item_id} {...item} />
        ))}
      </ul>
    </div>
  );
};

const UnassignedItems: React.FC<{
  unassigned_items: ItemProps[];
  moveItem: (personIndex: number, item: ItemProps) => void;
}> = ({ unassigned_items, moveItem }) => {
  const [, drop] = useDrop({
    accept: "item",
    drop: (item: ItemProps) => {
      moveItem(-1, item);
    },
  });

  return (
    <div ref={drop} className="p-4 border rounded-md mb-4 bg-gray-50">
      <h4 className="font-semibold">Unassigned Items</h4>
      <ul>
        {unassigned_items.map((item) => (
          <Item key={item.item_id} {...item} />
        ))}
      </ul>
    </div>
  );
};

export const PeopleShare = ({ receipt }: { receipt: Receipt }) => {
  const [peopleShare, setPeopleShare] = useState<PersonShare[]>(
    receipt.split_details.shares
  );
  const [unassignedItems, setUnassignedItems] = useState<ItemProps[]>(
    receipt.split_details.unassigned_items
  );

  const moveItem = (
    targetPersonIndex: number,
    targetItemIndex: number = -1,
    item: ItemProps
  ) => {
    setPeopleShare((prevPeopleShare) => {
      const newPeopleShare = [...prevPeopleShare];
      let updatedUnassignedItems = [...unassignedItems];

      // Find and remove item from source
      const sourcePersonIndex = newPeopleShare.findIndex((person) =>
        person.assigned_items.some((i) => i.item_id === item.item_id)
      );

      if (sourcePersonIndex !== -1) {
        const sourcePerson = newPeopleShare[sourcePersonIndex];
        const sourceItemIndex = sourcePerson.assigned_items.findIndex(
          (i) => i.item_id === item.item_id
        );
        sourcePerson.assigned_items.splice(sourceItemIndex, 1);
        sourcePerson.share_amount = sourcePerson.assigned_items.reduce(
          (sum, i) => sum + i.total_price,
          0
        );
      } else {
        // If the item is in unassignedItems
        updatedUnassignedItems = updatedUnassignedItems.filter(
          (i) => i.item_id !== item.item_id
        );
      }

      // Assign item to the target person or back to unassignedItems
      if (targetPersonIndex === -1) {
        updatedUnassignedItems.push(item);
      } else {
        const targetPerson = newPeopleShare[targetPersonIndex];
        if (targetItemIndex === -1) {
          targetPerson.assigned_items.push(item);
        } else {
          targetPerson.assigned_items.splice(targetItemIndex, 0, item);
        }
        targetPerson.share_amount = targetPerson.assigned_items.reduce(
          (sum, i) => sum + i.total_price,
          0
        );
      }

      setUnassignedItems(updatedUnassignedItems);
      return newPeopleShare;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">People Share</div>
        </CardHeader>
        <CardContent>
          <UnassignedItems
            unassigned_items={unassignedItems}
            moveItem={(personIndex, item) =>
              moveItem(personIndex, -1, item)
            }
          />
          {peopleShare.map((person, index) => (
            <PersonList
              key={person.person_id}
              person={person}
              index={index}
              moveItem={moveItem}
            />
          ))}
        </CardContent>
      </Card>
    </DndProvider>
  );
};

export const Item: React.FC<ItemProps> = ({ item_id, name, total_price }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "item",
    item: { item_id, name, total_price },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <li
      ref={drag}
      className={`p-2 bg-gray-100 border rounded-md mb-2 flex justify-between cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span>{name}</span>
      <span>${total_price.toFixed(2)}</span>
    </li>
  );
};

export default PeopleShare;
