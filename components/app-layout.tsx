import React from "react";
import Footer from "./home/footer";
import NavbarLayout from "./navs/navbar-layout";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <NavbarLayout />
      <main>{children}</main>
      <Footer />
    </>
  );
};
