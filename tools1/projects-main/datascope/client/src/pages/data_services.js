import * as React from "react";
import { Link } from "react-router-dom";
import catalog from "../assets/data_services/catalog.png";
import sdg from "../assets/data_services/datagenie.png";
import dqc from "../assets/data_services/quality-control.png";
import ads from "../assets/data_services/anomaly_detection.png";
import logparser from "../assets/data_services/logparser.png";
import semantico_img from "../assets/data_services/semantico.png";
const urlItems = [
  {
    name: "purview",
    route_url:
      "https://portal.azure.com/#blade/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/product/%7B%22displayName%22%3A%22Azure%20Purview%20(Preview)%22%2C%22itemDisplayName%22%3A%22Azure%20Purview%20(Preview)%22%2C%22id%22%3A%22azuresentinel.azure-sentinel-solution-azurepurview%22%2C%22bigId%22%3A%22DZH318Z0BBPS%22%2C%22offerId%22%3A%22azure-sentinel-solution-azurepurview%22%2C%22publisherId%22%3A%22azuresentinel%22%2C%22publisherDisplayName%22%3A%22Azure%20Sentinel%2C%20Microsoft%20Corporation%22%2C%22summary%22%3A%22Azure%20Purview%22%2C%22longSummary%22%3A%22The%20Azure%20Purview%20Solution%20enables%20data%20sensitivity%20enrichment%20of%20Microsoft%20Sentinel.%20%22%2C%22description%22%3A%22%3Cp%3E%3Cstrong%3EImportant%3A%3C%2Fstrong%3E%20%3Cem%3EThis%20Microsoft%20Sentinel%20Solution%20is%20currently%20in%20public%20preview.%20This%20feature%20is%20provided%20without%20a%20service%20level%20agreement%2C%20and%20it's%20not%20recommended%20for%20production%20workloads.%20Certain%20features%20might%20not%20be%20supported%20or%20might%20have%20constrained%20capabilities.%20For%20more%20information%2C%20see%20%3Ca%20target%3D%5C%22_blank%5C%22%20href%3D%5C%22https%3A%2F%2Fazure.microsoft.com%2Fsupport%2Flegal%2Fpreview-supplemental-terms%2F%5C%22%20rel%3D%5C%22noopener%5C%22%3ESupplemental%20Terms%20of%20Use%20for%20Microsoft%20Azure%20Previews%3C%2Fa%3E.%3C%2Fem%3E%3C%2Fp%3E%3Cp%3E%3Cstrong%3ENote%3A%3C%2Fstrong%3E%20%3Cem%3EThere%20may%20be%20%3Ca%20target%3D%5C%22_blank%5C%22%20href%3D%5C%22https%3A%2F%2Faka.ms%2Fsentinelsolutionsknownissues%5C%22%20rel%3D%5C%22noopener%5C%22%3Eknown%20issues%3C%2Fa%3E%20pertaining%20to%20this%20Solution%2C%20please%20refer%20to%20them%20before%20installing.%3C%2Fem%3E%3C%2Fp%3E%3Cp%3EThe%20Azure%20Purview%20Solution%20enables%20data%20sensitivity%20enrichment%20of%20Microsoft%20Sentinel.%20Data%20classification%20and%20sensitivity%20label%20logs%20from%20Azure%20Purview%20scans%20are%20ingested%20and%20visualized%20through%20workbooks%2C%20analytical%20rules%2C%20and%20more.%3C%2Fp%3E%3Cp%3EMicrosoft%20Sentinel%20Solutions%20provide%20a%20consolidated%20way%20to%20acquire%20Microsoft%20Sentinel%20content%20like%20data%20connectors%2C%20workbooks%2C%20analytics%2C%20and%20automations%20in%20your%20workspace%20with%20a%20single%20deployment%20step.%3C%2Fp%3E%3Cp%3E%3Cstrong%3EData%20Connectors%3A%3C%2Fstrong%3E%201%2C%20%3Cstrong%3EWorkbooks%3A%3C%2Fstrong%3E%201%2C%20%3Cstrong%3EAnalytic%20Rules%3A%3C%2Fstrong%3E%202%3C%2Fp%3E%3Cp%3E%3Ca%20target%3D%5C%22_blank%5C%22%20href%3D%5C%22https%3A%2F%2Faka.ms%2Fazuresentinel%5C%22%20rel%3D%5C%22noopener%5C%22%3ELearn%20more%20about%20Microsoft%20Sentinel%3C%2Fa%3E%20%7C%20%3Ca%20target%3D%5C%22_blank%5C%22%20href%3D%5C%22https%3A%2F%2Faka.ms%2Fazuresentinelsolutionsdoc%5C%22%20rel%3D%5C%22noopener%5C%22%3ELearn%20more%20about%20Solutions%3C%2Fa%3E%3C%2Fp%3E%22%2C%22isPrivate%22%3Afalse%2C%22hasPrivateOffer%22%3Afalse%2C%22isMacc%22%3Afalse%2C%22isPreview%22%3Afalse%2C%22isByol%22%3Afalse%2C%22isCSPEnabled%22%3Atrue%2C%22isCSPSelective%22%3Afalse%2C%22isThirdParty%22%3Atrue%2C%22isStopSell%22%3Afalse%2C%22isReseller%22%3Afalse%2C%22hasFreeTrials%22%3Afalse%2C%22marketingMaterial%22%3A%5B%5D%2C%22legalTermsUri%22%3A%22https%3A%2F%2Fgo.microsoft.com%2Ffwlink%2F%3Flinkid%3D2041178%22%2C%22privacyPolicyUri%22%3A%22https%3A%2F%2Fprivacy.microsoft.com%2F%22%2C%22version%22%3A%22861e6ea7-6965-461d-adea-b3be48ada775%22%2C%22metadata%22%3A%7B%22leadGeneration%22%3A%7B%22productId%22%3Anull%7D%2C%22testDrive%22%3Anull%7D%2C%22categoryIds%22%3A%5B%22security%22%2C%22information-protection%22%2C%22threat-protection%22%2C%22azureCertified%22%2C%22fromPublishingPortal%22%2C%22multiResourceSolution%22%2C%22readonlytemplate%22%2C%22virtualMachine%22%2C%22virtualMachine-Arm%22%5D%2C%22screenshotUris%22%3A%5B%5D%2C%22videos%22%3A%5B%5D%2C%22links%22%3A%5B%7B%22id%22%3A%22Azure%20Sentinel%22%2C%22displayName%22%3A%22Azure%20Sentinel%22%2C%22uri%22%3A%22https%3A%2F%2Faka.ms%2Fazuresentinel%22%7D%2C%7B%22id%22%3A%22Azure%20Sentinel%20Solutions%22%2C%22displayName%22%3A%22Azure%20Sentinel%20Solutions%22%2C%22uri%22%3A%22https%3A%2F%2Faka.ms%2Fazuresentinelsolutionsdoc%22%7D%2C%7B%22id%22%3A%22Known%20Issues%22%2C%22displayName%22%3A%22Known%20Issues%22%2C%22uri%22%3A%22https%3A%2F%2Faka.ms%2Fsentinelsolutionsknownissues%22%7D%5D%2C%22filters%22%3A%5B%5D%2C%22plans%22%3A%5B%7B%22id%22%3A%220002%22%2C%22displayName%22%3A%22Microsoft%20Azure%20Purview%20(Preview)%22%2C%22summary%22%3A%22Azure%20Sentinel%20Solution%22%2C%22description%22%3A%22This%20Azure%20Sentinel%20Solution%20is%20free%20to%20install.%22%2C%22restrictedAudience%22%3A%7B%7D%2C%22skuId%22%3A%220002%22%2C%22planId%22%3A%22azure-sentinel-solution-microsoftazurepurview%22%2C%22legacyPlanId%22%3A%22azuresentinel.azure-sentinel-solution-azurepurviewazure-sentinel-solution-microsoftazurepurview%22%2C%22keywords%22%3A%5B%5D%2C%22type%22%3A%22SolutionTemplate%22%2C%22leadGeneration%22%3A%7B%22productId%22%3Anull%7D%2C%22testDrive%22%3Anull%2C%22categoryIds%22%3A%5B%5D%2C%22conversionPaths%22%3A%5B%5D%2C%22metadata%22%3A%7B%7D%2C%22uiDefinitionUri%22%3A%22https%3A%2F%2Fcatalogartifact.azureedge.net%2Fpublicartifacts%2Fazuresentinel.azure-sentinel-solution-azurepurview-861e6ea7-6965-461d-adea-b3be48ada775-azure-sentinel-solution-microsoftazurepurview%2FUiDefinition.json%22%2C%22artifacts%22%3A%5B%7B%22name%22%3A%22createuidefinition%22%2C%22uri%22%3A%22https%3A%2F%2Fcatalogartifact.azureedge.net%2Fpublicartifacts%2Fazuresentinel.azure-sentinel-solution-azurepurview-861e6ea7-6965-461d-adea-b3be48ada775-azure-sentinel-solution-microsoftazurepurview%2FArtifacts%2FcreateUiDefinition.json%22%2C%22type%22%3A%22Custom%22%7D%2C%7B%22name%22%3A%22UiDefinition.json%22%2C%22uri%22%3A%22https%3A%2F%2Fcatalogartifact.azureedge.net%2Fpublicartifacts%2Fazuresentinel.azure-sentinel-solution-azurepurview-861e6ea7-6965-461d-adea-b3be48ada775-azure-sentinel-solution-microsoftazurepurview%2FUiDefinition.json%22%2C%22type%22%3A%22Custom%22%7D%2C%7B%22name%22%3A%22DefaultTemplate%22%2C%22uri%22%3A%22https%3A%2F%2Fcatalogartifact.azureedge.net%2Fpublicartifacts%2Fazuresentinel.azure-sentinel-solution-azurepurview-861e6ea7-6965-461d-adea-b3be48ada775-azure-sentinel-solution-microsoftazurepurview%2FArtifacts%2FmainTemplate.json%22%2C%22type%22%3A%22Template%22%7D%5D%2C%22isPrivate%22%3Afalse%2C%22isHidden%22%3Afalse%2C%22hasFreeTrials%22%3Afalse%2C%22isByol%22%3Afalse%2C%22isFree%22%3Afalse%2C%22isPayg%22%3Atrue%2C%22isStopSell%22%3Afalse%2C%22cspState%22%3A%22OptIn%22%2C%22isQuantifiable%22%3Afalse%2C%22purchaseDurationDiscounts%22%3A%5B%5D%2C%22upns%22%3A%5B%5D%2C%22hasRI%22%3Afalse%2C%22stackType%22%3A%22ARM%22%7D%5D%2C%22selectedPlanId%22%3A%22azure-sentinel-solution-microsoftazurepurview%22%2C%22iconFileUris%22%3A%7B%22medium%22%3A%22https%3A%2F%2Fstore-images.s-microsoft.com%2Fimage%2Fapps.42972.0c626aeb-5962-41e1-86f9-a0544b482619.0a497f91-a576-4b02-b9bc-4ec39edf8e92.128a1edb-08ae-4433-89db-cb1a4fc1bd52%22%2C%22small%22%3A%22https%3A%2F%2Fstore-images.s-microsoft.com%2Fimage%2Fapps.14007.0c626aeb-5962-41e1-86f9-a0544b482619.0a497f91-a576-4b02-b9bc-4ec39edf8e92.a5633935-5032-4197-91fa-04d5acb8d737%22%2C%22wide%22%3A%22https%3A%2F%2Fstore-images.s-microsoft.com%2Fimage%2Fapps.4042.0c626aeb-5962-41e1-86f9-a0544b482619.0a497f91-a576-4b02-b9bc-4ec39edf8e92.3247905c-bad3-40da-872a-341add683ae8%22%2C%22large%22%3A%22https%3A%2F%2Fstore-images.s-microsoft.com%2Fimage%2Fapps.62344.0c626aeb-5962-41e1-86f9-a0544b482619.0a497f91-a576-4b02-b9bc-4ec39edf8e92.46eee1cd-2554-49d8-9c83-9eed826494c3%22%7D%2C%22itemType%22%3A%22Single%22%2C%22hasNoProducts%22%3Afalse%2C%22hasNoPlans%22%3Afalse%2C%22privateBadgeText%22%3Anull%2C%22createBladeType%22%3A1%2C%22offerType%22%3A%22AzureApplication%22%2C%22useEnterpriseContract%22%3Atrue%2C%22hasStandardContractAmendments%22%3Afalse%2C%22standardContractAmendmentsRevisionId%22%3A%2200000000-0000-0000-0000-000000000000%22%2C%22supportUri%22%3A%22https%3A%2F%2Fsupport.microsoft.com%2F%22%2C%22isMicrosoftProduct%22%3Atrue%2C%22productOwnershipSellingMotion%22%3A%223PPAgency%22%2C%22galleryItemAccess%22%3A0%2C%22privateSubscriptions%22%3A%5B%5D%2C%22isTenantPrivate%22%3Afalse%2C%22hasRIPlans%22%3Afalse%7D/id/azure-sentinel-solution-microsoftazurepurview/resourceGroupId//resourceGroupLocation//dontDiscardJourney//_provisioningContext/%7B%22initialValues%22%3A%7B%22subscriptionIds%22%3A%5B%22eb52cc0f-995f-4f31-bb29-9d18d72c983e%22%5D%2C%22resourceGroupNames%22%3A%5B%5D%2C%22locationNames%22%3A%5B%22southindia%22%2C%22centralus%22%2C%22eastus%22%2C%22centralindia%22%2C%22westus%22%5D%7D%2C%22telemetryId%22%3A%22ebdea1a9-1161-4a31-a1f8-5feecc700117%22%2C%22marketplaceItem%22%3A%7B%22categoryIds%22%3A%5B%5D%2C%22id%22%3A%22Microsoft.Portal%22%2C%22itemDisplayName%22%3A%22NoMarketplace%22%2C%22products%22%3A%5B%5D%2C%22version%22%3A%22%22%2C%22productsWithNoPricing%22%3A%5B%5D%2C%22publisherDisplayName%22%3A%22Microsoft.Portal%22%2C%22deploymentName%22%3A%22NoMarketplace%22%2C%22launchingContext%22%3A%7B%22telemetryId%22%3A%22ebdea1a9-1161-4a31-a1f8-5feecc700117%22%2C%22source%22%3A%5B%5D%2C%22galleryItemId%22%3A%22%22%7D%2C%22deploymentTemplateFileUris%22%3A%7B%7D%2C%22uiMetadata%22%3Anull%7D%7D",
  },
  {
    name: "datagenie",
    route_url: "https://gdatajinni.azurewebsites.net/",
  },
  {
    name: "hawkeye_dqc",
    route_url: "https://gmarshal.azurewebsites.net/",
  },
  {
    name: "hawkeye_ads",
    route_url: "https://gadmarshal.azurewebsites.net/",
  },
  {
    name: "elixir",
    route_url: "http://3.6.172.53:8000/",
  },
  {
    name: "semantico",
    route_url: "https://gsemantico.azurewebsites.net/",
  },
];
const DataServices = () => {
  const [urldata] = React.useState(urlItems);
  const LaunchURL = (name) => {
    const itemIndex = urldata.findIndex((curValue) => curValue.name === name);
    const url = urldata[itemIndex]["route_url"];
    window.open(url, "_blank");
  };
  return (
    <div id="page">
      <div>
        <h3 align="left" id="heading">
          Data Services
        </h3>
        <p align="left">
          A collection of small and independent tools to enhance, organize and
          amplify your data by improving its quality, availability and validity,
          making data more resilient and comprehensible
        </p>
        <hr />
        <div align="center" className="float-container">
          <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={sdg} id="icon" alt="sdg" />
              </div>
              <div>
                <b className="">Data Jinni</b>
              </div>
              <p id="info">
                Generate synthetic data to cater to various data needs
              </p>
              <br />
              <span>
                <Link onClick={() => LaunchURL("datagenie")} id="link">
                  Launch
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={logparser} id="icon" alt="anonym" />
              </div>
              <div>
                <b className="">Elixir</b>
              </div>
              <p id="info">Intelligent log parsing</p>
              <br />
              <br />
              <span>
                <Link onClick={() => LaunchURL("elixir")} id="link">
                  Launch
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={dqc} id="icon" alt="dqc" />
              </div>
              <div>
                <b className="">Marshal - Data Quality Check</b>
              </div>
              <p id="info">
                Ensure data quality at source by implementing various data
                quality rules
              </p>
              <br />
              <span>
                <Link onClick={() => LaunchURL("hawkeye_dqc")} id="link">
                  Launch
                </Link>
              </span>
            </div>
          </div>
        </div>
        <div align="center" className="float-container">
          <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={semantico_img} id="icon" alt="sdg" />
              </div>
              <div>
                <b className="">Semantico</b>
              </div>
              <p id="info">
                Create domain objects for
                databases of SQL Server, Sqlite and DynamoDB
              </p>
              <br />
              <span>
                <Link onClick={() => LaunchURL("semantico")} id="link">
                  Launch
                </Link>
              </span>
            </div>
          </div>
        </div>
        {/* <div align="center" className="float-container">
          <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={ads} id="icon" alt="ads" />
              </div>
              <div>
                <b className="">Marshal - Anomaly Detection Service</b>
              </div>
              <p id="info">
                Identify anomalies and outliers in data that don't adhere to a
                model of normal behaviour
              </p>
              <span>
                <Link onClick={() => LaunchURL('hawkeye_ads')} id="link">
                  Launch
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={catalog} id="icon" alt="catalog" />
              </div>
              <div>
                <b className="">Data Cataloging & Governance</b>
              </div>
              <p id="info">
                Manage, govern and catalog on-premise, multicloud or SaaS data
              </p>
              <br />
              <span>
                <Link onClick={() => LaunchURL('purview')} id="link">
                  Launch
                </Link>
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default DataServices;
