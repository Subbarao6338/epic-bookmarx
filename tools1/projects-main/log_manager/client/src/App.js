import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "@progress/kendo-theme-default/dist/all.css";
import DrawerNav from "./components/Layout";
import Home from "./pages/Home";
import Config from "./pages/Config";
import Dashboard from "./pages/Dashboard";
import Target from "./pages/Target";
import AzureMonitor from "./pages/Target/AzureMonitor";
import View from "./pages/View";
import Alert from "./pages/Alert";
import ContactPoint from "./pages/Alert/ContactPoint";
import ErrorBoundary from "./components/ErrorBoundary";
import Alertinput from "./pages/Alert/Alertinput";
import Contactinput from "./pages/Alert/Contactinput";
import Explore from "./pages/Explore";
import Pipeline from "./pages/Pipeline";
// import ProtectedRoute from "./authUtility/ProtectedRoute";
// import AzureMonitor from "./pages/Target/AzureMonitor";
function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route element={<DrawerNav />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/config" element={<Config />} />
            <Route path="/target" element={<Target />} />
            <Route path="/view/*" element={<View />} />
            <Route path="/explore/*" element={<Explore />} />
            <Route path="/alert" element={<Alert />} />
            <Route path="/contact" element={<ContactPoint />} />
            <Route path="/Alertinput" element={<Alertinput />} />
            <Route path="/Contactinput" element={<Contactinput />} />
            <Route path="/target/:id" element={<AzureMonitor />} />
            <Route path="/pipeline/*" element={<Pipeline />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

function Error404() {
  return (
    <div className="p-4 text-center">
      <b>Error 404</b>
      <br />
      <Link to="/home">HomePage</Link>
    </div>
  );
}
