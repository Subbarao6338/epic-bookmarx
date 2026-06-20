import React, { useState } from 'react'
import {
  fetch_full_Search_result_url,
  save_recentviewed_url,
} from '../commonUtility/api_urls'
import { httpget, httppost } from '../commonUtility/common_http'
import { Splitter } from '@progress/kendo-react-layout'
import { Checkbox } from '@progress/kendo-react-inputs'

import { Input } from '@progress/kendo-react-inputs'
import DrawerRouterContainer from '../components/DrawerRouterContainer.jsx'
const filterObject = require('./object.json')

const SearchResult = () => {
  const scrollHandler = () => {}

  const [panes, setPanes] = React.useState([
    {
      size: '16%',
      min: '20px',
      collapsible: true,
    },
    {},
    {
      size: '85%',
      min: '20px',
      collapsible: true,
    },
  ])
  const [nestedPanes, setNestedPanes] = React.useState([
    {
      size: '40%',
    },
    {},
    {
      size: '30%',
      resizable: false,
    },
  ])

  const onChange = (event) => {
    setPanes(event.newState)
  }

  const onNestedChange = (event) => {
    setNestedPanes(event.newState)
  }
  //console.log(filterObject);

  ///------for filter results-----///

  const [search, setNewSearch] = useState('')
  const handleSearchChange = (e) => {
    setNewSearch(e.target.value)
  }

  ///--------End filter results-----///

  ///////////
  const [res, setRes] = React.useState([])
  ///////

  const [object_type_list, setobject_type_list] = React.useState([])

  const [checkedState, setCheckedState] = React.useState(
    new Array(filterObject.objects.length).fill(false),
  )
  const handelFilterChange = (position) => {
    //console.log(position);
    const updatedCheckedState = new Array(filterObject.objects.length).fill(
      false,
    )
    var checked_obj_arr = []
    checkedState.map((item, index) => {
      if (index === position) {
        updatedCheckedState[index] = !item
        if (!item === true) {
          var box_name = filterObject.objects[index].objectType
          checked_obj_arr.push(box_name)
        }
      } else {
        updatedCheckedState[index] = item
        if (item === true) {
          var box_name = filterObject.objects[index].objectType
          checked_obj_arr.push(box_name)
        }
      }
    })
    setCheckedState(updatedCheckedState)

    //console.log(checked_obj_arr);
    setobject_type_list(checked_obj_arr)
    handleQuery(checked_obj_arr)
  }

  //////
  const [collectionName, setCollectionName] = React.useState([])
  const handleQuery = (checked_obj_arr) => {
    // const formdata = new FormData()
    // formdata.append("keyword", "data");
    const current_url = new URL(window.location.href)
    const param_data = current_url.searchParams.get('data')
    const req_value = {
      params: { keyword: param_data, filter: { filter_data: checked_obj_arr } },
    }

    httpget(fetch_full_Search_result_url, req_value).then((result) => {
      //console.log(result);
      setCollectionName(result.collection)
      var temp_arr = new Array()
      result.data.map((item) => {
        var temp = {
          DisplayValue: item.DisplayValue,
          DisplayText: item.DisplayText,
          DisplayText1: item.DisplayText1,
          DisplayText2: item.DisplayText2,
          DisplayText3: item.DisplayText3,
          Display_icon: item.display_icon,
          data_url:
            'https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=' +
            item.id +
            '&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912',
          //data_url:"https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=f53da754-f088-4dab-a7f2-32e6d394ecf8&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912"
        }
        temp_arr.push(temp)
      })
      //console.log(temp_arr);
      setRes(temp_arr)
    })
  }

  function save_recent_viewed_item(item) {
    //console.log(item);
    const formData = new FormData()
    formData.append('asset_type', item.DisplayText)
    formData.append('url', item.data_url)
    httppost(save_recentviewed_url, formData).then((result) => {
      //console.log(result.data);
    })
  }
  React.useEffect(() => {
    handleQuery([])
  }, [])

  return (
    <DrawerRouterContainer>
      <div>
        <h3 align="left" id="heading">
          Browse Assets
        </h3>
      </div>
      <hr />

      <div className="text-start form-left" style={{ marginTop: '-10px' }}>
        <b>Filter Options</b>
        <li>
          <Input
            className="k-icon k-i-filter"
            type="text"
            placeholder="Filter by keyword"
            value={search}
            onChange={handleSearchChange}
            style={{
              width: 170,
              padding: 10,
              margin: '-1px',
              marginTop: '-80px',
              marginBottom: '-80px',
            }}
          />
        </li>
      </div>
      <div
        className="head"
        style={{
          margin: '-19px',
          marginLeft: '-580px',
          padding: 10,
          marginTop: '-33px',
          fontSize: '2',
        }}
      >
        <b>
          <p>Search Result</p>
        </b>
      </div>

      <Splitter
        panes={panes}
        onChange={onChange}
        onScroll={scrollHandler}
        fixedScroll={true}
        size="30%"
      >
        <div className="search" align="left">
          <b>Object Type</b>
          <div className="divider"></div>
          <div width="150" style={{ padding: 5 }}>
            <div>
              <br />
              {search == ''
                ? filterObject.objects.map((item, index) => (
                    <div>
                      <i
                        className={' ' + item.object_icon + ' ' + ' '}
                        aria-hidden="true"
                      ></i>
                      {' ' + ' '}
                      <Checkbox
                        label={' ' + item.objectType + ' '}
                        value={item.objectType + ' '}
                        onChange={() => handelFilterChange(index)}
                      ></Checkbox>{' '}
                      <br />
                    </div>
                  ))
                : filterObject.objects
                    .filter((x) =>
                      x.objectType.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((item, index) => (
                      <div>
                        <i
                          className={' ' + item.object_icon + ' ' + ' '}
                          aria-hidden="true"
                        ></i>
                        {' ' + ' '}
                        <Checkbox
                          label={' ' + item.objectType + ' '}
                          value={item.objectType + ' '}
                          onChange={() => handelFilterChange(index)}
                        ></Checkbox>{' '}
                        <br />
                      </div>
                    ))}
            </div>
            <br />
            <div align="left">
              <b>Collection ({collectionName.length} results found)</b>
              <div className="divider"></div>
              {search == ''
                ? collectionName.map((value) => (
                    <div>
                      <Checkbox label={value.name} />
                      <div
                        className="friendlyName"
                        style={{ marginLeft: '20px' }}
                      >
                        <label>{value.friendlyName}</label>
                      </div>
                    </div>
                  ))
                : collectionName
                    .filter((x) =>
                      x.friendlyName
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                    .map((value) => (
                      <div>
                        <Checkbox label={value.name} />
                        <div
                          className="friendlyName"
                          style={{ marginLeft: '20px' }}
                        >
                          <label>{value.friendlyName}</label>
                        </div>
                      </div>
                    ))}
            </div>
            <br />
          </div>
        </div>

        <div className="searchresultbox" align="left">
          <hr
            className="dotted"
            style={{ color: 'black', marginLeft: '-20px' }}
          ></hr>
          {res.length === 0 ? (
            <div>No Results Found.</div>
          ) : (
            res.map((item) => (
              <a
                href={item.data_url}
                target="_blank"
                onClick={() => save_recent_viewed_item(item)}
                style={{ color: '#1982cf', fontSize: '15px' }}
              >
                <img
                  src={require('../assets/searchresults_images/' +
                    item.Display_icon)}
                  style={{
                    width: 25,
                    height: 25,
                    marginLeft: -25,
                  }}
                />
                <b>
                  <span
                    className=""
                    style={{
                      marginTop: '-10px',
                      marginLeft: '10px',
                      fontSize: '17px',
                    }}
                  >
                    {item.DisplayText}
                  </span>
                </b>

                <li>
                  <span
                    className=""
                    style={{ color: 'black', marginLeft: '10px' }}
                  >
                    Type:{' ' + item.DisplayText3}
                  </span>
                  <span
                    className=""
                    style={{ color: 'black', marginLeft: '50px' }}
                  >
                    Asset Type:{' ' + item.DisplayText2}
                  </span>{' '}
                  <br />
                  <span
                    className="k-icon k-i-folder"
                    style={{ color: 'black', marginLeft: '10px' }}
                  ></span>{' '}
                  <span className="" style={{ color: 'black' }}>
                    {item.DisplayValue}
                  </span>
                  <br />
                  <span
                    className=""
                    style={{ color: 'black', marginLeft: '10px' }}
                  >
                    {item.DisplayText1}
                  </span>
                  {/* <span className="" style={{ color: "black",marginLeft:"10px" }}>{item.DisplayText2}</span> */}
                  <hr
                    className="dotted"
                    style={{ color: 'black', marginLeft: '-20px' }}
                  ></hr>
                </li>
              </a>
            ))
          )}

          <div></div>
        </div>
      </Splitter>
    </DrawerRouterContainer>
  )
}

export default SearchResult
