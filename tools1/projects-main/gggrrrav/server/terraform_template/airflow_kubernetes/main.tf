resource "azurerm_resource_group" "airflow-rg" {
  name     = "${var.resource_group_name}_rg"
  location = "${var.resource_group_location}"
}


#Create Kubernetes Clusters#
resource "azurerm_kubernetes_cluster" "airflow-aks" {
  name                = "${var.resource_group_name}_aks"
  location            = "${azurerm_resource_group.airflow-rg.location}"
  resource_group_name =  "${azurerm_resource_group.airflow-rg.name}"
  dns_prefix          = "airflow-aks"
  kubernetes_version  = "${var.cluster_version}"

  default_node_pool {
    name       = "default"
    node_count = "${var.node_count}"
    vm_size    = "${var.agent_vm_size}"
  }

  identity {
    type = "SystemAssigned"
  }
}

