import * as React from 'react'
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
import { VscAdd } from 'react-icons/vsc'

loadMessages(enMessages, 'en-US')
const navitems = [
  {
    id: 'home',
    route_url: '/costusage',
    text: 'Cost and Usage Management',
  },
  {
    id: 'usage summary',
    route_url: '/usage_charts',
    text: 'usage summary',
  },
  {
    id: 'createusage',
    route_url: '/usage_create',
    text: 'Date Wise Cost',
  },
]

const initialDataState = {
  sort: [{ field: 'code', dir: 'asc' }],
  take: 10,
  skip: 0,
}

const Usagecreate = () => {
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
          var usagemonitoring_details = {}
          var arr_usagemonitoring = []
          console.log(listusagemonitoring_result['value'].length)
          for (let i = 0; i < listusagemonitoring_result['value'].length; i++) {
            var prop_value =
              listusagemonitoring_result['value'][i]['properties']
            var date_val = new Date(prop_value['date'])
            usagemonitoring_details.date = date_val.toLocaleDateString()
            usagemonitoring_details.product = prop_value['product']
            usagemonitoring_details.resourceGroup = prop_value['resourceGroup']
            usagemonitoring_details.consumedService =
              prop_value['consumedService']
            usagemonitoring_details.resourceLocation =
              prop_value['resourceLocation']
            usagemonitoring_details.quantity = prop_value['quantity']
            usagemonitoring_details.consumedService =
              prop_value['consumedService']
            arr_usagemonitoring.push({ ...usagemonitoring_details })
          }
          console.log(arr_usagemonitoring)
          setData(arr_usagemonitoring)
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
      <div id="page" className="main-content">
        <div>
          <h3 align="left" id="heading">
            {enMessages.cdp_menus.Usagecreate}
          </h3>
        </div>
        <hr />
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
          >
            <Column field="date" title="DATE" width="160px" />
            <Column field="product" title="PRODUCT" width="400px" />
            <Column
              field="consumedService"
              title="CONSUMED SERVICE"
              width="250px"
            />
            <Column
              field="resourceLocation"
              title="RESOURCE LOCATION"
              width="150px"
            />
            <Column
              field="resourceGroup"
              title="RESOURCE GROUP"
              width="150px"
            />
            <Column field="quantity" title="QUANTITY" width="150px" />
          </Grid>
          <div className="buttoncontainer">&nbsp;</div>
          <VscAdd />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Usagecreate
