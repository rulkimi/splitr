import { PropsWithChildren } from "react";

const BaseLayout = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={`container max-w-[440px] min-h-screen bg-slate-100 mx-auto p-4 ${className}`}>
      {children}
    </div>
  );
}

export default BaseLayout;
