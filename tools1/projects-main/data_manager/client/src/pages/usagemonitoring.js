import * as React from 'react'
import { Breadcrumb } from '@progress/kendo-react-layout'
import { useHistory } from 'react-router-dom'
import { loadMessages } from '@progress/kendo-react-intl'
import { enMessages } from '../messages/en-US'
import { httpget } from '../commonUtility/common_http'
import { Link } from 'react-router-dom'
import { Button } from '@progress/kendo-react-buttons'
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
import { DateRangePicker } from '@progress/kendo-react-dateinputs'
loadMessages(enMessages, 'en-US')

const navitems = [
  {
    id: 'home',
    route_url: '/costusage',
    text: 'Cost and Usage Management',
  },
  {
    id: 'usage summary',
    route_url: '/usagemonitoring',
    text: 'Data usage Summary',
  },
]

// const list_status = ['Active', 'Idle']
const initialDataState = {
  sort: [{ field: 'code', dir: 'asc' }],
  take: 10,
  skip: 0,
}

const DataUsageSummary = () => {
  // alert(enMessages.cdp_menus.dataorchestrator)
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

    console.log(req_value)
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
          var usagemonitoring_details = {}
          var arr_usagemonitoring = []
          // console.log(listusagemonitoring_result["value"].length);
          for (let i = 0; i < listusagemonitoring_result['value'].length; i++) {
            var prop_value =
              listusagemonitoring_result['value'][i]['properties']
            var date_val = new Date(prop_value['date'])
            usagemonitoring_details.quantity = prop_value['quantity']
            usagemonitoring_details.consumedService =
              prop_value['consumedService']
            usagemonitoring_details.resourceLocation =
              prop_value['resourceLocation']
            usagemonitoring_details.resourceGroup = prop_value['resourceGroup']
            usagemonitoring_details.date =
              date_val.getFullYear() + '-' + date_val.getMonth()
            arr_usagemonitoring.push({ ...usagemonitoring_details })
          }

          setData(arr_usagemonitoring)
          console.log(arr_usagemonitoring)
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
              {enMessages.cdp_menus.DataUsageSummary}
            </h3>
          </div>
          <hr />
          <div className="text-start">
            <Link to="usage_charts">
              <Button id="btn">Charts</Button>
            </Link>
            <br />
            <br />
            <label>
              <b>Service Level Usage Metrics Details</b>
            </label>
            <br />
            <br />
            <DateRangePicker />
          </div>
          <br />
          {/*  <div id="loader"> */}
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
                    <a href="/usage_create">{props.dataItem.date}</a>
                  </td>
                )}
              />

              <Column
                field="consumedService"
                title="ConsumedService"
                width="300px"
              />

              <Column
                field="resourceLocation"
                title="Location"
                width="180px"
                filterable={true}
              />

              <Column
                field="resourceGroup"
                title="Resource Group"
                width="180px"
                filterable={true}
              />

              <Column field="quantity" title="Quantity" width="200px" />
            </Grid>
          </div>
        </div>
      </div>

      {/* </div> */}
    </React.Fragment>
  )
}

export default DataUsageSummary
