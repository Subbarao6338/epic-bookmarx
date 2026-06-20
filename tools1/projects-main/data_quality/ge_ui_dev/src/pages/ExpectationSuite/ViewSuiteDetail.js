import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ge_api_url } from "../../config/api";

function ViewSuiteDetail({ openViewDetail, setOpenViewDetail }) {
  const [appliedRuleDetails, setAppliedRuleDetails] = useState([
    {
      expectation_type: "Loading...",
      kwargs: {
        mostly: 0,
        column: "Loading...",
        cost: 0,
      },
    },
  ]);
  const loadSuiteDetail = () => {
    console.log(openViewDetail);
    setAppliedRuleDetails(openViewDetail.suite_detail.expectations);
  };

  const handleCloseModal = () => {
    setOpenViewDetail({ show: false });
  };

  useEffect(() => {
    openViewDetail.suite_detail && loadSuiteDetail();
  }, [openViewDetail.suite_detail]);

  return (
    <Modal show={openViewDetail.show} size="lg" onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Expectation Suite Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <pre>{suiteDetail}</pre> */}
        <div id="other_details">
          <label className="form-label">Expectation Suite Name : &nbsp;</label>
          <lable>{openViewDetail.suite_name}</lable>
          <br />
        </div>
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Expectation Rule</th>
              <th>CDE</th>
              <th>Threshold (%)</th>
              <th>COQ ($)</th>
            </tr>
          </thead>
          <tbody>
            {appliedRuleDetails.map((value, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{value.expectation_type}</td>
                <td>{value.kwargs.column}</td>
                <td>{value.kwargs.mostly * 100}</td>
                <td>{value.kwargs.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCloseModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewSuiteDetail;
