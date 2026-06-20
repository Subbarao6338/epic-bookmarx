import temp_img from "../../assets/reports_thumbnail/Dashboard_tm.png";
import pred_img from "../../assets/reports_thumbnail/Dashboard_pm.png";

export default function ReportDashboard() {
  return (
    <div
      className="row m-1 mt-3"
      style={{
        backgroundColor: "#D5DBDB",
        borderRadius: 8,
        height: "auto",
      }}
    >
      {/* <div className="text-center">
            <b>Reports & Dashboards</b>
          </div> */}
      <div
        className="col-2 border text-start p-2 m-2 pb-1"
        style={{
          width: 190,
          height: "auto",
          backgroundColor: "#808B96",
          borderRadius: 6,
        }}
      >
        <a href="">
          <img
            alt="No Preview"
            src={temp_img}
            style={{ width: 170, height: 80 }}
          />
          <br />
          <div
            className="text-center"
            style={{ color: "black", fontSize: 14, fontWeight: 500 }}
          >
            Reports & Dashboards
          </div>
        </a>
      </div>
      <div
        className="col-2 border text-start p-2 m-2 pb-1"
        style={{
          width: 190,
          backgroundColor: "#808B96",
          borderRadius: 6,
        }}
      >
        <a href="">
          <img
            alt="No Preview"
            src={pred_img}
            style={{ width: 170, height: 80 }}
          />
          <br />
          <div
            className="text-center"
            style={{ color: "black", fontSize: 14, fontWeight: 500 }}
          >
            Predictive Maintenance Dashboard
          </div>
        </a>
      </div>
    </div>
  );
}
