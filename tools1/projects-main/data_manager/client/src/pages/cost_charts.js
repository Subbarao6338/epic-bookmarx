import React from 'react'
import { useHistory } from 'react-router-dom'
import { loadMessages } from '@progress/kendo-react-intl'
import { enMessages } from '../messages/en-US'
import { Button } from '@progress/kendo-react-buttons'
import { httpget_notification } from '../commonUtility/common_http'
import DonutChart from '../components/DonutCharts'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import DatePicker, { setDefaultLocale } from 'react-datepicker'
import { useState } from 'react'
import 'ag-grid-community/dist/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css' // Optional theme CSS
import {
  AreaChart,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import {
  listDateWiseCostDetails,
  getAreaChartData,
  getDonutChart_Service,
  getDonutChart_Location,
  getDonutChart_ResourceGroup,
} from '../commonUtility/api_urls'
import { Area } from 'recharts'
import 'react-datepicker/dist/react-datepicker.css'
import { DropDownList } from '@progress/kendo-react-dropdowns'
import { Breadcrumb } from '@progress/kendo-react-layout'
import { Label } from '@progress/kendo-react-labels'
// import {
//   ListView,
//   ListViewHeader,
//   GridComponent,
//   ColumnsDirective,
//   ColumnDirective,
// } from '@progress/kendo-react-listview'
import { Loader } from '@progress/kendo-react-indicators'
import { orderBy } from '@progress/kendo-react-data-tools'

loadMessages(enMessages, 'en-US')
const navitems = [
  {
    id: 'home',
    route_url: '/costusage',
    text: 'Cost and Usage Management',
  },
  {
    id: 'costSummary',
    route_url: '/costCharts',
    text: 'Cost Summary',
  },
]
const CostCharts = (props) => {
  // function appendLeadingZeroes(n) {
  //   if (n <= 9) {
  //     return "0" + n;
  //   }
  //   return n;
  // }
  let history = useHistory()
  const [navdata] = React.useState(navitems)
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id)
    history.push(navdata[itemIndex]['route_url'])
  }
  const initialSort = [
    {
      field: 'date',
      dir: 'asc',
    },
  ]
  const columns = [
    {
      field: 'cost_date',
      headerName: 'Date',
      width: 130,
      sortable: 'true',
      align: 'right',
    },
    {
      resizable: true,
      field: 'daily_cost',
      headerName: 'Cost',
      width: 130,
      sortable: 'true',
    },
  ]
  // const [columnDefs, setColumnDefs] = useState([
  //   {field: 'cost_date', filter: true},
  //   {field: 'daily_cost',  filter: true},
  // ]
  // const [columnDefs] = useState([
  //   { field: 'make', sortable: 'true' },
  //   { field: 'price', sortable: 'true' },
  // ])
  var date = new Date()
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  var lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  )
  const [dailyCost, setDailyCost] = React.useState('')
  const [areaData, setAreaData] = React.useState('')
  const [donutService, setDonutService] = React.useState('')
  const [donutLocation, setDonutLocation] = React.useState('')
  const [donutResourceGroup, setDonutResourceGroup] = React.useState('')
  const [startDate, setStartDate] = useState(firstDay)
  const [endDate, setEndDate] = useState(lastDay)
  const get_filter_data_by_end_date = (sel_to_date) => {
    setEndDate(sel_to_date)
  }

  const get_filter_data_by_start_date = (sel_from_date) => {
    setStartDate(sel_from_date)
  }

  const ongoclick = () => {
    // alert();
    setAreaData('')
    setDonutService('')
    setDonutLocation('')
    setDonutResourceGroup('')
    setDailyCost('')
    get_chart_details(startDate, endDate)
  }

  React.useEffect(() => {
    get_chart_details()
    // Get Area Chart Data Details - [Accumulated Cost, Monthly Budget Cost, ForeCast Cost] - End
  }, [])

  const get_chart_details = () => {
    const req_value = {
      params: {
        FromDate: startDate,
        ToDate: endDate,
      },
    }
    //// Get Area Chart Data Details - [Accumulated Cost, Monthly Budget Cost, ForeCast Cost] - Start
    httpget_notification(getAreaChartData, req_value).then(
      (getAreaChartDataResult) => {
        setAreaData(getAreaChartDataResult['data'])
        console.log(getAreaChartDataResult)
        // Donut Chart - Service - Start
        httpget_notification(getDonutChart_Service, req_value).then(
          (getDonutChart_ServiceResult) => {
            setDonutService(getDonutChart_ServiceResult)
            // Donut Chart - Location - Start
            httpget_notification(getDonutChart_Location, req_value).then(
              (getDonutChart_LocationResult) => {
                console.log(getDonutChart_Location)
                setDonutLocation(getDonutChart_LocationResult)
                // Donut Chart - ResouceGroup - Start
                httpget_notification(
                  getDonutChart_ResourceGroup,
                  req_value,
                ).then((getDonutChart_ResourceGroupResult) => {
                  setDonutResourceGroup(getDonutChart_ResourceGroupResult)
                  // Daily Cost Details - For List View - Start
                  httpget_notification(listDateWiseCostDetails, req_value).then(
                    (listDateWiseCostDetailsResult) => {
                      if (listDateWiseCostDetailsResult['msg'] === 'Success') {
                        setDailyCost(listDateWiseCostDetailsResult['data'])
                        console.log(listDateWiseCostDetailsResult['data'])
                      } else {
                        setDailyCost(listDateWiseCostDetailsResult['msg'])
                      }
                    },
                  )
                  // Daily Cost Details - For List View - End
                })
                // Donut Chart - ResouceGroup - End
              },
            )
            // Donut Chart - Location - End
          },
        )
        // Donut Chart - Service - End
      },
    )
    // Get Area Chart Data Details - [Accumulated Cost, Monthly Budget Cost, ForeCast Cost] - End
  }

  // For Display X Axis Date like Apr 1 , Apr2
  const dateFormatter = (date) => {
    return new Date(date).toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric',
    })
  }
  // For Display Y Axis Date like 100K , 200K
  const amountFormatter = (amount) => {
    var formatted_amount =
      new Intl.NumberFormat('en-IN', {
        currency: 'INR',
      }).format(Math.sign(amount) * (Math.abs(amount) / 1000)) + 'K'
    return '₹' + formatted_amount
  }
  // Dropdown Change and Donut Filter code
  const [serviceDropValue, setServiceDropValue] = React.useState('All')
  const handleServiceChange = (event) => {
    setServiceDropValue(event.target.value)
  }
  const [locationDropValue, setLocationDropValue] = React.useState('All')
  const handleLocationChange = (event) => {
    setLocationDropValue(event.target.value)
  }
  const [resourceDropValue, setResourceDropValue] = React.useState('All')
  const handleResourceChange = (event) => {
    setResourceDropValue(event.target.value)
  }
  const [sort, setSort] = React.useState(initialSort)

  return (
    <React.Fragment>
      <Breadcrumb
        classdate="navigationbtn"
        data={navdata}
        onItemSelect={handleItemSelect}
      />
      <div>
        <div>
          <h3 align="left" id="heading">
            Cost Summary
          </h3>
        </div>
        <hr />
        <br />

        <div
          className="text-start form-left"
          style={{
            display: 'flex',
          }}
        >
          <div>
            <b>From</b>
          </div>
          <br></br>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <DatePicker
            selected={startDate}
            onChange={(sel_from_date) =>
              get_filter_data_by_start_date(sel_from_date)
            }
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
          />
          <div>
            <span
              class="k-icon k-i-calendar"
              style={{
                marginLeft: -878,
                marginTop: 3,
              }}
            ></span>
          </div>
          <div>
            <b
              style={{
                marginLeft: -837,
              }}
            >
              To
            </b>
          </div>
          <div>
            <div
              className="react_datepicker"
              style={{
                marginLeft: -809,
              }}
            >
              <DatePicker
                selected={endDate}
                onChange={(sel_to_date) =>
                  get_filter_data_by_end_date(sel_to_date)
                }
                minDate={startDate}
                maxDate={lastDay}
                dateFormat="dd/MM/yyyy"
              />
              <div>
                <span
                  class="k-icon k-i-calendar"
                  style={{
                    marginLeft: 170,
                    marginTop: -53,
                  }}
                ></span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="button-container"
          style={{
            marginTop: -54,
            marginLeft: -80,
          }}
        >
          <div>
            <Button onClick={ongoclick}>GO</Button>
          </div>
        </div>

        <br />
        {areaData === '' ? (
          <div
            style={{
              width: 1100,
              height: 250,
              border: '1px solid #ebebeb',
            }}
            className="center_loader"
          >
            Chart Loading
            <Loader size="large" themeColor="info" type="pulsing" />
          </div>
        ) : (
          <div>
            <AreaChart
              width={1100}
              height={250}
              data={areaData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAccCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#55D455" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#55D455" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="colorForCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#95F095" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#95F095" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="colorMonBud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF0000" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF0000" stopOpacity={1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tickFormatter={dateFormatter} />
              <YAxis tickFormatter={amountFormatter} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              {areaData[0]['Accumulated cost'] !== 'No Data' ? (
                <Area
                  type="area"
                  // dot={true}
                  dataKey="Accumulated cost"
                  stroke="#55D455"
                  fillOpacity={1}
                  fill="url(#colorAccCost)"
                />
              ) : (
                <div />
              )}
              {areaData[0]['Forecast cost'] !== 'No Data' ? (
                <Area
                  type="area"
                  dataKey="Forecast cost"
                  stroke="#95F095"
                  fillOpacity={0.9}
                  fill="url(#colorForCost)"
                />
              ) : (
                <div />
              )}
              {areaData[0]['Monthly budget'] !== 'No Data' ? (
                <Area
                  type="area"
                  dataKey="Monthly budget"
                  stroke="#FF0000"
                  fillOpacity={1}
                  fill="url(#colorPv)"
                />
              ) : (
                <div />
              )}
            </AreaChart>
            <br />
          </div>
        )}
        <div
          style={{
            display: 'flex',
            margin: 'auto',
            color: 'black',
            columnGap: '5px',
          }}
        >
          {/* Donut Chart - Service Based Start */}
          <div style={{ width: '33%' }}>
            {donutService === '' ? (
              <div
                style={{
                  height: '50vh',
                  width: '100%',
                  border: '1px solid #ebebeb',
                }}
                className="center_loader"
              >
                <Loader size="large" themeColor="info" type="pulsing" />
              </div>
            ) : donutService['msg'] === 'Failure' ? (
              <Label>API Failure</Label>
            ) : (
              <div
                className="k-card"
                style={{
                  height: '50vh',
                  width: '100%',
                }}
              >
                <div style={{ width: '60%', marginTop: 10 }}>
                  <DropDownList
                    style={{ width: '100%' }}
                    label="Service name"
                    fillMode={'flat'}
                    defaultItem="All"
                    data={donutService.servicename}
                    onChange={handleServiceChange}
                  />
                </div>
                <div
                  style={{
                    marginTop: '20px',
                  }}
                >
                  <DonutChart
                    labels={
                      serviceDropValue === 'All'
                        ? donutService['servicename']
                        : donutService['servicename']
                            .filter((val) => val === serviceDropValue)
                            .map((filteredval) => {
                              return filteredval
                            })
                    }
                    donutData={
                      serviceDropValue === 'All'
                        ? donutService['servicecost']
                        : donutService['servicecost']
                            .filter(
                              (val) =>
                                val ===
                                donutService['servicecost'][
                                  donutService['servicename'].indexOf(
                                    serviceDropValue,
                                  )
                                ],
                            )
                            .map((filteredval) => {
                              return filteredval
                            })
                    }
                    // labels={donutService["servicename"]}
                    // donutData={donutService["servicecost"}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Donut Chart - Service Based End */}
          {/* Donut Chart - Location Based Start */}
          <div style={{ width: '33%' }}>
            {donutLocation === '' ? (
              <div
                style={{
                  height: '50vh',
                  width: '100%',
                  border: '1px solid #ebebeb',
                }}
                className="center_loader"
              >
                <Loader size="large" themeColor="info" type="pulsing" />
              </div>
            ) : donutLocation['msg'] === 'Failure' ? (
              <Label>API Failure</Label>
            ) : (
              <div
                className="k-card"
                style={{
                  height: '50vh',
                  width: '100%',
                }}
              >
                <div style={{ width: '60%', marginTop: 10 }}>
                  <DropDownList
                    style={{ width: '100%' }}
                    label="Location"
                    fillMode={'flat'}
                    defaultItem="All"
                    data={donutLocation.location}
                    onChange={handleLocationChange}
                  />
                </div>
                <div
                  style={{
                    marginTop: '20px',
                  }}
                >
                  <DonutChart
                    labels={
                      locationDropValue === 'All'
                        ? donutLocation['location']
                        : donutLocation['location']
                            .filter((val) => val === locationDropValue)
                            .map((filteredval) => {
                              return filteredval
                            })
                    }
                    donutData={
                      locationDropValue === 'All'
                        ? donutLocation['locationcost']
                        : donutLocation['locationcost']
                            .filter(
                              (val) =>
                                val ===
                                donutLocation['locationcost'][
                                  donutLocation['location'].indexOf(
                                    locationDropValue,
                                  )
                                ],
                            )
                            .map((filteredval) => {
                              return filteredval
                            })
                    }
                    // labels={donutLocation["location"]}
                    // donutData={donutLocation["locationcost"]}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Donut Chart - Location Based End */}
          {/* Donut Chart - Resource Group Based Start */}
          <div style={{ width: '33%' }}>
            {donutResourceGroup === '' ? (
              <div
                style={{
                  height: '50vh',
                  width: '100%',
                  border: '1px solid #ebebeb',
                }}
                className="center_loader"
              >
                <Loader size="large" themeColor="info" type="pulsing" />
              </div>
            ) : donutResourceGroup['msg'] === 'Failure' ? (
              <Label>API Failure</Label>
            ) : (
              <div
                className="k-card"
                style={{
                  height: '50vh',
                  width: '100%',
                }}
              >
                <div style={{ width: '60%', marginTop: 10 }}>
                  <DropDownList
                    style={{ width: '100%' }}
                    label="Resource group name"
                    fillMode={'flat'}
                    data={donutResourceGroup.rsg}
                    defaultItem="All"
                    onChange={handleResourceChange}
                  />
                </div>
                <div
                  style={{
                    marginTop: '20px',
                  }}
                >
                  <DonutChart
                    labels={
                      resourceDropValue === 'All'
                        ? donutResourceGroup['rsg']
                        : donutResourceGroup['rsg']
                            .filter((val) => val === resourceDropValue)
                            .map((filteredval) => {
                              return filteredval
                            })
                    }
                    donutData={
                      resourceDropValue === 'All'
                        ? donutResourceGroup['rsgcost']
                        : donutResourceGroup['rsgcost']
                            .filter(
                              (val) =>
                                val ===
                                donutResourceGroup['rsgcost'][
                                  donutResourceGroup['rsg'].indexOf(
                                    resourceDropValue,
                                  )
                                ],
                            )
                            .map((filteredval) => {
                              return filteredval
                            })
                    }
                    // labels={donutResourceGroup["rsg"]}
                    // donutData={donutResourceGroup["rsgcost"]}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Donut Chart - Resource Group Based Start */}
        </div>
        <br />
        {dailyCost === '' ? (
          <div
            style={{
              width: 1100,
              height: 250,
              border: '1px solid #ebebeb',
            }}
            className="center_loader"
          >
            {' '}
            <Loader size="large" themeColor="info" type="pulsing" />
          </div>
        ) : dailyCost === 'Failure' ? (
          <div
            style={{
              width: 1100,
              height: 250,
              border: '1px solid #ebebeb',
            }}
            className="center_loader"
          >
            API Failure
          </div>
        ) : (
          <div>
            <div
              className="ag-theme-alpine"
              style={{ height: 400, width: 1100 }}
            >
              <Grid
                style={{
                  width: '96%',
                  height: '300px',
                  borderSpacing: '100px',
                }}
                data={orderBy(dailyCost, sort)}
                sortable={true}
                sort={sort}
                onSortChange={(e) => {
                  setSort(e.sort)
                }}
              >
                <Column field="cost_date" title="Date" id="col" />

                <Column
                  width="100"
                  field="daily_cost"
                  title="Cost"
                  className="costcolumnview"
                />
              </Grid>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
export default CostCharts
