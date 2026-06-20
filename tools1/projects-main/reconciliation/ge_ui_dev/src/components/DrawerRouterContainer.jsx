import React from "react";
import { useLocation, useNavigate, useParams, Outlet } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerItem,
} from "@progress/kendo-react-layout";
import AppNavbar from "./AppNavbar.js";
import Footer from "./AppFooter.js";
//import { Button } from '@progress/kendo-react-buttons'

const items = [
  { id: 6, label: "Projects", name: "projects", route: "/projects" },
];

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    // let params = useParams()

    return <Component {...props} location={location} navigate={navigate} />;
  }
  return ComponentWithRouterProp;
}

const CustomItem = (props) => {
  const images = require.context("./../assets/icons", true);
  let menuimage, menuname;
  menuimage = images(`./${props.name}.png`);
  menuname = [props.name];
  return (
    <DrawerItem {...props}>
      <img
        src={menuimage}
        className="left_menu_icon"
        width={20}
        height={20}
        alt="Drawer Menu"
        title={menuname}
      />
      <span className="item-descr">{props.label || menuname}</span>
    </DrawerItem>
  );
};

class DrawerRouterContainer extends React.Component {
  state = {
    expanded: false,
    selectedId: items.findIndex((x) => x.selected === true),
    isSmallerScreen: window.innerWidth < 768,
  };

  resizeWindow = () => {
    this.setState({ isSmallerScreen: window.innerWidth < 768 });
  };

  handleClick = () => {
    this.setState((e) => ({ expanded: !e.expanded }));
  };

  handleSelect = (e) => {
    this.setState({ selectedId: e.itemIndex, expanded: false });
    this.props.navigate(e.itemTarget.props.route);
  };

  getSelectedItem = (pathName) => {
    let currentPath = items.find((item) => item.route === pathName);

    if (typeof currentPath == "undefined") {
      var currentrootpath = pathName.split("/").pop().split("_")[0];
      return currentrootpath;
    } else {
      if (currentPath.name) {
        return currentPath.name;
      }
    }
  };

  componentDidUpdate = () => {
    try {
      const parent = window.parent;
      if (parent) {
        parent.postMessage(
          { url: this.props.location.pathname, demo: true },
          "*"
        );
      }
    } catch (err) {
      console.warn("Cannot access iframe");
    }
  };

  componentDidMount = () => {
    window.addEventListener("resize", this.resizeWindow, false);
    this.resizeWindow();
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resizeWindow);
  };

  render() {
    let selected = this.getSelectedItem(this.props.location.pathname);
    return (
      <React.Fragment>
        <AppNavbar onButtonClick={this.handleClick} />
        <Drawer
          style={{ listStyleType: "none" }}
          expanded={this.state.expanded}
          animation={{ duration: 100 }}
          item={CustomItem}
          items={items.map((item) => ({
            ...item,
            selected: item.name === selected,
          }))}
          position="start"
          mode={this.state.isSmallerScreen ? "overlay" : "push"}
          mini={this.state.isSmallerScreen ? false : true}
          onOverlayClick={this.handleClick}
          onSelect={this.handleSelect}
        >
          <DrawerContent>
            <Outlet />
          </DrawerContent>
        </Drawer>
        <Footer />
      </React.Fragment>
    );
  }
}
export default withRouter(DrawerRouterContainer);
