import { PropsWithChildren } from "react";

const BaseLayout = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={`container mx-auto p-4 ${className}`}>
      {children}
    </div>
  );
}

export default BaseLayout;
