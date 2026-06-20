import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Backdrop, CircularProgress } from "@mui/material";

function ViewCollapse({ openViewCollapse, setOpenViewCollapse }) {
  console.log(openViewCollapse.data);
  const [allExpectationRules, setAllExpectationRules] = useState([
    {
      expectation_config: {
        expectation_type: "Loading...",
        kwargs: { column: "Loading..." },
      },
      success: "Loading...",
    },
  ]);
  const [otherStats, setOtherStats] = useState({
    total: 0,
    success: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => setOpenViewCollapse({ show: false });

  useEffect(() => {
    if (openViewCollapse.show) {
      setLoading(true);
      openViewCollapse.data.results.map((value, index) => {
        if (
          value.result.unexpected_percent === undefined &&
          value.success === true
        ) {
          value["failure_percent"] = 0;
        } else if (
          value.result.unexpected_percent === undefined &&
          value.success === false
        ) {
          value["failure_percent"] = 100;
        } else {
          let numb = value.result.unexpected_percent;
          value["failure_percent"] =
            Math.round((numb + Number.EPSILON) * 100) / 100;
        }
      });
      // openViewCollapse.data.results[0].result["unexpected_percent"] = 123;
      console.log(openViewCollapse.data.results);
      setAllExpectationRules(openViewCollapse.data.results);
      var temp = {
        total: openViewCollapse.data.statistics.evaluated_expectations,
        success: openViewCollapse.data.statistics.success_percent,
      };
      setOtherStats(temp);
      setLoading(false);
    }
  }, [openViewCollapse.show]);

  return (
    <Modal show={openViewCollapse.show} size="xl" onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Rule Based Result</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Backdrop open>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>
            <div id="other_details">
              <label className="form-label">Run Name : &nbsp;</label>
              <lable>{openViewCollapse.runName}</lable>
              <br />
              <label className="form-label">
                Expectation Suite Name : &nbsp;
              </label>
              <lable>{openViewCollapse.expectationSuiteName}</lable>
              <br />
              <label className="form-label">Total Expectations : &nbsp;</label>
              <label> {otherStats.total}</label>,&nbsp;&nbsp;
              <label className="form-label">
                Successful Expectations : &nbsp;
              </label>
              <label>
                {Math.round((otherStats.success * otherStats.total) / 100)}
              </label>
              ,&nbsp;&nbsp;
              <label className="form-label">Failed Expectations : &nbsp;</label>
              <label>
                {otherStats.total -
                  Math.round((otherStats.success * otherStats.total) / 100)}
              </label>
            </div>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Expectation Rule</th>
                  <th>CDEs</th>
                  <th>Threshold (%)</th>
                  <th>Failure (%)</th>
                  <th>COQ ($)</th>
                  <th>Total COQ ($)</th>
                  <th>Result</th>
                </tr>
              </thead>
              {allExpectationRules.length > 0 && (
                <tbody>
                  {allExpectationRules.map((value, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{value.expectation_config.expectation_type}</td>
                      <td>{value.expectation_config.kwargs.column}</td>
                      <td>{value.expectation_config.kwargs.mostly * 100}</td>
                      <td>{value.failure_percent}</td>
                      <td>{value.expectation_config.kwargs.cost || 0}</td>
                      {/* <td>
                  {value.success
                    ? value.result.unexpected_percent *
                        value.expectation_config.kwargs.cost || 0
                    : value.result.unexpected_percent *
                        value.expectation_config.kwargs.cost ||
                      100 * value.expectation_config.kwargs.cost}
                </td> */}
                      <td>
                        {value.failure_percent *
                          value.expectation_config.kwargs.cost || 0}
                      </td>

                      <td style={{ color: value.success ? "green" : "red" }}>
                        {value.success ? "Success" : "Failed"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCloseModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewCollapse;
