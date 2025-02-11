import React, { useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
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
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "item",
    drop: (item: ItemProps) => {
      moveItem(personIndex, -1, item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`p-4 bg-white shadow rounded-lg mb-4 transition-transform transform ${
        isOver && canDrop ? "scale-105 border-2 border-blue-500" : ""
      }`}
    >
      <h4 className="font-bold text-gray-800">
        {person.name} - Total: RM{person.share_amount.toFixed(2)}
      </h4>
      <ul className="mt-2 space-y-2">
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
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "item",
    drop: (item: ItemProps) => {
      moveItem(-1, item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`p-4 w-full h-fit bg-gray-50 shadow rounded-lg mb-4 border-dashed border-2 transition-transform transform ${
        isOver && canDrop ? "scale-105 border-blue-500" : "border-gray-300"
      }`}
    >
      <h4 className="font-bold text-gray-800">Unassigned Items</h4>
      <ul className="mt-2 space-y-2">
        {unassigned_items.map((item) => (
          <Item key={item.item_id} {...item} />
        ))}
      </ul>
    </div>
  );
};

export const PeopleShare: React.FC<{ receipt: Receipt }> = ({ receipt }) => {
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
        updatedUnassignedItems = updatedUnassignedItems.filter(
          (i) => i.item_id !== item.item_id
        );
      }

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

  const isMobile = window.innerWidth <= 768;

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend} options={{ enableMouseEvents: true }}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
          <UnassignedItems
            unassigned_items={unassignedItems}
            moveItem={(personIndex, item) => moveItem(personIndex, -1, item)}
          />
          <div className="w-full">
            {peopleShare.map((person, index) => (
              <PersonList
                key={person.person_id}
                person={person}
                index={index}
                moveItem={moveItem}
              />
            ))}
          </div>
        </div>
      </div>
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
      className={`p-3 bg-gray-100 border rounded-lg flex justify-between items-center cursor-move transition-transform transform hover:scale-105 shadow-sm ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span className="font-medium text-gray-700">{name}</span>
      <span className="font-semibold text-gray-800">RM{total_price.toFixed(2)}</span>
    </li>
  );
};

export default PeopleShare;
