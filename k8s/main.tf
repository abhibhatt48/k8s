provider "google" {
  credentials = file("./key.json")
  project     = "abhishek-4899"
  region      = "us-central1"
}

resource "google_container_cluster" "my_cluster" {
  name               = "cluster-2"
  location           = "us-central1-c"
  initial_node_count = 1
  node_config {
    machine_type = "e2-micro"
    disk_size_gb = 10
  }
}