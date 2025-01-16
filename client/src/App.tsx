import BillDetails from "@/components/bill-details";
import BaseLayout from "@/layouts";
import UploadReceipt from "./components/upload-receipt";
import { useState, ChangeEvent} from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [receipt, setReceipt] = useState();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null)
  }

  const getSplitBill = async () => {
    if (!file) return;
    const formData = new FormData()
    formData.append("file", file);

    const response = await fetch('http://localhost:8000/upload/', {
      method: 'POST',
      body: formData
    });

    const responseData = await response.json()
    setReceipt(responseData.result)
  }

  return (
    <BaseLayout>
      <UploadReceipt onSplitBill={getSplitBill} onUploadImage={handleFileChange} />
      <BillDetails receipt={receipt} />
    </BaseLayout>
  );
}
