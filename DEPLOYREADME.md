## Without Docker 

1. Need to set the access id and secret key of the aws user in the github 
    settings -> secrets and variables -> secrets -> Repository secrets

2. Installing AWS cli , creating an ssh key pair , uploading it to aws , 
    setting Repository secrets in github for private ssh key

    ssh-keygen -t rsa -b 4096 -f my-key

    brew install awscli

    aws configure 

    aws ec2 import-key-pair --key-name my-key --public-key-material fileb://my-key.pub

3. Installing and setting up Teraform and Ansible 
 
    creating folder inside the project 

    mkdir terraform
    mkdir ansible
    mkdir -p .github/workflows

    Need to create 2 files in Terraform main.tf and outputs.tf

    


    




