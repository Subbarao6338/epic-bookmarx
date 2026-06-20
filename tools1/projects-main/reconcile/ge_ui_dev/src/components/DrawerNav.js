import React from "react";
import { Container } from "react-bootstrap";
import { Drawer, DrawerContent, DrawerItem } from '@progress/kendo-react-layout';
import { Link, Outlet, useLocation, useNavigate, useParams, } from "react-router-dom";

import projects_icon from "../assets/icons/projects.png";
import suites_icon from "../assets/icons/suites.png";

const items = [
  { text: "Projects", link: "/projects", icon_scr: projects_icon },
  { text: "Suites", link: "/suites", icon_scr: suites_icon },
]

const styles = {
  side_nav: {
    width: 180,
    flexShrink: 0,
    minHeight: "calc(100vh - 75px)",
    backgroundColor: "white",
    marginLeft: -15,
    paddingTop:20,
  },
  p3_fill: {
    padding: '10px 10px 5px 10px',
    marginLeft: 10,
  },
  side_nav_sticky: {
    position: "sticky",
    top: 60,
    maxHeight: "calc(100vh - 0px)",
  },
  main_div: {
    width: 'calc(100% - 00px)',
  }
};

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

    return (
      <Component
        {...props}
        location={location}
      />
    );
  }
  return ComponentWithRouterProp;
}

const state = {
        expanded: false,
        selectedId: items.findIndex(x => x.selected === true),
        isSmallerScreen: window.innerWidth < 768
    }

const resizeWindow = () => {
        this.setState({ isSmallerScreen: window.innerWidth < 768 })
    }

const handleClick = () => {
        this.setState((e) => ({expanded: !e.expanded}));
    }

const handleSelect = (e) => {
        this.setState({selectedId: e.itemIndex, expanded: false});
        this.props.history.push(e.itemTarget.props.route);
    }

const getSelectedItem = (pathName) => {
        let currentPath = items.find(item => item.route === pathName);

        if (typeof currentPath == 'undefined') {
            var currentrootpath = pathName.split('/').pop().split('_')[0];
            return currentrootpath;
        }
        else {
            if (currentPath.name) {
                return currentPath.name;
            }
        }
    }

const componentDidUpdate=() =>{
        try {
            const parent = window.parent;
            if(parent) {
                parent.postMessage({ url: this.props.location.pathname, demo: true }, "*")
            }
        } catch(err) {
            console.warn('Cannot access iframe')
        }
    }

const componentDidMount=()=> {
        window.addEventListener('resize', this.resizeWindow, false)
        this.resizeWindow();
    }

const componentWillUnmount=() =>{
        window.removeEventListener('resize', this.resizeWindow)
    }

function DrawerNav() {
let selected = this.getSelectedItem(this.props.location.pathname);
  return (
    <div className="d-flex">
      <div style={styles.side_nav}>
      <AppNavbar onButtonClick={this.handleClick} />
                <Drawer
                    expanded={this.state.expanded}
                    animation={{duration: 100}}
                    item={CustomItem}
                    items={items.map((item) => ({
                                ...item, selected: item.name === selected
                            }))
                    }
                    position='start'

                    mode={this.state.isSmallerScreen ? 'overlay' : 'push'}
                    mini={this.state.isSmallerScreen ? false : true}

                    onOverlayClick={this.handleClick}
                    onSelect={this.handleSelect}
                >
        <SideNav />
        </Drawer>
      </div>
      <div className="p-2 flex-fill" style={styles.p3_fill}>
        <div className="p-2" style={styles.main_div}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DrawerNav;

function SideNav() {
  return (
    <div style={styles.side_nav_sticky}>
      <ul className="list-group">
        {items.map(({ text, link, icon_scr }) => (
          <li key={text} className="d-block list-group-item-action">
            <Link className="nav-link link-dark" style={{fontSize:20}} to={link}>
              <img src={icon_scr} width={24} height={24} alt={text} />
              <span className="ms-2">{text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

