#Create Resource Group#
resource "azurerm_resource_group" "resourceGroup" {
  name     = "${var.resource_group_name}_rg"
  location = var.resource_group_location
}

#Create Kubernetes Clusters#
resource "azurerm_kubernetes_cluster" "kubeCluster" {
  name                = "${var.kubernetes_cluster_name}"
  location            = azurerm_resource_group.resourceGroup.location
  resource_group_name = azurerm_resource_group.resourceGroup.name
  dns_prefix          = "graviton-k8s-dns"
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