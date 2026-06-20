import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import { Link } from "react-router-dom";

import Logo from "../../assets/graviton.png";
import ErrorBoundary from "../ErrorBoundary";
import { IconButton, Typography } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import config from "../../config";

const items = [
  {
    text: "Dashboard",
    icon: "k-i-graph",
    selected: true,
    route: "/dashboard",
  },
  // {
  //   text: "Home",
  //   icon: "k-i-home",
  //   route: "/home",
  // },
  {
    text: "Pipeline",
    icon: "k-i-connector",
    route: "/pipeline",
  },
  {
    text: "Runs",
    icon: "k-i-play",
    route: "/pipeline_run",
  },
  {
    text: "Alerts",
    icon: "k-i-bell",
    route: "/alert_v2",
  },
  // {
  //   text: "AI/ML Models",
  //   icon: "k-i-data",
  //   route: "/view",
  // },
  // {
  //   text: "Alert Rule",
  //   icon: "k-i-bell",
  //   route: "/alert",
  // },
  // {
  //   text: "Metric Source",
  //   icon: "k-i-view-source",
  //   route: "/target",
  // },
  // {
  //   text: "Configuration",
  //   icon: "k-i-file-config",
  //   route: "/config",
  // },
];

export function withRouter(Child) {
  return (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
      <Child
        {...props}
        navigate={navigate}
        location={location}
        backgroundColor="blue"
      />
    );
  };
}

const DrawerRouterContainer = (props) => {
  const [expanded, setExpanded] = React.useState(false);
  // const localizationService = useLocalization();
  const handleClick = () => {
    setExpanded(!expanded);
  };

  const onSelect = (e) => {
    props.navigate(e.itemTarget.props.route);
  };

  const setSelectedItem = (pathName = "") => {
    let currentPath = items.find(
      (item) => item.route === "/" + pathName.split("/")[1]
    );

    if (currentPath?.text) {
      return currentPath?.text;
    }
  };

  let selected = setSelectedItem(props.location.pathname);
  return (
    <>
      <header className="header">
        <IconButton color="primary" onClick={handleClick}>
          <MenuIcon />
        </IconButton>
        <Link
          className="mx-2 h-100"
          to={config.graviton_home_url}
          target="_blank"
        >
          <img src={Logo} alt="logo" height="100%" width="auto" />
        </Link>
        <Typography
          component={Link}
          to="/"
          color={"primary"}
          fontSize={28}
          fontWeight={"bold"}
          fontStyle={"italic"}
          sx={{ textDecoration: "none" }}
        >
          Synergizer
        </Typography>
      </header>

      <Drawer
        expanded={expanded}
        position={"start"}
        mode={"push"}
        mini={true}
        items={items.map((item) => ({
          ...item,
          selected: item.text === selected,
        }))}
        id="drawer"
        onSelect={onSelect}
      >
        <DrawerContent>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </DrawerContent>
      </Drawer>

      <footer className="footer px-1" style={{ backgroundColor: "#0e68aa" }}>
        <span>
          &nbsp;2022 &copy;{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://hcl.com"
            style={{ color: "white", textDecoration: "none" }}
          >
            HCL Technologies Ltd.
          </a>
        </span>

        <span className="ms-auto">v0.1</span>
      </footer>
    </>
  );
};

export default withRouter(DrawerRouterContainer);
