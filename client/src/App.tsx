import BillDetails from "@/components/bill-details";
import BaseLayout from "@/layouts";
import UploadReceipt from "./components/upload-receipt";

export default function Home() {
  return (
    <BaseLayout>
      <UploadReceipt />
      <BillDetails />
    </BaseLayout>
  );
}
