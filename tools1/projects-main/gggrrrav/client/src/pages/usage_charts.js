import React from "react"; // ,{ useState }
import { useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../messages/en-US";
import { httpget } from "../commonUtility/common_http";
import { Loader } from "@progress/kendo-react-indicators";
import {
  AreaChart,
  Area,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import UsageDonutchart from "../components/UsageDonutChart";
import { listusagemonitoring_url_chart } from "../commonUtility/api_urls";
import "react-datepicker/dist/react-datepicker.css";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { DropDownList } from "@progress/kendo-react-dropdowns";
loadMessages(enMessages, "en-US");
const navitems = [
  {
    id: "home",
    route_url: "/costusage",
    text: "Cost and Usage Management",
  },
  {
    id: "usage_summary",
    text: "Usage Summary",
  },
];
const initialSort = [
  {
    field: "quantity",
    dir: "asc",
  },
];
var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
const dateFormatter = (date) => {
  return new Date(date).toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  });
};
const UsageCharts = () => {
  function removedecimalpnt(input) {
    return Math.round(input * 100) / 100;
  }
  function appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n;
  }
  let history = useHistory();
  const [
    value,
    //  setvalue
  ] = React.useState("Service Name");
  const [navdata] = React.useState(navitems);
  const [donutService, setDonutService] = React.useState("");
  const [donutLocation, setDonutLocation] = React.useState("");
  const [donutResourceGroup, setDonutResourceGroup] = React.useState("");
  // const [date,setdate,] = React.useState([])
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    history.push(navdata[itemIndex]["route_url"]);
  };
  const req_value = {
    params: {
      FromDate: firstDay,
      ToDate: lastDay,
    },
  };
  React.useEffect(() => {
    httpget(listusagemonitoring_url_chart, req_value).then(
      (listusagemonitoring_result) => {
        let service_obj_list = [];
        debugger;
        service_obj_list.push({
          "service_name": JSON.parse(listusagemonitoring_result.servicename),
          "service_cost": JSON.parse(listusagemonitoring_result.servicecost)
        });
        console.log(JSON.stringify(service_obj_list[0]));
        console.log(JSON.stringify(service_obj_list[0]['service_name']));
        console.log(service_obj_list[0]['service_name'])
        setDonutService(service_obj_list[0]);
        let location_obj_list = [];
        location_obj_list.push({
          "location": JSON.parse(listusagemonitoring_result.location),
          "location_cost": JSON.parse(listusagemonitoring_result.locationcost)});
          setDonutLocation(location_obj_list[0])
        let rsg_obj_list = [];
        rsg_obj_list.push({
          "rsg": JSON.parse(listusagemonitoring_result.rsg),
          "rsg_cost": JSON.parse(listusagemonitoring_result.rsgcost)});
          setDonutResourceGroup(rsg_obj_list[0])
        //  let json_result = JSON.parse(listusagemonitoring_result);
        // console.log(json_result);
        // let result1 = json_result.list_consumed_service.map((obj) => ({
        //   consumedService: obj.consumedService,
        //   quantity: obj.quantity ,
        // }));
        // setservicedata(result1);
        // let result2 = json_result.list_resource_location.map((obj) => ({
        //   resourceLocation: obj.resourceLocation,
        //   quantity: obj.quantity ,
        // }));
        // setlocation(result2);
        // let result3 = json_result.list_resource_group.map((obj) => ({
        //   resourceGroup: obj.resourceGroup,
        //   quantity: obj.quantity ,
        // }));
        // setrsgdata(result3);
        // let result4 = json_result.list_area_chart.map((obj) => ({
        //   quantity: obj.quantity ,
        //   date:
        //     new Date(obj.date).getFullYear() +
        //     "-" +
        //     appendLeadingZeroes(new Date(obj.date).getMonth() + 1) +
        //     "-" +
        //     appendLeadingZeroes(new Date(obj.date).getDate()),
        // }));
        // console.log(result4)
        // let Accumulated_arr = [];
        // let obj = {
        //   "Accumulated Quantity": result4[0].quantity,
        //   date: result4[0].date,
        // };
        // Accumulated_arr.push(obj);
        // for (let j = 1; j < result4.length; j++) {
        //   let obj = {
        //     "Accumulated Quantity":
        //     removedecimalpnt(Accumulated_arr[j - 1].Accumulated_Quantity + result4[j].quantity),
        //     date: result4[j].date,
        //   };
        //   Accumulated_arr.push(obj);
        // }
        // setarea(result4);
        // setnum(Accumulated_arr);
      }
    );
  }, []);
  const [sort, setSort] = React.useState(initialSort);
  // Dropdown Change and Donut Filter code
  const [serviceDropValue, setServiceDropValue] = React.useState("All");
  const handleServiceChange = (event) => {
    setServiceDropValue(event.target.value);
  };
  const [locationDropValue, setLocationDropValue] = React.useState("All");
  const handleLocationChange = (event) => {
    setLocationDropValue(event.target.value);
  };
  const [resourceDropValue, setResourceDropValue] = React.useState("All");
  const handleResourceChange = (event) => {
    setResourceDropValue(event.target.value);
  };
  return (
    <React.Fragment>
      <Breadcrumb
        className="navigationbtn"
        data={navdata}
        onItemSelect={handleItemSelect}
      />
      <div>
        <div>
          <h3 align="left" id="heading">
            Usage Summary
          </h3>
        </div>
        <hr />
        <div
          style={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        ></div>
        <br />
        <br />
        {/* <div>
          <AreaChart
            width={1100}
            height={250}
            data={num}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAccCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#55D455" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#55D455" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tickFormatter={dateFormatter} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area
              type="area"
              // dot={true}
              dataKey="Accumulated Quantity"
              stroke="#55D455"
              fillOpacity={1}
              fill="url(#colorAccCost)"
            />
          </AreaChart>
          <br />
        </div> */}
        <div
          style={{
            display: "flex",
            margin: "auto",
            color: "black",
            columnGap: "10px",
            justifyContent: "space-between",
          }}
        >
            <div style={{ width: "33%" }}>
              {donutService === "" ? (
                <div
                  style={{
                    height: "50vh",
                    width: "100%",
                    border: "1px solid #ebebeb",
                  }}
                  className="center_loader"
                >
                  <Loader size="large" themeColor="info" type="pulsing" />
                </div>
              ) : (
                <div
                  className="k-card"
                  style={{
                    height: "50vh",
                    width: "100%",
                  }}
                >
                  <div style={{ width: "60%", marginTop: 10 }}>
                    <DropDownList
                      style={{ width: "100%" }}
                      label="Service name"
                      fillMode={"flat"}
                      defaultItem="All"
                      data={donutService["service_name"]}
                      onChange={handleServiceChange}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <UsageDonutchart
                      labels={
                        serviceDropValue === "All"
                          ? donutService["service_name"]
                          : donutService["service_name"]
                            .filter((val) => val === serviceDropValue)
                            .map((filteredval) => {
                              return filteredval;
                            })
                      }
                      donutData={
                        serviceDropValue === "All"
                          ? donutService["service_cost"]
                          : donutService["service_cost"]
                            .filter(
                              (val) =>
                                val ===
                                donutService["service_cost"][
                                donutService["service_name"].indexOf(
                                  serviceDropValue
                                )
                                ]
                            )
                            .map((filteredval) => {
                              return filteredval;
                            })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
            <div style={{ width: "33%" }}>
            {donutLocation === "" ? (
              <div
                style={{
                  height: "50vh",
                  width: "100%",
                  border: "1px solid #ebebeb",
                }}
                className="center_loader"
              >
                <Loader size="large" themeColor="info" type="pulsing" />
              </div>
            // ) : donutLocation["msg"] === "Failure" ? (
            //   <Label>API Failure</Label>
            ) : (
              <div
                className="k-card"
                style={{
                  height: "50vh",
                  width: "100%",
                }}
              >
                <div style={{ width: "60%", marginTop: 10 }}>
                  <DropDownList
                    style={{ width: "100%" }}
                    label="Location"
                    fillMode={"flat"}
                    defaultItem="All"
                    data={donutLocation.location}
                    onChange={handleLocationChange}
                  />
                </div>
                <div
                  style={{
                    marginTop: "20px",
                  }}
                >
                  <UsageDonutchart
                    labels={
                      locationDropValue === "All"
                        ? donutLocation["location"]
                        : donutLocation["location"]
                            .filter((val) => val === locationDropValue)
                            .map((filteredval) => {
                              return filteredval;
                            })
                    }
                    donutData={
                      locationDropValue === "All"
                        ? donutLocation["location_cost"]
                        : donutLocation["location_cost"]
                            .filter(
                              (val) =>
                                val ===
                                donutLocation["location_cost"][
                                  donutLocation["location"].indexOf(
                                    locationDropValue
                                  )
                                ]
                            )
                            .map((filteredval) => {
                              return filteredval;
                            })
                    }
                    // labels={donutLocation["location"]}
                    // donutData={donutLocation["locationcost"]}
                  />
                </div>
              </div>
            )}
            </div>
            <div style={{ width: "33%" }}>
              {donutResourceGroup === "" ? (
                <div
                  style={{
                    height: "50vh",
                    width: "100%",
                    border: "1px solid #ebebeb",
                  }}
                  className="center_loader"
                >
                  <Loader size="large" themeColor="info" type="pulsing" />
                </div>
              ) : (
                <div
                  className="k-card"
                  style={{
                    height: "50vh",
                    width: "100%",
                  }}
                >
                  <div style={{ width: "60%", marginTop: 10 }}>
                    <DropDownList
                      style={{ width: "100%" }}
                      label="Resource Group"
                      fillMode={"flat"}
                      defaultItem="All"
                      data={donutResourceGroup.rsg}
                      onChange={handleResourceChange}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <UsageDonutchart
                      labels={
                        resourceDropValue === "All"
                          ? donutResourceGroup["rsg"]
                          : donutResourceGroup["rsg"]
                            .filter((val) => val === resourceDropValue)
                            .map((filteredval) => {
                              return filteredval;
                            })
                      }
                      donutData={
                        resourceDropValue === "All"
                          ? donutResourceGroup["rsg_cost"]
                          : donutResourceGroup["rsg_cost"]
                            .filter(
                              (val) =>
                                val ===
                                donutResourceGroup["rsg_cost"][
                                  donutResourceGroup["rsg"].indexOf(
                                  resourceDropValue
                                )
                                ]
                            )
                            .map((filteredval) => {
                              return filteredval;
                            })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
        {/* <div>
          <Grid
            style={{
              width: "100%",
              height: "300px",
              backgroundColor: "white",
            }}
            data={orderBy(area, sort)}
            sortable={true}
            sort={sort}
            onSortChange={(e) => {
              setSort(e.sort);
            }}
          >
            <Column field="date" title="Date" id="col" />
            <Column
              width="100"
              field="quantity"
              title="Quantity"
              className="costcolumnview"
            />
          </Grid> */}
        {/* </div> */}
        </div>
        </div>
    </React.Fragment>
  );
};
export default UsageCharts;