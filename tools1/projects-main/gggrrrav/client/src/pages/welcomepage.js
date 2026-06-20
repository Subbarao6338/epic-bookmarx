import * as React from 'react'
import { Label } from '@progress/kendo-react-labels'
import report_menu_img from './../assets/app_images/reports.png'
import report_menu_hover_img from './../assets/app_images/reports-hover.png'
import cost_usage_img from './../assets/app_images/cost-usage.png'
import cost_usage_hover_img from './../assets/app_images/cost-usage-hover.png'
import data_science_img from './../assets/app_images/data-science.png'
import data_science_hover_img from './../assets/app_images/data-science-hover.png'
import data_services_img from './../assets/app_images/data-services.png'
import data_services_hover_img from './../assets/app_images/data-services-hover.png'
import resource_provisioning_img from './../assets/app_images/resource-provisioning.png'
import resource_provisioning_hover_img from './../assets/app_images/resource-provisioning-hover.png'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import Footer from '../components/Footer'
import { SplitButton, SplitButtonItem } from '@progress/kendo-react-buttons'

import { AccountInfoDetails } from '../authUtility/AccountInfo'
import { Avatar } from '@progress/kendo-react-layout'
import Logo from './../assets/graviton.png'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
import { AutoComplete } from '@progress/kendo-react-dropdowns'
import { httpget, httpget_notification } from '../commonUtility/common_http'
import {
  fetch_RecentViewed_url,
  tenant_id,
  projects_config,
  fetch_search_result_url,
  getRecentActivities_url,
} from '../commonUtility/api_urls'
import { Tooltip } from '@progress/kendo-react-tooltip'
import { Popup } from '@progress/kendo-react-popup'
import { ProfileView } from './../components/ProfileView'
import SingleView from './SingleView/index'
function Welcomepage() {
  const [data, setData] = React.useState([]) ///for auto_complete API
  const [value, setValue] = React.useState('')
  const anchor = React.useRef(null)
  const [show, setShow] = React.useState(false)
  const onClick = () => {
    setShow(!show)
  }
  localStorage.setItem('notification_check', true)
  const AccountInfo = AccountInfoDetails()
  React.useEffect(() => {
    const req_value = {
      params: { AccountMail: AccountInfo['AccountMail'] },
    }
    httpget(projects_config, req_value).then((result) => {
      localStorage.setItem('ProjectName', result[0].projectname)
    })
  }, [])
  const onChangesearch = (event) => {
    if (typeof event.target.value === 'string') {
      setValue(event.target.value)
      const req_value = {
        params: { keyword: event.target.value },
      }
      let temp_arr = []
      httpget_notification(fetch_search_result_url, req_value).then(
        (result) => {
          console.log('searchresults :>>', result)
          result.data.map((item) => {
            temp_arr.push(item)
            return null
          })
          console.log(temp_arr)
          setData(temp_arr)
        },
      )
    } else {
      const val = document.getElementById('auto_complete').value
      window.location.href = '/search_result?data=' + val
    }
  }
  const handleSearch = () => {
    const val = document.getElementById('auto_complete').value
    window.location.href = '/search_result?data=' + val
  }
  let suggest_count = 0,
    autocompletecount = 0
  const itemRender = (li, itemProps) => {
    if (itemProps['dataItem']['Category'] === 'Auto Complete API') {
      suggest_count = suggest_count + 1
      const url_search =
        '/search_result?data=' + itemProps['dataItem']['DisplayText']
      const itemChildren = (
        <a href={url_search} style={{ color: 'black', width: '100%' }}>
          <div style={{ fontSize: 16 }}>
            {suggest_count === 1 ? (
              <div>
                <b>Search suggestion</b>
              </div>
            ) : (
              <div></div>
            )}
            <div style={{ fontSize: 12 }}>
              {' '}
              {itemProps['dataItem']['DisplayText']}
            </div>
          </div>
        </a>
      )
      return React.cloneElement(li, li.props, itemChildren)
    } else {
      autocompletecount = autocompletecount + 1
      const url_search =
        '/search_result?data=' + itemProps['dataItem']['DisplayValue']
      const itemChildren = (
        <a href={url_search} style={{ color: 'black', width: '100%' }}>
          <div style={{ fontSize: 16 }}>
            {autocompletecount === 1 ? (
              <div>
                <div className="divider"></div>
                <div>
                  <b>Asset suggestion</b>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <div style={{ fontSize: 12 }}>
              <span>{itemProps['dataItem']['DisplayValue']}</span>
              <br />
            </div>
          </div>
        </a>
      )
      return React.cloneElement(li, li.props, itemChildren)
    }
  }
  const [recentActivities, setRecentActivities] = React.useState([])
  React.useEffect(() => {
    const req_value = {
      params: { AccountMail: AccountInfo['AccountMail'] },
    }
    httpget(getRecentActivities_url, req_value).then((result) => {
      setRecentActivities(result.data)
    })
    // eslint-disable-next-line
  }, [])
  const [recentViewed, setRecentViewed] = React.useState([])
  React.useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id },
    }
    console.log(fetch_RecentViewed_url)
    httpget(fetch_RecentViewed_url, req_value).then((result) => {
      console.log(result)
      setRecentViewed(result)
    })
  }, [])
  return (
    <React.Fragment>
      <div>
        <div className="smart-business-tablet" style={{ marginLeft: 0 }}>
          <div className="smart-background-img">
            <div className="top-right-header">
              <div className="user_info" onClick={onClick} ref={anchor}>
                <Tooltip
                  anchorElement="target"
                  parentTitle={true}
                  position="bottom"
                >
                  <div
                    style={{
                      textAlign: 'end',
                      marginRight: 30,
                      fontFamily: 'Century',
                      fontWeight: 'bold',
                    }}
                  >
                    <Label className="profile_name">
                      Hello,{' '}
                      <span title={AccountInfo['AccountName']}>
                        {AccountInfo['AccountName']}
                      </span>
                    </Label>
                    <br />
                    <Label
                      className="profile_name"
                      // style={{ fontStyle: "italic" }}
                    >
                      Persona: {AccountInfo['AccountRole']}
                    </Label>
                  </div>
                </Tooltip>
                <Avatar className="profile_image" type="text" size="large">
                  <span style={{ fontWeight: 'Bold', fontSize: 'x-large' }}>
                    {AccountInfo['Account_ShortName']}
                  </span>
                </Avatar>
              </div>
              <Popup
                anchor={anchor.current}
                show={show}
                style={{ marginTop: 0, marginLeft: 0 }}
                className="profilepopup"
              >
                <ProfileView />
              </Popup>
            </div>
            <div
              className="top-left-header logo_txt"
              style={{ fontFamily: 'Arial', fontWeight: 500, color: '#42168A' }}
            >
              <img
                src={Logo}
                alt="logo"
                style={{
                  width: 200,
                  height: 'auto',
                  marginLeft: -20,
                  marginRight: 5,
                  border: 2,
                  borderColor: 'blue',
                }}
              />
              {/* GRAVITON */}
            </div>
          </div>
          <div className="centered">
            <p className="welcome-to-cdp-collaboration-w">
              Welcome to DataScope
            </p>
            <p className="this-portal-allows-you-to-acce">
              Manage, govern, and visualize enterprise level data, provision
              resources and use best of breed tools to develop and deliver
              optimal data products
            </p>
          </div>
          <div className="wrap search_landing">
            <div className="search">
              <SplitButton text="All Assets" style={{ borderRadius: '100px' }}>
                <SplitButtonItem text="Models" />
                <SplitButtonItem text="Data" />
                <SplitButtonItem text="Pipeline" />
                <SplitButtonItem text="Dashboard" />
              </SplitButton>
              <AutoComplete
                id="auto_complete"
                style={{
                  padding: 4,
                  width: '450px',
                  height: '50px',
                  borderBlockColor: 'black',
                  borderRadius: '0px',
                }}
                data={data}
                value={value}
                itemRender={itemRender}
                onChange={onChangesearch}
                placeholder="What are you looking for?"
              />
              <button
                type="submit"
                className="searchButton"
                style={{
                  padding: 4,
                  width: '50px',
                  height: '50px',
                  borderEndEndRadius: 4,
                  borderStartEndRadius: 4,
                  borderColor: 'black',
                }}
                onClick={handleSearch}
              >
                <i className="fa fa-search" style={{ padding: 4 }}></i>
              </button>
            </div>
          </div>
          <div className="row menu_align_landing">
            <div className="col mx-1 col-half-offset reports_section">
              <div className="menu_icon_landing resports_perm">
                <img src={report_menu_img} alt="reports"></img>
                <div className="emptyspaceicon_landing"></div>
                {/* <p>Reports and Dashboards</p> */}
              </div>
              <a href="/reports">
                <div className="hover_div_landing reports_temp">
                  <img src={report_menu_hover_img} alt="reports"></img>
                  <div className="emptyspaceicon_landing"></div>
                  <p className="hover_menu_title">Reports and Dashboards</p>
                  <p className="hover_menu_content">
                    Explore and review Tableau and Power BI dashboards to
                    visualize data from multiple sources and derive actionable
                    insights.
                  </p>
                </div>
              </a>
            </div>
            {/* <div className="col mx-1 col-half-offset cost_usage_section"> 
              <div className="menu_icon_landing cost_usage_permanent">
                 <img src={cost_usage_img} alt="cost"></img>
                <div className="emptyspaceicon_landing"></div> 
                /* <p>Cost and Usage</p> 
              </div> 
               <a href="/costusage"> 
              <div className="hover_div_landing cost_usage_temp">
                <img src={cost_usage_hover_img} alt="cost"></img>
                <div className="emptyspaceicon_landing"></div>
                <p className="hover_menu_title">Cost and Usage</p>
                <p className="hover_menu_content">
                  List out cost details of available services being used, and
                  track their usage across the organization.
                </p>
              </div>
              </a> 
              </div>*/}
            <div className="col mx-1 col-half-offset self_service_section">
              <div className="menu_icon_landing self_service_permanent">
                <img src={resource_provisioning_img} alt="selfservice"></img>
                <div className="emptyspaceicon_landing"></div>
                {/* <p>Resource Provisioning</p> */}
              </div>
              <a href="/resourceprovisioning">
                <div className="hover_div_landing self_service_temp">
                  <img
                    src={resource_provisioning_hover_img}
                    alt="selservice"
                  ></img>
                  <div className="emptyspaceicon_landing"></div>
                  <p className="hover_menu_title">Resource Provisioning</p>
                  <p className="hover_menu_content">
                    Raise a ticket, check ticket status or request a software,
                    approve requests and check the status of your tickets.
                  </p>
                </div>
              </a>
            </div>
            <div className="col mx-1 col-half-offset data_science_section">
              <div className="menu_icon_landing data_science_perm">
                <img src={data_science_img} alt="datascience"></img>
                <div className="emptyspaceicon_landing"></div>
                {/* <p>Data Science</p> */}
              </div>
              <a href="/datascience">
                <div className="hover_div_landing data_science_temp">
                  <img src={data_science_hover_img} alt="datascience"></img>
                  <div className="emptyspaceicon_landing"></div>
                  <p className="hover_menu_title">Data Science</p>
                  <p className="hover_menu_content">
                    Run analytics for industry specific use-cases based on
                    requirements. Tools such as HCL's AION and other IP's are
                    available for integration.
                  </p>
                </div>
              </a>
            </div>
            <div className="col mx-1 col-half-offset data_service_section">
              <div className="menu_icon_landing data_service_perm">
                <img src={data_services_img} alt="dataservices"></img>
                <div className="emptyspaceicon_landing"></div>
                {/* <p>Data Services</p> */}
              </div>
              <a href="/dataservices">
                <div className="hover_div_landing data_service_temp">
                  <img src={data_services_hover_img} alt="dataservices"></img>
                  <div className="emptyspaceicon_landing"></div>
                  <p className="hover_menu_title">Data Services</p>
                  <p className="hover_menu_content">
                    Utilize various services such as Data Cataloging, Data
                    Quality Check, Synthetic Data Generation and more to solve
                    all your data needs.
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
        <SingleView />
        <div className="recent_view_items row" style={{ marginBottom: 50 }}>
          <div className="col-md-6">
            <div className="recent_view_item_sec">
              <h1 className="p-2">Recently Viewed Items</h1>
              <div className="card-component border" style={{ width: 'auto' }}>
                <Grid data={recentViewed}>
                  <GridColumn
                    field="assettype"
                    title="Name"
                    width="auto"
                    headerClassName="text-center"
                    cell={(props) => (
                      <td>
                        <div className="sr">
                          <a
                            style={{ fontSize: 14 }}
                            href={props.dataItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {props.dataItem.assettype}
                          </a>
                        </div>
                      </td>
                    )}
                  />
                  <GridColumn
                    field="created_on"
                    title="Date"
                    width="auto"
                    headerClassName="text-center"
                  />
                </Grid>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="recent_view_item_sec"
              style={{ marginLeft: 0, marginBottom: 100 }}
            >
              <h1 className="p-2">Recent Activity</h1>
              <div className="card-component border" style={{ width: 'auto' }}>
                <Grid data={recentActivities.slice(0, 5)}>
                  <GridColumn
                    field="alert_msg"
                    title="Activity"
                    width="auto"
                    headerClassName="text-center"
                  />
                  <GridColumn
                    field="created_on"
                    title="Date"
                    width="auto"
                    headerClassName="text-center"
                  />
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  )
}
export default Welcomepage
