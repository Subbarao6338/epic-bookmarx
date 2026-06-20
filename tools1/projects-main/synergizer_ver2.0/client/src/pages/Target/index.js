import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Target() {
  const [sourceList, setSourceList] = React.useState([])
  React.useEffect(() => {
    axios.get('http://localhost:8000/api/config/metric_source/').then((res) => {
      console.log(res.data)
      setSourceList(res.data.value_list)
    })
  }, [])

  return (
    <div id="page">
      <div>
        <h3 id="heading" align="left">
          Metric Source
        </h3>
        <hr />
        <div>
          <div align="center" className="float-container">
            {sourceList.map((value) => {
              return (
                <div className="float-child2" style={{ marginBottom: 30 }}>
                  <div id="card">
                    <div style={{ padding: 15 }}></div>
                    <div>
                      <center>
                        <img src={value.image} alt="icon" id="icon"></img>
                      </center>
                      <b className="">{value.source_name}</b>
                      <br />
                      <p className="" id="info">
                        {value.description}
                      </p>
                    </div>

                    <span>
                      <Link
                        to={'/target/' + value.id}
                        id="link"
                        style={{ padding: '2px 45px' }}
                      >
                        Configure
                      </Link>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <br />
          <br />
        </div>
      </div>
    </div>
  )
}
export default Target
