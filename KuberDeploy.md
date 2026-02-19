Terraform → Creates EKS cluster + Node Group
        ↓
GitHub Actions → Builds Docker image
        ↓
Push to ECR
        ↓
kubectl apply
        ↓
EKS → Pods running
        ↓
Service (LoadBalancer)
        ↓
Public URL
