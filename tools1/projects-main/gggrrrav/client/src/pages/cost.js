import React, { useState } from 'react'
import { Breadcrumb } from '@progress/kendo-react-layout'
import { useHistory } from 'react-router-dom'
import { loadMessages } from '@progress/kendo-react-intl'
import { enMessages } from '../messages/en-US'
import { httpget } from '../commonUtility/common_http'
import {
  gettokens_url,
  listusagemonitoring_url,
  gettokens_exturl,
  listusagemonitoring_exturl,
  tenant_id,
} from '../commonUtility/api_urls'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'

import { DateRangePicker } from '@progress/kendo-react-dateinputs'

import {
  Client_ID,
  Secret_ID,
  Grant_Type,
  Resource,
} from '../commonUtility/azure_api_config'
import { process } from '@progress/kendo-data-query'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Link } from 'react-router-dom'
import { Button } from '@progress/kendo-react-buttons'

loadMessages(enMessages, 'en-US')

const navitems = [
  {
    id: 'home',
    route_url: '/costusage',
    text: 'Cost and Usage Management',
    // iconClass: 'k-i-home',
  },
  {
    id: 'cost charts',
    route_url: '/cost_charts',
    text: 'Cost Charts',
  },
]

const initialDataState = {
  sort: [{ field: 'code', dir: 'asc' }],
  take: 10,
  skip: 0,
}

const CostSummary = () => {
  const [startDate, setStartDate] = useState(new Date())

  let history = useHistory()
  const [navdata] = React.useState(navitems)
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id)
    console.log(navdata[itemIndex]['route_url'])
    history.push(navdata[itemIndex]['route_url'])
  }
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    const req_value = {
      params: {
        tenant_id: tenant_id,
        grant_type: Grant_Type,
        client_id: Client_ID,
        client_secret: Secret_ID,
        resource: Resource,
        gettokens_exturl: gettokens_exturl,
      },
    }

    httpget(gettokens_url, req_value).then((token_response) => {
      const token_value = token_response['token']
      const req_listusagemonitoring = {
        params: {
          tenant_id: tenant_id,
          listusagemonitoring_exturl: listusagemonitoring_exturl,
          token: token_value,
        },
      }
      httpget(listusagemonitoring_url, req_listusagemonitoring).then(
        (listusagemonitoring_result) => {
          var costmonitoring_details = {}
          var arr_costmonitoring = []

          for (let i = 0; i < listusagemonitoring_result['value'].length; i++) {
            var prop_value =
              listusagemonitoring_result['value'][i]['properties']
            var date_val = new Date(prop_value['date'])
            costmonitoring_details.billingAccountId =
              prop_value['billingAccountId']
            costmonitoring_details.billingProfileName =
              prop_value['billingProfileName']
            costmonitoring_details.meterId = prop_value['meterId']
            costmonitoring_details.effectivePrice = prop_value['effectivePrice']
            costmonitoring_details.unitPrice = prop_value['unitPrice']
            costmonitoring_details.cost = prop_value['cost']
            costmonitoring_details.consumedService =
              prop_value['consumedService']
            costmonitoring_details.resourceLocation =
              prop_value['resourceLocation']
            costmonitoring_details.resourceGroup = prop_value['resourceGroup']
            // costmonitoring_details.date = date_val.toLocaleDateString();

            costmonitoring_details.date =
              date_val.getFullYear() + '-' + (date_val.getMonth() + 1)

            arr_costmonitoring.push({ ...costmonitoring_details })
          }

          setData(arr_costmonitoring)
          console.log(arr_costmonitoring)
        },
      )
    })
  }, [])

  const [dataState, setDataState] = React.useState(initialDataState)

  return (
    <React.Fragment>
      <Breadcrumb
        className="navigationbtn"
        data={navdata}
        onItemSelect={handleItemSelect}
      />
      <div>
        <div>
          <div>
            <h3 align="left" id="heading">
              {' '}
              {enMessages.cdp_menus.CostSummary}{' '}
            </h3>{' '}
          </div>{' '}
          <hr />
          <div className="text-start">
            {' '}
            {/* <Link to="/cost_charts">
                          <Button id="btn">Charts</Button>
                        </Link> */}{' '}
            <br />
            <br />
            <label>
              <b> Service Level Cost Details </b>{' '}
            </label>{' '}
            <br />
            <br />
            <DateRangePicker />
          </div>{' '}
          <br /> {/* 
                       <div id="loader"> */}{' '}
          <div>
            <Grid
              pageable={true}
              sortable={true}
              filterable={true}
              data={process(data, dataState)}
              {...dataState}
              onDataStateChange={(e) => {
                setDataState(e.dataState)
              }}
              align="center"
              style={{ width: 7000 }}
            >
              <Column
                field="date"
                title="Date"
                width="200px"
                id="col"
                cell={(props) => (
                  <td>
                    <a href="/cost_manage"> {props.dataItem.date} </a>{' '}
                  </td>
                )}
              />
              <Column
                field="consumedService"
                title="ConsumedService"
                width="300px"
              />
              <Column field="cost" title="Cost" width="200px" />
              <Column
                field="resourceLocation"
                title="Location"
                width="180px"
                filterable={true}
              />
              <Column
                field="resourceGroup"
                title="resourcegroup"
                width="180px"
                filterable={true}
              />{' '}
            </Grid>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
      {/* </div> */}{' '}
    </React.Fragment>
  )
}

export default CostSummary
