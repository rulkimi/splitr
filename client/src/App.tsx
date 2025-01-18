import BillDetails from "@/components/bill-details";
import BaseLayout from "@/layouts";
import UploadReceipt from "@/components/upload-receipt";
import PeopleShare from "@/components/people-share";
import { useState, ChangeEvent } from "react";

export interface Item {
  item_id: string;
  name: string;
  quantity: number;
  unit_price?: number;
  total_price: number;
}

export interface Receipt {
  receipt_id: string;
  metadata: {
    restaurant_name: string
    date: string
    time: string
    receipt_number: string
  }
  items: Item[]
  financial_summary: {
    subtotal: number
    tax: number | null
    total: number
    service_charge: number | null
  }
  split_details: {
    type: string
    num_people: number
    unassigned_items: Item[]
    shares: {
      person_id: string
      name: string
      assigned_items: Item[]
      share_amount: number
    }[]
  }
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [receipt, setReceipt] = useState<Receipt>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const getSplitBill = async (
    numPeople: string | undefined,
    remarks: string | undefined,
    splitEvenly: boolean
  ) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const response = await fetch(
      `http://localhost:8000/analyze/?num_people=${numPeople}&split_evenly=${splitEvenly}&remarks=${remarks}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const responseData = await response.json();
    setLoading(false);
    setReceipt(responseData);
  };

  return (
    <BaseLayout className="space-y-4">
      {receipt ? (
        <div className="space-y-4">
          <BillDetails receipt={receipt} />
          <PeopleShare receipt={receipt} />
        </div>
      ) : (
        <UploadReceipt
          onSplitBill={getSplitBill}
          onUploadImage={handleFileChange}
          loading={loading}
        />
      )}
    </BaseLayout>
  );
}
