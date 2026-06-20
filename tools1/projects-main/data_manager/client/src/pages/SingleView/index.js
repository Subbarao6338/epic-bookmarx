import Components from "./components";
import Hub from "./hub";
import Purview from "./purview";
import Pipeline from "./pipeline";
import Observability from "./observability";
import ReportDashboardData from "./reportDashboardData";

export default function SingleView() {
  return (
    <>
      <div
        className="row m-1"
        style={{ position: "absolute", top: "410px", width: "100%" }}
      >
        <div className="row">
          <div
            className="col border border-2 border-primary m-1"
            style={{ borderRadius: 8 }}
          >
            <div className="text-center" style={{ fontSize: 20 }}>
              <b>Graviton Components</b>
            </div>
            <div className="row" style={{ height: "auto", color: "white" }}>
              <Components />
            </div>
            <div className="row" style={{ height: "auto", color: "white" }}>
              <Observability />
            </div>
            <div className="row" style={{ height: "auto", color: "white" }}>
              <ReportDashboardData />
            </div>
          </div>
          <div
            className="col border border-2 border-primary m-1"
            style={{ borderColor: "blue", borderRadius: 8 }}
          >
            <div className="text-center" style={{ fontSize: 20 }}>
              <b>Azure Resources</b>
            </div>
            <div className="row" style={{ height: "auto", color: "white" }}>
              <Hub />
            </div>
            <div className="row" style={{ height: "auto", color: "white" }}>
              <Purview />
            </div>
            <div className="row" style={{ height: "auto", color: "white" }}>
              <Pipeline />
            </div>
          </div>
        </div>

        {/* <div className="row" style={{ height: "auto" }}>
          <Components />
          <Hub />
        </div>
        <div className="row mt-3" style={{ height: "auto" }}>
          <Purview />
          <Pipeline />
        </div>
        <ReportDashboard />
        <div className="row mt-3" style={{ height: "auto" }}>
          <ReportDashboardData />
          <Observability />
          <div
            className="col mx-2"
            style={{ backgroundColor: "#E0DE92", borderRadius: 8 }}
          ></div>
        </div> */}
        <hr />
      </div>    
    </>
  );
}
