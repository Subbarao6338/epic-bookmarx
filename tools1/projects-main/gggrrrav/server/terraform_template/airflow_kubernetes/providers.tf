provider "azurerm" {  
  client_id = "${var.ARM_CLIENT_ID}"
  client_secret = "${var.ARM_CLIENT_SECRET}"
  tenant_id = "${var.ARM_Tenant_ID}"
  subscription_id = "${var.ARM_Subscription_ID}"
  features {}
}
provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
    config_context = "cdp_airflow_aks"
  }
}
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.97.0"
    }
  }
}