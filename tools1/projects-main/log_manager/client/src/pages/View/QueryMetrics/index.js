import React, { useState } from 'react'

import { Button } from '@progress/kendo-react-buttons'
import { DropDownList } from '@progress/kendo-react-dropdowns'
import QueryBuilder from './QueryBuilder'
import QueryEditor from './QueryEditor'
import QueryResult from './QueryResult'
import axios from 'axios'

function QueryMetrics() {
  const [queryMethodState, setQueryMethodState] = useState(true)
  const [query, setQuery] = useState('')
  const [queryResult, setQueryResult] = useState(null)
  const [timeframe, setTimeframe] = useState(timeframeOptions)

  const [queries, setQueries] = useState([1])
  const [selectedQuery, setSelectedQuery] = useState(1)

  const selectedTimeRange = timeframe.find(({ selected }) => selected)

  const handleTimeframeChange = (e) => {
    timeframe.find(({ selected }) => selected).selected = false
    timeframe.find((value) => value === e.target.value).selected = true
    setTimeframe([...timeframe])
  }

  const toggleQueryMethod = () => {
    setQueryMethodState(!queryMethodState)
    setQuery('')
  }

  const handleQueryExecute = () => {
    console.log(query)
    setQueryResult(null)
    axios
      .post('http://localhost:8000/api/influxdb/query/', { query })
      .then((res) => {
        console.log(res.data)
        setQueryResult(res.data)
      })
  }

  const handleQueryResultDownload = () => {
    let csvContent = 'data:text/csv;charset=utf-8,' + queryResult
    var encodedUri = encodeURI(csvContent)
    var link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'data.csv')
    document.body.appendChild(link)
    link.click()
  }

  const handleQuerynum = () => {
    // setCounter(counter + 1);

    setQueries([...queries, queries.slice(-1)[0] + 1])
    setSelectedQuery(queries.slice(-1)[0] + 1)
  }

  const delControls = (index) => {
    queries.splice(index, 1)
    setQueries([...queries])
    setSelectedQuery(queries.slice(-1)[0])
    console.log(queries, queries.slice(-1)[0])
  }

  return (
    <div>
      <h4>Data Explorer</h4>
      <br />
      <div className="d-flex">
        {queries.map((value, index) => (
          <span className="me-2">
            <Button
              themeColor="primary"
              className=" pe-4"
              onClick={() => setSelectedQuery(value)}
            >
              Query {value}
            </Button>

            <span
              className="border-dark position-absolute"
              onClick={() => delControls(index)}
              style={{
                borderRadius: '12px',
                marginLeft: '-12px',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              x
            </span>
          </span>
        ))}

        <Button
          icon="plus"
          themeColor="primary"
          className="me-2"
          onClick={handleQuerynum}
        ></Button>

        <Button className="ms-auto me-2" onClick={toggleQueryMethod}>
          {queryMethodState ? 'Script Editor' : 'Query Builder'}
        </Button>
        <DropDownList
          className="me-2"
          style={{ width: '120px', borderColor: 'lightgrey' }}
          onChange={handleTimeframeChange}
          data={timeframe}
          defaultValue={selectedTimeRange}
          textField="text"
        />
        <Button
          className="me-2"
          themeColor="primary"
          onClick={handleQueryExecute}
        >
          Execute Query
        </Button>
        <Button
          className="me-2"
          icon="download"
          themeColor="primary"
          disabled={!queryResult}
          onClick={handleQueryResultDownload}
        ></Button>
      </div>
      <br />
      {console.log(queries, selectedQuery)}
      {queries.map((value) => (
        <div
          className={`me-2 d-${value === selectedQuery ? 'block' : 'none'}`}
          key={value}
        >
          {queryMethodState ? (
            <QueryBuilder
              timeRange={selectedTimeRange.value}
              query={query}
              setQuery={setQuery}
            />
          ) : (
            <QueryEditor query={query} setQuery={setQuery} />
          )}
        </div>
      ))}

      <div className="mt-2">
        <QueryResult queryResult={queryResult} />
      </div>
    </div>
  )
}

export default QueryMetrics

const timeframeOptions = [
  {
    text: 'Past 5m',
    value: '-5m',
  },
  {
    text: 'Past 15m',
    value: '-15m',
  },
  {
    text: 'Past 1h',
    value: '-1h',
    selected: true,
  },
  {
    text: 'Past 6h',
    value: '-6h',
  },
  {
    text: 'Past 12h',
    value: '-12h',
  },
  {
    text: 'Past 24h',
    value: '-24h',
  },
  {
    text: 'Past 2d',
    value: '-2d',
  },
]
