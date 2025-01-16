import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "./ui/button";

const UploadReceipt = () => {
  const [file, setFile] = useState<File | null>(null);

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
    console.log(responseData)
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="text-lg font-semibold">Upload Receipt</h3>
          <p className="text-sm text-muted-foreground">
            Upload a receipt image and specify splitting options
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <Input
          id="receipt-image"
          type="file"
          onChange={handleFileChange}
        />
        <Button onClick={getSplitBill}>
          Upload
        </Button>
      </CardContent>
    </Card>
  )
}

export default UploadReceipt;