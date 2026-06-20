import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import DrawerNav from "./components/DrawerRouterContainer";
import Datasource from "./pages/Datasource";
import ExpectationSuite from "./pages/ExpectationSuite";
import Checkpoint from "./pages/Checkpoint";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Validations from "./pages/Validations";
import Reports from "./pages/Reports";
import Help from "./pages/Help";
import StreamValidation from "./pages/StremValidation";
import "@progress/kendo-theme-default/dist/all.css";
import DataProfiling from "./pages/DataProfiling";
import Wizard from "./pages/Wizard";
//import Details from './pages/Details'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DrawerNav />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/datasource" element={<Datasource />} />
            <Route path="/data_profiler" element={<DataProfiling />} />
            <Route path="/expectation_suite/*" element={<ExpectationSuite />} />
            <Route path="/checkpoint" element={<Checkpoint />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/validations" element={<Validations />} />
            <Route path="/stream_validation" element={<StreamValidation />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/data_onboarding_wizard" element={<Wizard />} />
            {/* <Route path="/details" element={<Details />} />*/}
            <Route path="*" element={<span>Page not found 404</span>} />
          </Route>
          <Route path="/help" element={<Help />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
