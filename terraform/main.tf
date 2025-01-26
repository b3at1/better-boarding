terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~> 4.0"
    }
    vercel = {
      source = "vercel/vercel"
      version = "~> 0.16"
    }
  }
}

provider "google" {
  project = var.google_project_id
  region  = var.region
}

provider "vercel" {
  api_token = var.vercel_api_token
}

# Vercel Configuration for Frontend
resource "vercel_project" "frontend" {
  name      = "better-boarding-frontend"
  framework = "nextjs"
  git_repository = {
    type = "github"
    repo = "b3at1/better-boarding"
  }
}

# Google Cloud Run Configuration for Worker (with Gen integrated)
resource "google_cloud_run_service" "worker" {
  name     = "worker-service"
  location = var.region

  template {
    spec {
      containers {
        image = var.worker_image_url  # Image containing both worker.py and gen.py
        ports {
          container_port = 8080
        }
      }
    }
  }

  traffic {
    latest_revision = true
    percent         = 100
  }
}

# Optional: IAM to allow unauthenticated access to worker service (if needed)
resource "google_cloud_run_service_iam_member" "worker_invoker" {
  service = google_cloud_run_service.worker.name
  location = var.region
  role    = "roles/run.invoker"
  member  = "allUsers"
}

# Variables
variable "google_project_id" {
  type        = string
  description = "The Google Cloud project ID"
}

variable "region" {
  type        = string
  description = "The region for Cloud Run services"
  default     = "us-central1"
}

variable "vercel_api_token" {
  type        = string
  description = "API token for Vercel"
}

variable "worker_image_url" {
  type        = string
  description = "The URL of the worker container image for Cloud Run"
}