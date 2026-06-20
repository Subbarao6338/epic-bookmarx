variable "prefix" {
  description = "The prefix which should be used for all resources in this project"
  default = "graviton"
}

variable "resource_group_name" {
  default       = "graviton_kubeairflow"
  description   = "Prefix of the resource group name that's combined with a random ID so name is unique in your Azure subscription."
}

variable "resource_group_location" {
  description = "The Azure Region in which all resources in this example should be created."
  default = "East US"
}


#Kubernetes Cluster Details#
variable "kubernetes_cluster_name" {
  default       = "kubeairflow_aks"
  description   = "Prefix of the resource group name that's combined with a random ID so name is unique in your Azure subscription."
}

variable "cluster_version" {
    default = "1.21.9"
}

variable "node_count" {
    default = 1
}

variable "agent_vm_size" {
    default = "Standard_D4s_v3"
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






#Network 
variable "virtual_network_name" {
  description = "Virtual network name"
  default     = "prathameshwar.singh-de-gr-aks-vpc"
}
variable "virtual_network_address_prefix" {
  description = "Containers DNS server IP address."
  default     = "15.0.0.0/8"
}
variable "aks_subnet_name_1" {
  description = "AKS Subnet Name."
  default     = "gr-aks-subnet"
}
variable "aks_subnet_address_prefix_1" {
  description = "Containers DNS server IP address."
  default     = "15.0.0.0/16"
}
variable "tags" {
  type = map(string)
  default = {
    source = "terraform"
  }
}

variable "aks_dns_service_ip" {
  description = "Containers DNS server IP address."
  default     = "10.0.0.10"
}

variable "aks_docker_bridge_cidr" {
  description = "A CIDR notation IP for Docker bridge."
  default     = "172.17.0.1/16"
}
variable "aks_service_cidr" {
  description = "A CIDR notation IP range from which to assign service cluster IPs."
  default     = "10.0.0.0/16"
}

variable "aks_enable_rbac" {
  description = "Enable RBAC on the AKS cluster. Defaults to false."
  default     = "false"
}
