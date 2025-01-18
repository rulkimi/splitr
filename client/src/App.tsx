import BillDetails from "@/components/bill-details";
import BaseLayout from "@/layouts";
import UploadReceipt from "@/components/upload-receipt";
import PeopleShare from "@/components/people-share";
import { useState, ChangeEvent } from "react";
import { Button } from "./components/ui/button";

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
  const [showReceipt, setShowReceipt] = useState<boolean>(true);

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
          {showReceipt ? (
            <>
              <BillDetails receipt={receipt} />
              <div className="flex justify-center gap-2">
                <Button variant="secondary">Upload New Receipt</Button>
                <Button onClick={() => setShowReceipt(false)}>Assign Items</Button>
              </div>
            </>
          ) : (
            <>
              <PeopleShare receipt={receipt} />
              <div className="flex justify-center gap-2">
                <Button variant="secondary" onClick={() => setShowReceipt(true)}>Check Receipt</Button>
                <Button>Share</Button>
              </div>
            </>
          )}
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
