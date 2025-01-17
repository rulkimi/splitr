import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface UploadReceiptProps {
  onUploadImage: (e: ChangeEvent<HTMLInputElement>) => void
  onSplitBill: (numPeople: string | undefined, remarks: string | undefined) => void
  loading: boolean
}

const UploadReceipt = ({ onUploadImage, onSplitBill, loading}: UploadReceiptProps) => {
  const [numPeople, setNumPeople] = useState<string>();
  const [remarks, setRemarks] = useState<string>();
  
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

      <CardContent className="space-y-2">
        <Input
          id="receipt-image"
          type="file"
          onChange={onUploadImage}
        />
        <Input
          id="num-people"
          value={numPeople}
          placeholder="Number of people to split"
          onChange={(e) => setNumPeople(e.target.value)}
        />
        <Textarea 
          id="remarks"
          value={remarks}
          placeholder="Sarah had the hamburger and John drank the Iced Lemon Tea"
          onChange={(e) => setRemarks(e.target.value)}
        />
        <Button onClick={() => onSplitBill(numPeople, remarks)} disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Upload
        </Button>
      </CardContent>
    </Card>
  )
}

export default UploadReceipt;