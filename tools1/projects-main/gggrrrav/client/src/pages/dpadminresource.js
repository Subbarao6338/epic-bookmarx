import * as React from 'react'
import { Link } from 'react-router-dom'
import data from '../assets/self_service/Data.png'
import resource from '../assets/self_service/addresource.jpg'
import deleteresource from '../assets/self_service/deleteresource.jpg'
import software from '../assets/self_service/Software.png'
import request from '../assets/self_service/ServiceRequest.png'
const DpadminResource = () => {
  return (
    <div id="page">
      <div>
        <h3 align="left" id="heading">
          Resource Provisioning
        </h3>
        <p align="left">
          For all data, data software, data ticket status needs
        </p>
        <hr />
        <div align="center" className="float-container">
          <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={resource} id="icon" alt="data" />
              </div>
              <div>
                <b className="">Assign Resource</b>
              </div>
              <br/>
              <p id="info">
               Add resource for team lead
              </p>
              <span>
                <Link
                  to="/assignresource"
                  id="link"
                  style={{ padding: '2px 45px' }}
                >
                  Create Resource
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={deleteresource} id="icon" alt="software" />
              </div>
              <div>
                <b className="">Delete Resource</b>
              </div>
              <br/>
              <p id="info">
               Delete resource assigned for team lead
              </p>
              <span>
                <Link
                  to="/deleteresource"
                  id="link"
                  style={{ padding: '2px 45px' }}
                >
                  Delete Resource
                </Link>
              </span>
            </div>
          </div>
          {/* <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={request} id="icon" alt="servicerequest" />
              </div>
              <div>
                <b className="">Service Request</b>
              </div>
              <p style={{ paddingRight: 8, paddingLeft: 8 }}>
                Request services, submit a demand to a new services or request
                additional access or remove existing access.
              </p>{' '}
              <span>
                <Link to="/servicerequest" id="link">
                  Create Ticket
                </Link>
              </span>
            </div>
          </div> */}

           {/*#################################################################  */}
          <div className="float-child3">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={data} id="icon" alt="data" />
              </div>
              <div>
                <b className="">Kubernetes Cluster </b>
              </div>
              <p id="info">
             Deploy a Kubernetes cluster with the required number of pods on the infra of your choice.
              </p>
              <span>
                <Link
                  to="/kubernetes"
                  id="link"
                  style={{ padding: "2px 45px" }}
                >
                  Deploy Kubernetes Cluster
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child3">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={data} id="icon" alt="data" />
              </div>
              <div>
                <b className="">Airflow </b>
              </div>
              <p id="info">
         Deploy an Airflow instance in a Kubernetes cluster to benefit from increased stability and auto scaling options provided by Kubernetes.
              </p>
              <span>
                <Link
                  to="/airflow"
                  id="link"
                  style={{ padding: "2px 45px" }}
                >
                  Deploy Airflow
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default DpadminResource