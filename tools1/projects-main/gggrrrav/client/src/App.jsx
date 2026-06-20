import React from "react";
import Welcomepage from "./pages/welcomepage";
import { AppContext } from "./AppContext";
import {
  IntlProvider,
  LocalizationProvider,
  loadMessages,
} from "@progress/kendo-react-intl";
import AzureMsalProvider from "./authUtility/AzureMsal";
import ProtectedRoute from "./authUtility/ProtectedRoute";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import logout from "./pages/Logout";
import DataSourceCreate from "./pages/datasource_create";
import DataSourceSummary from "./pages/datasource_summary";
import Metadatacreate from "./pages/metadata_create";
import MetadataFileView from "./pages/metadata_fileview";
import MetadataSummary from "./pages/metadata_summary";
import SettingsSummary from "./pages/settings_summary";
import CreateSettings from "./pages/settings_create";
import DataPipelineSummary from "./pages/datapipeline_summary";
import Reports from "./pages/reports_dashboards";
import Cost from "./pages/cost_usage";
import ResourceProvisioning from "./pages/resource_provisioning";
import DataScience from "./pages/data_science";
import DataServices from "./pages/data_services";
import OrganizationSummary from "./pages/organization_summary";
import OrganizationCreate from "./pages/organization_create";
import servicerequest from "./pages/servicerequest";
import servicerequestcreate from "./pages/servicerequest_create";
import ProjectsCreate from "./pages/projects_create";
import ProjectsSummary from "./pages/projects_summary";
import CostSummary from "./pages/cost";
import CostUsage from "./pages/cost_manage.js";
import { enMessages } from "./messages/en-US";
import DataUsageSummary from "./pages/usagemonitoring";
import Usagecreate from "./pages/usage_create";
import CostCharts from "./pages/cost_charts.js";
// import Signin from './pages/signin'
import "hammerjs";
import "@progress/kendo-theme-default/dist/all.css";
import "./App.scss";
import Graviton_Login from "./authUtility/GravitonLogin";
import UnAuthorizedAccess from "./error_pages/401_Page";
import PageNotFound from "./error_pages/404_Page";
import ServiceRequestDetails from "./pages/servicerequest_details.js";
import ServiceRequestDetailsComments from "./pages/servicerequest_comment.js";
import InternalServerError from "./error_pages/500_Page";
import SearchResult from "./pages/search_results.js";
import UsageCharts from "./pages/usage_charts.js";
import DeploySoftware from "./pages/deploy_software";
import DeployData from "./pages/deploy_data";
import Airflow from "./pages/airflow";
import Kubernetes from "./pages/kubernetes";
import "axios-progress-bar/dist/nprogress.css";
// import DrawerRouterContainer from "./components/DrawerRouterContainer.jsx";
import UserManagement from "./pages/userManagement/index.js";
import AddUser from "./pages/userManagement/addUser";
import DeleteUser from "./pages/userManagement/DeleteUser";
import ProjectManagement from "./pages/projectManagement";
import CreateProject from "./pages/projectManagement/createProject";
import EditExisting from "./pages/projectManagement/editExisting";
import WelcomePage from "./pages/welcome/welcomePage";
import ProjectSubManagement from "./pages/projectManagement/projectSubManagement";
import ProvisionedResourceDetails from "./pages/projectManagement/provisionedResourceDetails";
import DpadminResource from "./pages/dpadminresource";
import Addresource from "./pages/addresource";
import Deleteresource from "./pages/deleteresource";
import Projectresource from "./pages/assignresource";
// import Dynamictile from "./pages/Dynamic";

loadMessages(enMessages, "en-US");

const App = () => {
  const [contextState, setContextState] = React.useState({
    localeId: "en-US",
  });
  const onLanguageChange = React.useCallback(
    (event) => {
      setContextState({ ...contextState, localeId: event.value.localeId });
    },
    [contextState, setContextState]
  );
  const onProfileChange = React.useCallback(
    (event) => {
      setContextState({ ...contextState, ...event.dataItem });
    },
    [contextState, setContextState]
  );

  return (
    <div className="App">
      <div id="loader" class="lds-dual-ring hidden overlay"></div>
      <LocalizationProvider language={contextState.localeId}>
        <IntlProvider locale={contextState.localeId}>
          <AppContext.Provider
            value={{ ...contextState, onLanguageChange, onProfileChange }}
          >
            <AzureMsalProvider>
              <Router>
                {/* <Header/> */}

                <Switch>
                  <Route exact path="/azure_login" component={Login} />
                  <Route exact path="/azure_logout" component={logout} />
                  <Route exact path="/login" component={Graviton_Login} />
                  <Route exact path="/" component={Graviton_Login} />
                  <Route
                    exact
                    path="/unauthorizedAccess"
                    component={UnAuthorizedAccess}
                  />
                  <Route
                    exact
                    path="/internal_server_error"
                    component={InternalServerError}
                  />
                  <ProtectedRoute
                    exact
                    path="/welcome"
                    component={Welcomepage}
                  />
                  <ProtectedRoute exact path="/home" component={WelcomePage} />
                  <ProtectedRoute
                    exact
                    path="/home_ex"
                    component={Welcomepage}
                  />
                  {/*                   <DrawerRouterContainer> */}
                  <Route exact path="/search_result" component={SearchResult} />
                  <ProtectedRoute
                    exact
                    path="/datasource_create"
                    component={DataSourceCreate}
                  />
                  <ProtectedRoute
                    exact
                    path="/datasource_summary"
                    component={DataSourceSummary}
                  />
                  <ProtectedRoute
                    exact
                    path="/metadata_create"
                    component={Metadatacreate}
                  />
                  <ProtectedRoute
                    exact
                    path="/metadata_fileview"
                    component={MetadataFileView}
                  />
                  <ProtectedRoute
                    exact
                    path="/metadata_summary"
                    component={MetadataSummary}
                  />
                  <ProtectedRoute
                    exact
                    path="/settings_summary"
                    component={SettingsSummary}
                  />
                  <ProtectedRoute
                    exact
                    path="/settings_create"
                    component={CreateSettings}
                  />
                  <ProtectedRoute
                    exact
                    path="/datapipeline_summary"
                    component={DataPipelineSummary}
                  />
                  <ProtectedRoute exact path="/reports" component={Reports} />
                  <ProtectedRoute exact path="/costusage" component={Cost} />
                  <ProtectedRoute
                    exact
                    path="/resourceprovisioning"
                    component={ResourceProvisioning}
                  />
                  <ProtectedRoute
                    exact
                    path="/datascience"
                    component={DataScience}
                  />
                  <ProtectedRoute
                    exact
                    path="/dataservices"
                    component={DataServices}
                  />
                  {/*############################################*/}
                  <ProtectedRoute
                    exact
                    path="/user_management"
                    component={UserManagement}
                  />
                  <ProtectedRoute exact path="/add_user" component={AddUser} />
                  <ProtectedRoute
                    exact
                    path="/delete_user"
                    component={DeleteUser}
                  />
                  <ProtectedRoute
                    exact
                    path="/project_management"
                    component={ProjectManagement}
                  />
                  <ProtectedRoute
                    exact
                    path="/create_project"
                    component={CreateProject}
                  />
                  <ProtectedRoute
                    exact
                    path="/edit_project"
                    component={EditExisting}
                  />
                  <ProtectedRoute
                    exact
                    path="/project_submanagement"
                    component={ProjectSubManagement}
                  />
                  <ProtectedRoute
                    exact
                    path="/provisioned_resourcedetails"
                    component={ProvisionedResourceDetails}
                  />
                  {/*############################################*/}

                  <ProtectedRoute
                    exact
                    path="/organization_summary"
                    component={OrganizationSummary}
                  />
                  <ProtectedRoute
                    exact
                    path="/organization_create"
                    component={OrganizationCreate}
                  />
                  <ProtectedRoute
                    exact
                    path="/servicerequest"
                    component={servicerequest}
                  />
                  <ProtectedRoute
                    exact
                    path="/servicerequest_create"
                    component={servicerequestcreate}
                  />
                  <ProtectedRoute
                    exact
                    path="/projects_create"
                    component={ProjectsCreate}
                  />
                  <ProtectedRoute
                    exact
                    path="/projects_summary"
                    component={ProjectsSummary}
                  />
                  <ProtectedRoute exact path="/cost" component={CostSummary} />
                  <ProtectedRoute
                    exact
                    path="/cost_manage"
                    component={CostUsage}
                  />
                  <ProtectedRoute
                    exact
                    path="/cost_charts"
                    component={CostCharts}
                  />
                  <ProtectedRoute
                    exact
                    path="/usage_create"
                    component={Usagecreate}
                  />
                  <ProtectedRoute
                    exact
                    path="/usagemonitoring"
                    component={DataUsageSummary}
                  />
                  <ProtectedRoute
                    exact
                    path="/servicerequest_details"
                    component={ServiceRequestDetails}
                  />
                  <ProtectedRoute
                    exact
                    path="/servicerequest_comment"
                    component={ServiceRequestDetailsComments}
                  />
                  <ProtectedRoute
                    exact
                    path="/usage_charts"
                    component={UsageCharts}
                  />
                  <ProtectedRoute
                    exact
                    path="/deploy_software"
                    component={DeploySoftware}
                  />
                  <ProtectedRoute
                    exact
                    path="/deploy_data"
                    component={DeployData}
                  />
                  <ProtectedRoute
                    exact
                    path="/kubernetes"
                    component={Kubernetes}
                  />
                  <ProtectedRoute exact path="/airflow" component={Airflow} />
                  <ProtectedRoute
                    exact
                    path="/dpadminresource"
                    component={DpadminResource}
                  />
                  <ProtectedRoute
                    exact
                    path="/addresource"
                    component={Addresource}
                  />
                  <ProtectedRoute
                    exact
                    path="/deleteresource"
                    component={Deleteresource}
                  />
                  <ProtectedRoute
                    exact
                    path="/assignresource"
                    component={Projectresource}
                  />
                  {/* <ProtectedRoute
                    exact
                    path="/Dynamic"
                    component={Dynamictile}
                  /> */}
                  <ProtectedRoute
                    path="/dashboard_check"
                    component={() => {
                      // window.location.href = 'https://www.google.com';
                      window.open(
                        "https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.DataFactory%2FdataFactories",
                        "_blank"
                      );
                      return null;
                    }}
                  />

                  <Route component={PageNotFound} />
                </Switch>
              </Router>
            </AzureMsalProvider>
          </AppContext.Provider>
        </IntlProvider>
      </LocalizationProvider>
    </div>
  );
};

export default App;
