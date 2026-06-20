import React, { useState } from 'react'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { process } from '@progress/kendo-data-query'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from '@progress/kendo-react-buttons'
import { view_metadata_file_url } from '../commonUtility/api_urls'
import { httpget } from '../commonUtility/common_http'
import { Breadcrumb } from '@progress/kendo-react-layout'
import { loadMessages } from '@progress/kendo-react-intl'
import { enMessages } from './../messages/en-US'
loadMessages(enMessages, 'en-US')

const navitems = [
  {
    id: 'home',
    route_url: '/services',
    text: 'Services',
  },
  {
    id: 'metadatasummary',
    route_url: '/metadata_summary',
    text: 'Metadata Summary',
  },
  {
    id: 'metadatafileview',
    route_url: '/metadata_fileview',
    text: 'Metadata File View',
  },
]

const initialDataState = {
  sort: [{ field: 'code', dir: 'asc' }],
  take: 10,
  skip: 0,
}
const MetadataFileView = () => {
  const history = useHistory()
  const [navdata] = React.useState(navitems)
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id)
    console.log(navdata[itemIndex]['route_url'])
    history.push(navdata[itemIndex]['route_url'])
  }

  const handlecancel = () => {
    history.push('/metadata_summary')
  }

  const filename =
    new URLSearchParams(window.location.search).get('filename') || 'result.csv'
  const id = new URLSearchParams(window.location.search).get('id')
  console.log(filename)
  const [data, setData] = useState([])
  const [data_keys, setData_keys] = useState([])

  useEffect(() => {
    const req_value = {
      params: { filename: filename, id: id },
    }
    httpget(view_metadata_file_url, req_value).then((response) => {
      const data = response[0]
      const filedata = data
      console.log(filedata)
      setData_keys(Object.keys(filedata.data_schema))
      setData(filedata.data)
    })
  }, [filename, id])

  const [dataState, setDataState] = useState(initialDataState)

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
            <h3 id="heading" align="left">
              <b>{enMessages.cdp_menus.metadatafileview}</b>
            </h3>
          </div>
          <hr />
          <div style={{ maxWidth: 1050 }}>
            {data.length > 0 && data_keys.length > 0 && (
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
                {data_keys.map((key) => (
                  <Column key={key} field={key} title={key} width="200px" />
                ))}
              </Grid>
            )}
          </div>
          <br />
          <div>
            <Button
              id="btn"
              icon="close-outline"
              onClick={handlecancel}
            ></Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default MetadataFileView
