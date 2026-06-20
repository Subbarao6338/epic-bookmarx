import * as React from 'react'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { process } from '@progress/kendo-data-query'
import { httpget } from '../commonUtility/common_http'
import {
  gettoken_url,
  listpipeline_url,
  gettoken_exturl,
  listpipeline_exturl,
  query_debugpipelines_url,
  query_debugpipelines_exturl,
  query_pipelines_url,
  query_pipelines_exturl,
  tenant_id,
} from '../commonUtility/api_urls'
import {
  Grant_Type,
  Client_ID,
  Secret_ID,
  Resource,
} from '../commonUtility/azure_api_config'
import { Breadcrumb } from '@progress/kendo-react-layout'
import { useHistory } from 'react-router-dom'
import { loadMessages } from '@progress/kendo-react-intl'
import { enMessages } from '../messages/en-US'
loadMessages(enMessages, 'en-US')

const navitems = [
  {
    id: 'home',
    route_url: '/services',
    text: 'Services',
    // iconClass: 'k-i-home',
  },
  {
    id: 'datapipelinesummary',
    route_url: '/datapipeline_summary',
    text: 'Data Pipeline Summary',
  },
]

const initialDataState = {
  sort: [{ field: 'code', dir: 'asc' }],
  take: 5,
  skip: 0,
}

const DataPipelineSummary = () => {
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
        gettoken_exturl: gettoken_exturl,
      },
    }

    httpget(gettoken_url, req_value).then((token_response) => {
      const token_value = token_response['token']
      const req_query_pipeline = {
        params: {
          tenant_id: tenant_id,
          query_pipelines_exturl: query_pipelines_exturl,
          token: token_value,
        },
      }
      httpget(query_pipelines_url, req_query_pipeline).then(
        (query_pipelines_result) => {
          const req_query_debugpipeline = {
            params: {
              tenant_id: tenant_id,
              query_debugpipelines_exturl: query_debugpipelines_exturl,
              token: token_value,
            },
          }
          httpget(query_debugpipelines_url, req_query_debugpipeline).then(
            (query_debugpipelines_result) => {
              const req_value_listpipeline = {
                params: {
                  tenant_id: tenant_id,
                  listpipeline_exturl: listpipeline_exturl,
                  token: token_value,
                },
              }
              httpget(listpipeline_url, req_value_listpipeline).then(
                (listpipeline_result) => {
                  console.log('query_pipelines_result')
                  console.log(query_pipelines_result['value'])
                  console.log('query_debugpipelines_result')
                  console.log(query_debugpipelines_result['value'])
                  let listquery_debug_pipelines = query_pipelines_result[
                    'value'
                  ].concat(query_debugpipelines_result['value'])
                  let groupquery_debug_pipelines = listquery_debug_pipelines.reduce(
                    function (result, current) {
                      result[current.pipelineName] =
                        result[current.pipelineName] || []
                      result[current.pipelineName].push(current.status)
                      return result
                    },
                    {},
                  )
                  var pipeline_details = {}
                  var arr_pipeline = []
                  //console.log(listpipeline_result["value"].length)
                  for (
                    let i = 0;
                    i < listpipeline_result['value'].length;
                    i++
                  ) {
                    pipeline_details.slno = i + 1
                    pipeline_details.name =
                      listpipeline_result['value'][i]['name']

                    pipeline_details.totalcount =
                      typeof groupquery_debug_pipelines[
                        listpipeline_result['value'][i]['name']
                      ] === 'undefined'
                        ? 0
                        : groupquery_debug_pipelines[
                            listpipeline_result['value'][i]['name']
                          ].length
                    pipeline_details.successcount =
                      typeof groupquery_debug_pipelines[
                        listpipeline_result['value'][i]['name']
                      ] === 'undefined'
                        ? 0
                        : groupquery_debug_pipelines[
                            listpipeline_result['value'][i]['name']
                          ].filter((v) => v === 'Succeeded').length
                    pipeline_details.failurecount =
                      typeof groupquery_debug_pipelines[
                        listpipeline_result['value'][i]['name']
                      ] === 'undefined'
                        ? 0
                        : groupquery_debug_pipelines[
                            listpipeline_result['value'][i]['name']
                          ].filter((v) => v === 'Failed').length
                    //pipeline_details.totalcount = groupquery_debug_pipelines[listpipeline_result["value"][i]["name"]].length;
                    //pipeline_details.successcount = groupquery_debug_pipelines[listpipeline_result["value"][i]["name"]].filter((v) => (v === "Succeeded")).length;
                    //pipeline_details.failurecount = groupquery_debug_pipelines[listpipeline_result["value"][i]["name"]].filter((v) => (v === "Failed")).length;
                    arr_pipeline.push({ ...pipeline_details })
                  }
                  console.log(arr_pipeline)
                  setData(arr_pipeline)
                },
              )
            },
          )
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
              {enMessages.cdp_menus.datapipelinesummary}
            </h3>
          </div>
          <hr />

          {/* <div className="header-left"> <Link to="/datasource_create" className="k-button k-primary"><VscAdd />{enMessages.cdp_menus.datasourcecreate}</Link></div>
    <br></br><br></br> */}
          {/* <div className="card-component tableborder"> */}
          <div>
            <Grid
              //className="tableborder"
              pageable={true}
              sortable={true}
              filterable={true}
              data={process(data, dataState)}
              {...dataState}
              onDataStateChange={(e) => {
                setDataState(e.dataState)
              }}
              style={{ maxWidth: 1060 }}
            >
              <Column
                //className="tableborder"
                field="slno"
                title="S.No"
                width="60px"
                filterable={false}
              />
              <Column
                //className="tableborder"
                field="data pipeline_name"
                title="Data Pipeline Name"
                width="175px"
              />
              <Column
                // className="tableborder"
                field="totalcount"
                title="Total Count"
              />
              <Column
                //className="tableborder"
                field="successcount"
                title="Success Count"
              />
              <Column
                //className="tableborder"
                field="failurecount"
                title="Failure Count"
              />
              {/* filter="date" format="{0:d}" */}
            </Grid>
          </div>
        </div>
      </div>
      <style>
        {`.k-animation-container {
              z-index: 10003;
          }`}
      </style>
    </React.Fragment>
  )
}

export default DataPipelineSummary
