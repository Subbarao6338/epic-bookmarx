import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import AppFooter from "./AppFooter";
//import AppNavbar from "./AppNavbar";

function Layout() {
  return (
    <React.Fragment>

      <Container fluid>
        <Outlet />
      </Container>
      <AppFooter />
    </React.Fragment>
  );
}

export default Layout;
