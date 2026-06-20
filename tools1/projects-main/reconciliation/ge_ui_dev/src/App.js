import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import DrawerNav from "./components/DrawerRouterContainer";
import Layout from "./components/Layout";
import Project from "./pages/Projects";
import EditProject from "./pages/Projects/editProject"
import "@progress/kendo-theme-default/dist/all.css";

//import Details from './pages/Details'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DrawerNav />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/projects" element={<Project />} />
            <Route path="/editproject/:project_id" element={<EditProject />} />
            <Route path="*" element={<span>Page not found 404</span>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
