import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image, Users, FileText, MessageCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface UploadReceiptProps {
  onUploadImage: (e: ChangeEvent<HTMLInputElement>) => void;
  onSplitBill: (
    numPeople: string | undefined,
    remarks: string | undefined,
    splitEvenly: boolean
  ) => void;
  loading: boolean;
}

const UploadReceipt = ({ onUploadImage, onSplitBill, loading }: UploadReceiptProps) => {
  const [numPeople, setNumPeople] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [splitEvenly, setSplitEvenly] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Upload Receipt</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload a receipt image and specify splitting options
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="receipt-image" className="flex items-center space-x-2">
            <Image className="w-4 h-4" />
            <span>Receipt Image</span>
          </Label>
          <Input
            id="receipt-image"
            type="file"
            onChange={onUploadImage}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="num-people" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Number of People</span>
          </Label>
          <Input
            id="num-people"
            value={numPeople}
            placeholder="Enter number of people to split"
            onChange={(e) => setNumPeople(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="remarks" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Remarks</span>
          </Label>
          <Textarea
            id="remarks"
            value={remarks}
            placeholder="E.g., Sarah had the hamburger and John drank the Iced Lemon Tea"
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-2">
            <Switch
              id="split-evenly"
              checked={splitEvenly}
              onCheckedChange={setSplitEvenly}
            />
            <span>Split Evenly</span>
          </Label>
        </div>

        <Button
          onClick={() => onSplitBill(numPeople, remarks, splitEvenly)}
          disabled={loading}
          className="w-full flex justify-center items-center space-x-2"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          <span>Upload</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default UploadReceipt;
