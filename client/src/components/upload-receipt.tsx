import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "./ui/button";

const UploadReceipt = ({ onUploadImage, onSplitBill}) => {
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