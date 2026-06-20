import { useMsal } from "@azure/msal-react";
import { config } from "./config";

export function AccountInfoDetails() {
  const { accounts } = useMsal();
  // ### FOR SSO LOGIN - DEPLOYMENT
  if (config["work_env"] === "DEPLOYMENT") {
    const AccountInfo = {
      AccountName: accounts[0] && accounts[0].name,
      AccountRole: localStorage.getItem("role_name"),
      AccountMail: accounts[0] && accounts[0].username,
      Account_LocalID: accounts[0] && accounts[0].localAccountId,
      Account_HomeID: accounts[0] && accounts[0].homeAccountId,
      Account_TenantID: accounts[0] && accounts[0].tenantId,
      Account_ShortName:
        typeof (accounts[0] && accounts[0].name) === "undefined"
          ? ""
          : (accounts[0] && accounts[0].name).charAt(0).toUpperCase(),
    };
    return AccountInfo;
  } else {
    const AccountInfo = {
      AccountName: localStorage.getItem("user_name"),
      AccountRole: localStorage.getItem("role_name"),
      AccountMail: "hcl_ers@hcl.com",
      Account_LocalID: "9cc7517b-d7b4-43c4-a33a-82e4c1b470a5",
      Account_HomeID:
        "1deb9ad7-018f-4eae-a5e6-57b4fd73b215.189de737-c93a-4f5a-8b68-6f4ca9941912",
      Account_TenantID: "d0c9f92c-e2ae-4903-b31b-25ea806607ca",
      Account_ShortName: localStorage.getItem("user_name").charAt(0),
    };
    return AccountInfo;
  }
}
