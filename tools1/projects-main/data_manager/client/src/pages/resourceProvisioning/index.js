import * as React from "react";
import { AccountInfoDetails } from "./../../authUtility/AccountInfo";
import ResourceProvisioningDPAdmin from "./resource_provisioning_dpadmin";
import ResourceProvisioningLead from "./resource_provisioning_lead";
import ResourceProvisioningTeamMember from "./resource_provisioning_member";

const ResourceProvisioning = () => {
  const AccountInfo = AccountInfoDetails();
  const AccountRole = AccountInfo["AccountRole"];
  
  if (AccountRole === "DP Admin") {
    return <ResourceProvisioningDPAdmin />;
  } else if (AccountRole === "Data Engineer - Team Lead") {
    return <ResourceProvisioningLead />;
  } else {
    return (
      <ResourceProvisioningTeamMember AccountMail={AccountInfo.AccountMail} />
    );
  }
};
export default ResourceProvisioning;
