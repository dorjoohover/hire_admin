import { Suspense } from "react";

const RootLayout = ({ children }) => {
  return <Suspense fallback={<p>loading...</p>}>{children}</Suspense>;
};
export default RootLayout;
