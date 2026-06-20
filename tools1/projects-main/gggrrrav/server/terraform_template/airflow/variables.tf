variable "resource_group_name" {
  default = "graviton_airflow_rg"
}

variable "resource_group_location" {
  default = "eastus"
  description   = "Location of the resource group."
}

variable "airflow_asp_name" {
  default = "graviton_airflow_asp"
}

variable "airflow_as_name" {
  default = "graviton-airflow"
}

variable "airflow_PSQLserver_name" {
  default = "graviton-airflow-server"
}

variable "airflow_PSQLserver_admin" {
  default = "gravitonadmin"
}

variable "airflow_PSQLserver_password" {
  default = "Admin@123"
}

variable "airflow_PSQLdb_name" {
  default = "graviton_airflow_db"
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
