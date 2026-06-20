#Resource Group Details#

variable "resource_group_name" {
  default       = "graviton_kube"
  description   = "Prefix of the resource group name that's combined with a random ID so name is unique in your Azure subscription."
}

variable "resource_group_location" {
  default = "eastus"
  description   = "Location of the resource group."
}

#Kubernetes Cluster Details#
variable "kubernetes_cluster_name" {
  default       = "graviton_aks"
  description   = "Prefix of the resource group name that's combined with a random ID so name is unique in your Azure subscription."
}

variable "cluster_version" {
    default = "1.22.6"
}

variable "node_count" {
    default = 1
}

variable "agent_vm_size" {
    default = "Standard_DS2_v2"
}

#Azure Account Details#
variable "ARM_CLIENT_ID" {
  default = "762321cf-c192-484a-82ff-4aa25a69fe36"
  description   = "Client ID."
}

variable "ARM_CLIENT_SECRET" {
  default = "Q.2mIB_~9Ryw63IiIJgWz_.YjYJhEa2-3r"
  description   = "Secret ID"
}

variable "ARM_Tenant_ID" {
  default = "d0c9f92c-e2ae-4903-b31b-25ea806607ca"
  description   = "Tenant ID"
}

variable "ARM_Subscription_ID" {
  default = "eb52cc0f-995f-4f31-bb29-9d18d72c983e"
  description   = "Subscription ID"
}

