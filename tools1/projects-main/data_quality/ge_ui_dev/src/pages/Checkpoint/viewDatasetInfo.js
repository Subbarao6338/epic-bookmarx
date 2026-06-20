import React, { Fragment, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { ge_api_url } from "../../config/api";

function ViewModal({ show, onHide, datasetInfo }) {
  const handleClose = onHide;
  return (
    <Modal show={show} size="m" onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Dataset Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row mb-3">
          <div className="col-4 text-start">Datasource Name</div>
          <div className="col-8">: {datasetInfo.datasource_name}</div>
        </div>
        <div className="row mb-3">
          <div className="col-4 text-start">Dataset Name</div>
          <div className="col-8">: {datasetInfo.data_asset_name}</div>
        </div>
        <div className="text-end">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
export default ViewModal;
