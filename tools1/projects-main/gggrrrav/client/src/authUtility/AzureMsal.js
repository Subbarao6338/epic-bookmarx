import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "../msalConfig";
import React, { }  from 'react';

const msalInstance = new PublicClientApplication(msalConfig);

function AzureMsalProvider(props) {
  return <MsalProvider instance={msalInstance}>{props.children}</MsalProvider>;
}

export default AzureMsalProvider;
