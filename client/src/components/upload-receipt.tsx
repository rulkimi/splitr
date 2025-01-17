import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { ChangeEvent } from "react";

interface UploadReceiptProps {
  onUploadImage: (e: ChangeEvent<HTMLInputElement>) => void
  onSplitBill: () => void
}

const UploadReceipt = ({ onUploadImage, onSplitBill}: UploadReceiptProps) => {
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
          onChange={onUploadImage}
        />
        <Button onClick={onSplitBill}>
          Upload
        </Button>
      </CardContent>
    </Card>
  )
}

export default UploadReceipt;