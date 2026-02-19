## Without Docker 

1. Need to set the access id and secret key of the aws user in the github 
    settings -> secrets and variables -> secrets -> Repository secrets

2. Installing AWS cli , creating an ssh key pair , uploading it to aws , 
    setting Repository secrets in github for private ssh key

    ssh-keygen -t rsa -b 4096 -f my-key

    brew install awscli

    aws configure 

    aws ec2 import-key-pair --key-name my-key --public-key-material fileb://my-key.pub

3. Installing and setting up Terraform 

    brew install terraform

4. Creating Terraform files inside the project

    mkdir terraform

    Created 4 files:
    - terraform/main.tf (AWS provider, security group, EC2 instance with user_data)
    - terraform/variables.tf (region variable)
    - terraform/terraform.tfvars (region = "ap-south-1")
    - terraform/outputs.tf (public_ip output)

    Key points:
    - Used existing AWS key pair "ludo" (key_name = "ludo") instead of creating a new one
    - Used t3.micro (NOT t2.micro — t2.micro is not free-tier eligible in ap-south-1)
    - Security group opens ports: 22 (SSH), 80 (HTTP), 3000 (App)
    - user_data script auto-installs: nginx, git, Node.js 18, pm2
    - nginx configured as reverse proxy: port 80 → localhost:3000

5. Running Terraform to provision EC2

    cd terraform
    terraform init       # Downloads AWS provider
    terraform plan       # Preview resources to create
    terraform apply      # Creates security group + EC2 instance

6. Associating an Elastic IP (AWS Console)

    AWS Console → EC2 → Elastic IPs → Allocate → Associate to EC2 instance
    This gives a static IP: 15.206.221.137

7. SSH into the server

    Fix .pem permissions first:
    chmod 600 ludo.pem

    If host key error (IP was reassigned):
    ssh-keygen -R 15.206.221.137

    SSH command:
    ssh -i ludo.pem -o StrictHostKeyChecking=no ubuntu@15.206.221.137

8. First-time app setup on the server

    git clone https://github.com/Kushagrpaliwal/LudoMaster.git ~/LudoMaster
    cd ~/LudoMaster
    npm install
    pm2 start npm --name "ludomaster" -- run dev

    Important: Only ONE pm2 instance. Multiple instances cause port 3000 
    conflict (second instance goes to 3001 but nginx only proxies 3000 → 502 error)

9. Setting up GitHub Actions CI/CD (.github/workflows/deploy.yml)

    Uses appleboy/ssh-action@v1.0.3 (NOT raw SSH heredoc — that breaks YAML parsing)

    What it does on every push to main:
    - SSHs into EC2
    - Pulls latest code
    - Installs dependencies  
    - Deletes old pm2 process and starts fresh

    Required GitHub Repository Secrets (Settings → Secrets → Actions):
    - EC2_SSH_KEY = contents of ludo.pem file
    - EC2_HOST = 15.206.221.137

10. To destroy infrastructure when done

    cd terraform
    terraform destroy

