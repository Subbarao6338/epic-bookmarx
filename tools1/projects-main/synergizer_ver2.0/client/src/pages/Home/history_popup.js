import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

function ViewStateHistory({ openViewStateHistory, setOpenViewStateHistory }) {
  const [history, setHistory] = useState([
    {
      state: "loading..",
    },
  ]);

  const styles = {
    pending: "yellow",
    normal: "green",
    alerting: "pink",
  };

  const loadHistory = () => {
    // console.log(openViewStateHistory);
    setHistory(openViewStateHistory.state_history);
  };

  const handleCloseModal = () => {
    setOpenViewStateHistory({ show: false });
  };

  useEffect(() => {
    openViewStateHistory.state_history && loadHistory();
  }, [openViewStateHistory.state_history]);

  return (
    <Modal show={openViewStateHistory.show} size="xl" onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>State History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="other_details">
          <label className="form-label">Alert Rule Name : &nbsp;</label>
          <lable>{openViewStateHistory.rule_name}</lable>
          <br />
        </div>
        <div
          className=" table-responsive border"
          style={{
            overflow: "auto",
            height: history.length > 0 ? 400 : "auto",
          }}
        >
          <table className="table table-hover table-striped position-relative">
            <thead
              className="border border-white position-sticky top-0"
              style={{ backgroundColor: "#3498DB" }}
            >
              <tr style={{ color: "white" }}>
                <th>State</th>
                <th />
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((value) => (
                  <tr>
                    <td>
                      <div
                        style={{
                          background:
                            value.newState === "Pending"
                              ? "#F4D03F"
                              : value.newState === "Normal"
                              ? "green"
                              : "#F9027D",
                          color:
                            value.newState === "Pending" ? "black" : "white",
                          height: 22,
                          width: 65,
                          textAlign: "center",
                          borderRadius: 8,
                          fontSize: 13,
                        }}
                      >
                        {value.newState}
                      </div>
                    </td>
                    <td>{value.text}</td>
                    <td>{new Date(value.time).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <div>&nbsp;No Data Available</div>
              )}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCloseModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewStateHistory;
