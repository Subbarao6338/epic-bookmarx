import React from "react";
import * as PropTypes from "prop-types";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import help_icon from "../assets/icons/help_icon.png";
import header_icon from "../assets/icons/header.png";
import graviton_logo from "../assets/icons/graviton.png";

const AppNavbar = (props) => {
  const { onButtonClick } = props;

  return (
    <Navbar
      className="shadow"
      style={{
        backgroundColor: "#F2F2F2",
        marginLeft: -15,
        marginRight: -12,
        padding: 0,
        // backgroundImage: `url(${header_icon})`,
      }}
      sticky="top"
    >
      <Container fluid>
        <Nav.Link
          className={"k-icon k-i-menu"}
          style={{ cursor: "pointer", color: "#045fb4", fontSize: "20px" }}
          onClick={onButtonClick}
        />
        &nbsp;
        <Navbar.Brand
          href="https://graviton.azurewebsites.net/home"
          className="me-auto"
        >
          <img
            alt="graviton_logo"
            src={graviton_logo}
            style={{
              width: 150,
              marginTop: -12,
            }}
            className="ml-auto"
          ></img>
          {/* </Navbar.Brand>
        <Navbar.Brand> */}
          <Link style={{ textDecoration: "none" }} to="/">
            <span
              style={{
                fontSize: "30px",
                color: "#045fb4",
              }}
            >
              <b>&nbsp; Reconcile</b>
            </span>
          </Link>
        </Navbar.Brand>
        <Nav.Link href="/help">
          <img
            src={help_icon}
            alt="help"
            width={20}
            height={20}
            className="text-light"
          />
          &nbsp;
          <span className="me-1" style={{ color: "#045fb4" }}>
            Help
          </span>
        </Nav.Link>
      </Container>
    </Navbar>
  );
};

AppNavbar.displayName = "Header";
AppNavbar.propTypes = {
  page: PropTypes.string,
  onButtonClick: PropTypes.func,
};

export default AppNavbar;
