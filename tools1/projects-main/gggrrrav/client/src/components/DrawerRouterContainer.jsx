import React from 'react'
import { withRouter } from 'react-router-dom'
import {
  registerForLocalization,
  provideLocalizationService,
} from '@progress/kendo-react-intl'
import { Drawer, DrawerContent, DrawerItem } from '@progress/kendo-react-layout'
import { Header } from './Header.jsx'
import Footer from './Footer'
import { loadMessages } from '@progress/kendo-react-intl'
import { enMessages } from './../messages/en-US'
import { useIsAuthenticated } from '@azure/msal-react'
import { config } from './../authUtility/config'
import { AccountInfoDetails } from '../authUtility/AccountInfo.js'
import { MenuConfig } from './../config/RoleBasedMenu'
loadMessages(enMessages, 'en-US')

const items = MenuConfig.drawer_menu

const CustomItem = (props) => {
  const roleLoggedIn = AccountInfoDetails().AccountRole
  const isSSOAuthenticated = useIsAuthenticated()
  const isAuthenticated =
    config['work_env'] === 'DEPLOYMENT' ? isSSOAuthenticated : true
  const images = require.context('./../assets/menu_icons', true)
  const images_white = require.context('./../assets/menu_icons_white', true)
  let menuimage, menuname
  if (props.role.includes(roleLoggedIn) || props.role === 'All') {
    if (isAuthenticated === true && props.name === 'login') {
      menuimage = images(`./logout.png`)
      menuname = enMessages['cdp_menus']['logout']
      items[props.id]['name'] = 'logout'
      items[props.id]['route'] = '/azure_logout'
    } else if (isAuthenticated === false && props.name === 'logout') {
      menuimage = images(`./login.png`)
      menuname = enMessages['cdp_menus']['login']
      items[props.id]['name'] = 'login'
      items[props.id]['route'] = '/azure_login'
    }
    if (props.selected === true) {
      menuimage = images_white(`./${props.name}.png`)
      menuname = enMessages['cdp_menus'][props.name]
    } else {
      menuimage = images(`./${props.name}.png`)
      menuname = enMessages['cdp_menus'][props.name]
    }

    // console.log(props);
    return (
      <DrawerItem {...props}>
        <div
          style={{
            width: 100,
            alignItems: 'center',
            whiteSpace: 'pre-wrap',
          }}
        >
          <img src={menuimage} className="left_menu_icon" alt="Drawer Menu" />
          <div className="emptyspaceicon"></div>
          <div className="item-descr-wrap">
            <span className="item-descr" style={{ overflowWrap: 'break-word' }}>
              {menuname}
            </span>
          </div>
        </div>
      </DrawerItem>
    )
  } else {
    return <></>
  }
}

class DrawerRouterContainer extends React.Component {
  state = {
    expanded: false,
    selectedId: items.findIndex((x) => x.selected === true),
    isSmallerScreen: window.innerWidth < 768,
  }

  resizeWindow = () => {
    this.setState({ isSmallerScreen: window.innerWidth < 768 })
  }

  handleClick = () => {
    this.setState((e) => ({ expanded: !e.expanded }))
  }

  handleSelect = (e) => {
    this.setState({ selectedId: e.itemIndex, expanded: false })
    this.props.history.push(e.itemTarget.props.route)
  }

  getSelectedItem = (pathName) => {
    let currentPath = items.find((item) => item.route === pathName)

    if (typeof currentPath == 'undefined') {
      var currentrootpath = pathName.split('/').pop().split('_')[0]
      return currentrootpath
      //
    } else {
      if (currentPath.name) {
        return currentPath.name
      }
    }
  }

  componentDidUpdate() {
    try {
      const parent = window.parent
      if (parent) {
        parent.postMessage(
          { url: this.props.location.pathname, demo: true },
          '*',
        )
      }
    } catch (err) {
      console.warn('Cannot access iframe')
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeWindow, false)
    this.resizeWindow()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow)
  }

  render() {
    let selected = this.getSelectedItem(this.props.location.pathname)
    const localizationService = provideLocalizationService(this)

    return (
      <React.Fragment>
        <Header
          onButtonClick={this.handleClick}
          page={localizationService.toLanguageString(`cdp_menus.${selected}`)}
        />
        <Drawer
          expanded={this.state.expanded}
          item={CustomItem}
          items={items.map((item) => ({
            ...item,

            // text: localizationService.toLanguageString(`cdp_menus.${item.name}`),
            title: localizationService.toLanguageString(
              `cdp_menus.${item.name}`,
            ),
            selected: item.name === selected,
          }))}
          position="start"
          mode={this.state.isSmallerScreen ? 'overlay' : 'push'}
          mini={this.state.isSmallerScreen ? false : true}
          onOverlayClick={this.handleClick}
          onSelect={this.handleSelect}
        >
          <DrawerContent style={{ backgroundColor: 'white', minheight: 500 }}>
            {this.props.children}
          </DrawerContent>
        </Drawer>
        <Footer />
      </React.Fragment>
    )
  }
}

registerForLocalization(DrawerRouterContainer)

export default withRouter(DrawerRouterContainer)
