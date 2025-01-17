import BillDetails from "@/components/bill-details";
import BaseLayout from "@/layouts";
import UploadReceipt from "./components/upload-receipt";
import { useState, ChangeEvent} from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [receipt, setReceipt] = useState();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null)
  }

  const getSplitBill = async (numPeople: string | undefined, remarks: string | undefined, splitEvenly: boolean) => {
    if (!file) return;
    const formData = new FormData()
    formData.append("file", file);

    setLoading(true);
    const response = await fetch(`http://localhost:8000/upload/?num_people=${numPeople}&split_evenly=${splitEvenly}&remarks=${remarks}`, {
      method: 'POST',
      body: formData
    });

    const responseData = await response.json();
    setLoading(false);
    setReceipt(responseData.result)
  }

  return (
    <BaseLayout className="space-y-4">
      <UploadReceipt
        onSplitBill={getSplitBill}
        onUploadImage={handleFileChange}
        loading={loading}
      />
      {receipt && <BillDetails receipt={receipt} />}
    </BaseLayout>
  );
}
