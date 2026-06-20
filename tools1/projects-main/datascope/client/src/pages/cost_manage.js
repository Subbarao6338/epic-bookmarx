import React from 'react'
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
import {
  Client_ID,
  Secret_ID,
  Grant_Type,
  Resource,
} from '../commonUtility/azure_api_config'
import { process } from '@progress/kendo-data-query'

import 'react-datepicker/dist/react-datepicker.css'

loadMessages(enMessages, 'en-US')

const navitems = [
  {
    id: 'home',
    route_url: '/costusage',
    text: 'Cost and Usage Management',
  },
  {
    id: 'costUsage',
    route_url: '/costCharts',
    text: 'Cost Charts',
  },
  {
    id: 'costManage',
    route_url: '/cost_manage',
    text: 'Cost Management',
  },
]

const initialDataState = {
  sort: [{ field: 'code', dir: 'asc' }],
  take: 10,
  skip: 0,
}

const CostUsage = () => {
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
          console.log(listusagemonitoring_result['value'].length)
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
            costmonitoring_details.date =
              date_val.getFullYear() +
              '-' +
              (date_val.getMonth() + 1) +
              '-' +
              date_val.getDate()

            arr_costmonitoring.push({ ...costmonitoring_details })
          }
          console.log(arr_costmonitoring)
          setData(arr_costmonitoring)
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
      />{' '}
      <br />
      <div id="page" className="main-content">
        <div>
          <div>
            <h3 align="left" id="heading">
              {' '}
              {enMessages.cdp_menus.costUsage}{' '}
            </h3>{' '}
          </div>{' '}
          <hr />
          <div align="left">
            <p>
              <b>AccountID:</b> 86330517
            </p>
            <p>
              <b>ProfileName:</b> HCL Technologies Ltd.
            </p>
          </div>
          <br />
          <div style={{ maxWidth: 1060 }}>
            <Grid
              pageable={true}
              sortable={true}
              filterable={true}
              data={process(data, dataState)}
              {...dataState}
              onDataStateChange={(e) => {
                setDataState(e.dataState)
              }}
              width="auto"
            >
              <Column field="date" title="Date" width="150px" />

              <Column
                field="consumedService"
                title="ConsumedService"
                width="270px"
              />
              <Column
                field="effectivePrice"
                title="Effective Price (INR)"
                width="230px"
              />
              <Column field="cost" title="Cost (INR)" width="200px" />
              <Column
                field="unitPrice"
                title="Unit Price (INR)"
                width="200px"
              />
            </Grid>
            <div className="buttoncontainer"> </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
export default CostUsage
