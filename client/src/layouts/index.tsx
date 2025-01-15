import { PropsWithChildren } from "react";

const BaseLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="container mx-auto p-4 max-w-xl">
      {children}
    </div>
  );
}

export default BaseLayout;
