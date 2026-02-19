# First Create Resources via Terraform

# Then Create Secrets in Github

# Then Push Code to Github

# Then Run Github Actions

What github actions does -: 

    Spins up a fresh Ubuntu VM (GitHub runner)

    Checks out your code

    Builds Docker image on THAT runner

    Logs into AWS using your GitHub secrets

    Logs into ECR

    Pushes image to ECR

    Tell ECS to redeploy

# After this what happened in ECS

    You tell ECS: "Run this task definition"
    ECS checks: Do I have EC2 capacity?
    Yes.
    ECS tells ECS Agent on EC2:
        "Pull this image from ECR"
    EC2 pulls image.
    Docker runs container.


    Git Push
        ↓
    GitHub Actions
        ↓
    Docker Build (linux/amd64)
        ↓
    Push to ECR
        ↓
    ECS Force Deploy
        ↓
    EC2 Pulls Image
        ↓
    App Live
        