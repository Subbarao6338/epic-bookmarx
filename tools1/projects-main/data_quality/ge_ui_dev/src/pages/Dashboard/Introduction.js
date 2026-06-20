import axios from "axios";
import React, { useState, useEffect } from "react";
import Chart1 from "./Chart1";
import Chart2 from "./Chart2";
import { ge_api_url } from "../../config/api";
import { Button } from "react-bootstrap";
import dqc_image from "../../assets/icons/dqc_intro.jpg";
import dqc_back from "../../assets/icons/dqc_back.png";

const styles = {
  statisticCard: {
    width: "100%",
    height: "75px",
  },
  chart: {
    height: 200,
    width: 480,
  },
};

function Introduction() {
  const [validations, setValidations] = useState([]);
  const [statistic, setStatistic] = useState({
    validations_total: 0,
    validations_success: 0,
    validations_failed: 0,
    validations_success_percent: 0,
    validations_failed_percent: 0,
    rows_processed: 0,
    rows_failed: 0,
    rows_success: 0,
    rows_success_percent: 0,
    rows_failed_percent: 0,
  });

  const calculateStatistics = (validations = []) => {
    statistic.validations_total = validations.length;
    validations.forEach((validation) => {
      statistic.validations_success += validation.value.success;
      const results = validation.value.results;
      statistic.rows_processed +=
        results.find(({ success }) => success).result.element_count || 0;
      results.forEach((result) => {
        statistic.rows_failed += result.result.unexpected_count || 0;
      });
    });
    //
    statistic.validations_failed =
      statistic.validations_total - statistic.validations_success;
    statistic.validations_success_percent = Math.round(
      (statistic.validations_success / (statistic.validations_total || 1)) * 100
    );
    statistic.validations_failed_percent =
      100 - statistic.validations_success_percent;
    //
    statistic.rows_success = statistic.rows_processed - statistic.rows_failed;
    statistic.rows_failed_percent = Math.round(
      (statistic.rows_failed / (statistic.rows_processed || 1)) * 100
    );
    statistic.rows_success_percent = 100 - statistic.rows_failed_percent;
    // statistic
    setStatistic({ ...statistic });
  };

  const loadValidations = () => {
    axios
      .get(`${ge_api_url}/ge/validations/`)
      .then((res) => {
        console.log(res.data);
        setValidations(res.data.validations);
        calculateStatistics(res.data.validations);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    loadValidations();
  }, []);

  return (
    <div>
      <div className="border-bottom">
        <br />
        {/* <div className="border p-1">
          <h5 className="text-center">Dashboard</h5>
        </div> */}
        <div className="row m-2">
          <div className="col-3">
            <h5 className="text-center">Execution Count</h5>
            <button className="btn btn-primary" style={styles.statisticCard}>
              {statistic.validations_total} validation executed <br />
              {statistic.rows_processed} rows proccessed
            </button>
          </div>
          <div className="col-3">
            <h5 className="text-center">Success</h5>
            <button className="btn btn-success" style={styles.statisticCard}>
              {statistic.validations_success} validations passed <br />
              {statistic.rows_success} rows passed validation
            </button>
          </div>
          <div className="col-3">
            <h5 className="text-center">Failure</h5>
            <button className="btn btn-warning" style={styles.statisticCard}>
              {statistic.validations_failed} validations failed <br />
              {statistic.rows_failed} anomaly rows detected
            </button>
          </div>
          <div className="col-3">
            <h5 className="text-center">Percentage</h5>
            <button className="btn btn-info" style={styles.statisticCard}>
              {statistic.validations_success_percent}% validations success{" "}
              <br />
              {statistic.rows_failed_percent}% anomaly rows detected
            </button>
          </div>
        </div>
      </div>
      <div className="row p-2 mb-3">
        <div className="col-12 col-md-6">
          <Chart1 dataset={validations} />
        </div>
        <div className="col-12 col-md-6">
          <Chart2 dataset={validations} />
        </div>
      </div>
    </div>
  );
}

function Intro() {
  const [clicked, setClicked] = useState(false);
  const ButtonClick = () => {
    if (clicked === false) {
      document.getElementById("button_show_hide").innerHTML = "Hide-Summary";
      document.getElementById("content").style.display = "none";
    } else {
      document.getElementById("button_show_hide").innerHTML = "Show-Summary";
      document.getElementById("content").style.display = "";
    }
    setClicked(!clicked);
  };
  return (
    <div>
      <div id="content" className="row mb-3">
        <div
          className="col-8"
          style={
            {
              // backgroundImage: `url(${dqc_back})`,
            }
          }
        >
          <h4 style={{ fontSize: "27px", color: "#045fb4", opacity: 0.7 }}>
            Marshal - Graviton Data Quality Check Component
          </h4>
          <br />
          <p
            style={{
              fontSize: "20px",
              opacity: 0.75,
              fontFamily: "Sans-serif",
            }}
            className="content-justify"
          >
            <b>Quality is the critical component of the digital enterprise.</b>
            <br />
            <b>
              We have approached to deploy data quality service across the
              organization
            </b>
          </p>
          <p>
            {"\u2022"} The capability of data to satisfy the stated business,
            system, and technical requirements of an enterprise
          </p>
          <p>{"\u2022"} Data that are "fit for use by data consumers"</p>
          <p>{"\u2022"} Data "meeting or exceeding consumer expectations"</p>
          <p>
            {"\u2022"} Data that "satisfies the requirements of its intended
            use"
          </p>
          <p>
            {"\u2022"} Data that "are fit for their intended uses in operations,
            decision making and planning"
          </p>
        </div>
        <div className="col-1" style={{ textAlign: "right" }}>
          <img src={dqc_image} height={350} width={350}></img>
        </div>
      </div>
      <div>
        <Button
          id="button_show_hide"
          className="btn btn-secondary"
          style={{ width: "200px", display: "none" }}
          onClick={ButtonClick}
        >
          Show-Summary
        </Button>
        {clicked && <Introduction />}
      </div>
    </div>
  );
}

export default Intro;
