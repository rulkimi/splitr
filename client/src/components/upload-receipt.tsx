import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { ChangeEvent } from "react";
import { Loader2 } from "lucide-react";

interface UploadReceiptProps {
  onUploadImage: (e: ChangeEvent<HTMLInputElement>) => void
  onSplitBill: () => void
  loading: boolean
}

const UploadReceipt = ({ onUploadImage, onSplitBill, loading}: UploadReceiptProps) => {
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

      <CardContent className="flex space-x-2">
        <Input
          id="receipt-image"
          type="file"
          onChange={onUploadImage}
        />
        <Button onClick={onSplitBill} disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Upload
        </Button>
      </CardContent>
    </Card>
  )
}

export default UploadReceipt;