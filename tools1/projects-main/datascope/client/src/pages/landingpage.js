import React from 'react'
import { Link } from 'react-router-dom'

import dashboard from './../assets/menu_icons/Reports_Dashboards.png'
import datasource from './../assets/datasource.png'
import datapipeline from './../assets/datapipeline.png'
import datacatalog from './../assets/datacatalog.png'
import usage_monitoring from './../assets/menu_icons/Cost_Usage.png'
import cost from './../assets/cost.png'
import landing from './../assets/smart_business_tablet.png'

class Landing extends React.Component {
  render() {
    return (
      <div style={{ backgroundColor: 'white', padding: 1, minHeight: 470 }}>
        <div
          style={{
            backgroundImage: `url(${landing})`,
            height: 300,
          }}
        >
          <div>
            <div>
              {/* <h2
                align="left"
                style={{ marginTop: 0, padding: 5, color: '#452d8c' }}
              >
                G
              </h2> */}

              <div
                style={{
                  paddingTop: 230,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 'auto',
                  width: 'auto',
                }}
              >
                <div className="row">
                  <div className="column">
                    <Link to="/dashboard">
                      <div className="">
                        <img
                          src={dashboard}
                          alt="Dashboard"
                          className="menu_icon"
                        />
                        <div className="emptyspaceicon"></div>
                        <p className="fonts_icon">Dashboard</p>
                      </div>
                    </Link>
                  </div>

                  <div className="column">
                    <Link to="/datasource_summary">
                      <div className="">
                        <img
                          src={datasource}
                          alt="Data Source"
                          className="menu_icon"
                        />
                        <div className="emptyspaceicon"></div>
                        <p className="fonts_icon">Data Sources</p>
                      </div>
                    </Link>
                  </div>

                  <div className="column">
                    <Link to="/datapipeline_summary">
                      <div className="">
                        <img
                          src={datapipeline}
                          alt="Data Pipeline"
                          className="menu_icon"
                        />
                        <div className="emptyspaceicon"></div>
                        <p className="fonts_icon">Data Pipeline</p>
                      </div>
                    </Link>
                  </div>

                  <div className="column">
                    <Link to="/dashboard_check">
                      <div className="">
                        <img
                          src={datacatalog}
                          alt="Data Catalog & Governance"
                          className="menu_icon"
                        />
                        <div className="emptyspaceicon"></div>
                        <p className="fonts_icon">Data Catalog & Governance</p>
                      </div>
                    </Link>
                  </div>

                  <div className="column">
                    <Link
                      to="/"
                      className="disabled_link"
                      onClick={(event) => event.preventDefault()}
                    >
                      <div className="">
                        <img
                          src={usage_monitoring}
                          alt="Usage & Monitoring"
                          className="menu_icon"
                        />
                        <div className="emptyspaceicon"></div>
                        <p className="fonts_icon">Usage & Monitoring</p>
                      </div>
                    </Link>
                  </div>

                  <div className="column">
                    <Link
                      to="/"
                      className="disabled_link"
                      onClick={(event) => event.preventDefault()}
                    >
                      <div className="">
                        <img src={cost} alt="Cost" className="menu_icon" />
                        <div className="emptyspaceicon"></div>
                        <p className="fonts_icon">Cost</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Landing
