import * as React from 'react'
import { Link } from 'react-router-dom'
import data from '../assets/self_service/Data.png'
// import software from '../assets/self_service/Software.png'
// import request from '../assets/self_service/ServiceRequest.png'
import { AccountInfoDetails } from "../authUtility/AccountInfo";
import DpadminResource from "./dpadminresource";
// import Dynamictile from './Dynamic'

const SelfService = () => {
  const AccountInfo = AccountInfoDetails();

  const AccountRole = AccountInfo["AccountRole"];
  if (AccountRole === "DP Admin") {
    return <DpadminResource/>;
  }
  // else if (AccountRole === "Data Engineer - Team Lead") {
  //   return <Dynamictile/>;
  // }
  else{
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
        {/* <div align="center" className="float-container">
          <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={data} id="icon" alt="data" />
              </div>
              <div>
                <b className="">Data</b>
              </div>
              <p id="info">
                Request for access to data from different databases deployed
                using Azure Kubernetes cluster.
              </p>
              <span>
                <Link
                  to="/deploy_data"
                  id="link"
                  style={{ padding: '2px 45px' }}
                >
                  Create Database
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={software} id="icon" alt="software" />
              </div>
              <div>
                <b className="">Software</b>
              </div>
              <p id="info">
                Request access to different application such as Tableau, Power
                BI, AION etc. deployed in a Kubernetes cluster
              </p>
              <span>
                <Link
                  to="/deploy_software"
                  id="link"
                  style={{ padding: '2px 45px' }}
                >
                  Deploy Software
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child3">
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
   
  )
}
}
export default SelfService