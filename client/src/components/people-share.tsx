import React, { useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDrag } from "react-dnd";

interface PersonShare {
  name: string;
  items: { id: string; name: string; price: number }[];
  total: number;
}

const initialData: PersonShare[] = [
  {
    name: "sarah",
    items: [{ id: "1", name: "Chili Pan Mee", price: 12.9 }],
    total: 12.9,
  },
  {
    name: "john",
    items: [
      { id: "2", name: "Watermelon Juice", price: 5.4 },
      { id: "3", name: "Fish & Chips", price: 17.9 },
    ],
    total: 23.3,
  },
  {
    name: "person3",
    items: [
      { id: "4", name: "Pineapple Fried Rice", price: 12.9 },
      { id: "5", name: "Creamy Buttermilk Chicken Rice", price: 13.5 },
    ],
    total: 26.4,
  },
  {
    name: "person4",
    items: [
      { id: "6", name: "Tom Yam Fried Beehoon", price: 12.9 },
      { id: "7", name: "Salted Egg Chicken Rice", price: 14.5 },
    ],
    total: 27.4,
  },
];

const PersonList: React.FC<{
  person: PersonShare;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number, item: any) => void;
}> = ({ person, index: personIndex, moveItem }) => {
  const [, drop] = useDrop({
    accept: "item",
    drop: (item: { id: string; name: string; price: number }) => {
      moveItem(personIndex, -1, item);
    },
  });

  return (
    <div ref={drop} className="p-4 border rounded-md mb-4">
      <h4 className="font-semibold">
        {person.name} - Total: ${person.total.toFixed(2)}
      </h4>
      <ul>
        {person.items.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </ul>
    </div>
  );
};

export const PeopleShare: React.FC = () => {
  const [peopleShare, setPeopleShare] = useState<PersonShare[]>(initialData);

  const moveItem = (
    targetPersonIndex: number,
    targetItemIndex: number,
    item: { id: string; name: string; price: number }
  ) => {
    setPeopleShare((prevPeopleShare) => {
      const newPeopleShare = [...prevPeopleShare];
      const sourcePersonIndex = newPeopleShare.findIndex((person) =>
        person.items.some((i) => i.id === item.id)
      );

      if (sourcePersonIndex !== -1) {
        const sourcePerson = newPeopleShare[sourcePersonIndex];
        const sourceItemIndex = sourcePerson.items.findIndex(
          (i) => i.id === item.id
        );
        sourcePerson.items.splice(sourceItemIndex, 1);
        sourcePerson.total = sourcePerson.items.reduce(
          (sum, i) => sum + i.price,
          0
        );
      }

      const targetPerson = newPeopleShare[targetPersonIndex];
      if (targetItemIndex === -1) {
        targetPerson.items.push(item);
      } else {
        targetPerson.items.splice(targetItemIndex, 0, item);
      }
      targetPerson.total = targetPerson.items.reduce(
        (sum, i) => sum + i.price,
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
  id: string;
  name: string;
  price: number;
}

export const Item: React.FC<ItemProps> = ({ id, name, price }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "item",
    item: { id, name, price },
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
      <span>${price.toFixed(2)}</span>
    </li>
  );
};

export default PeopleShare;
