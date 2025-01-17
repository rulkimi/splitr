import React, { useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDrag } from "react-dnd";

interface PersonShare {
  person_id: string
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

export const PeopleShare: React.FC = ({ shares }) => {
  const [peopleShare, setPeopleShare] = useState<PersonShare[]>(shares);

  const moveItem = (
    targetPersonIndex: number,
    targetItemIndex: number,
    item: ItemProps
  ) => {
    setPeopleShare((prevPeopleShare) => {
      const newPeopleShare = [...prevPeopleShare];
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
      }

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
          {peopleShare.map((person, index) => (
            <PersonList
              key={person.name}
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

interface ItemProps {
  item_id: string;
  name: string;
  quantity: number;
  total_price: number;
}

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
