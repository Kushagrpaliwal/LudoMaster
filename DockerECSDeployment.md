## With Docker + ECS (EC2 Launch Type)

This is the containerized deployment using Docker, ECR, and ECS with EC2 instances.
The basic EC2 deployment (without Docker) remains untouched in `terraform/` and `.github/workflows/deploy.yml`.

---

### Architecture Overview

```
GitHub Push → GitHub Actions → Build Docker Image → Push to ECR → ECS pulls new image
                                                                         ↓
User → ALB (port 80) → ECS Service → EC2 Instance → Docker Container (port 3000)
```

**Components:**
- **ECR** — stores Docker images
- **ECS Cluster** — manages container orchestration
- **EC2 Instances** — run the containers (ECS-optimized AMI, managed by ASG)
- **ALB** — load balances traffic to containers on port 3000
- **CloudWatch** — stores container logs

---

### Prerequisites

1. AWS CLI installed and configured (`aws configure`)
2. Terraform installed (`brew install terraform`)
3. Docker installed (`brew install --cask docker`)
4. Existing AWS key pair named `ludo` (same as basic deployment)
5. GitHub Repository Secrets already set:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

---

### Step-by-Step Setup

#### 1. Review the Dockerfile

The project now includes a multi-stage `Dockerfile`:
- **Stage 1 (deps):** Installs production dependencies only
- **Stage 2 (builder):** Installs all deps + runs `npm run build`
- **Stage 3 (runner):** Minimal image with just the standalone build output

> Note: `next.config.mjs` now has `output: 'standalone'` which is required for Docker.
> This doesn't affect `npm run dev` at all.

#### 2. Test Docker locally (optional)

```bash
docker build -t ludomaster .
docker run -p 3000:3000 ludomaster
# Visit http://localhost:3000
```

#### 3. Provision ECS Infrastructure with Terraform

```bash
cd terraform-ecs
terraform init       # Download providers
terraform plan       # Preview all resources
terraform apply      # Create everything (VPC, ALB, ECR, ECS cluster, etc.)
```

This creates:
- VPC with 2 public subnets across 2 AZs
- Internet Gateway + route tables
- Security groups (ALB allows port 80, ECS allows port 3000 from ALB only)
- Application Load Balancer + target group
- ECR repository (`ludomaster`)
- ECS cluster (`ludomaster-cluster`)
- EC2 Auto Scaling Group (1-2 instances, t3.micro, ECS-optimized AMI)
- ECS Task Definition (512 CPU, 512MB memory)
- ECS Service (`ludomaster-service`)
- CloudWatch log group (`/ecs/ludomaster`)

#### 4. Push the first Docker image to ECR

After `terraform apply`, get the ECR URL from the output:

```bash
# Login to ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

# Build and push
docker build -t <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/ludomaster:latest .
docker push <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/ludomaster:latest

# Force ECS to pick up the new image
aws ecs update-service --cluster ludomaster-cluster --service ludomaster-service --force-new-deployment
```

#### 5. Access the app

Get the ALB DNS name from Terraform output:
```bash
cd terraform-ecs
terraform output alb_dns_name
```
Visit `http://<ALB_DNS_NAME>` in your browser.

#### 6. CI/CD — Automatic deployments

The workflow `.github/workflows/deploy-ecs.yml` triggers on every push to `main`:
1. Builds the Docker image
2. Pushes to ECR (tagged with commit SHA + `latest`)
3. Forces a new ECS deployment
4. Waits for stability

> **Note:** Both workflows (`deploy.yml` and `deploy-ecs.yml`) trigger on push to `main`.
> To use only one at a time, you can disable the other from GitHub Actions settings,
> or change the trigger branch.

---

### Required GitHub Repository Secrets

| Secret | Value | Notes |
|--------|-------|-------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key | Same IAM user as basic deployment |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key | Same IAM user as basic deployment |
| `EC2_SSH_KEY` | Contents of `ludo.pem` | Only needed for basic deployment |
| `EC2_HOST` | `15.206.221.137` | Only needed for basic deployment |

---

### Useful Commands

```bash
# View ECS service status
aws ecs describe-services --cluster ludomaster-cluster --services ludomaster-service --region ap-south-1

# View running tasks
aws ecs list-tasks --cluster ludomaster-cluster --region ap-south-1

# View container logs
aws logs tail /ecs/ludomaster --follow --region ap-south-1

# SSH into EC2 instance (for debugging)
# Get instance IP from AWS Console → EC2 → Instances
ssh -i ludo.pem ec2-user@<INSTANCE_IP>

# Force redeploy without code change
aws ecs update-service --cluster ludomaster-cluster --service ludomaster-service --force-new-deployment

# Scale up/down
aws ecs update-service --cluster ludomaster-cluster --service ludomaster-service --desired-count 2
```

---

### Destroy ECS Infrastructure

```bash
cd terraform-ecs
terraform destroy
```

> This will NOT affect the basic EC2 deployment in `terraform/`. They are completely independent.

---

### File Structure (new files)

```
LudoMaster/
├── Dockerfile                              # Multi-stage Docker build
├── .dockerignore                           # Files excluded from Docker build
├── terraform-ecs/                          # ECS Terraform (separate from terraform/)
│   ├── provider.tf                         # AWS provider config
│   ├── main.tf                             # VPC, ALB, ECR, ECS, ASG, IAM
│   ├── variables.tf                        # Configurable variables
│   ├── terraform.tfvars                    # Variable values
│   └── outputs.tf                          # ALB DNS, ECR URL, cluster info
├── .github/workflows/
│   ├── deploy.yml                          # ← existing (basic EC2 deployment)
│   └── deploy-ecs.yml                      # ← new (Docker/ECS deployment)
└── DockerECSDeployment.md                  # This file
```
