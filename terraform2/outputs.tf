output "elastic_ip" {
  value = aws_eip.ecs_eip.public_ip
}

output "ecr_url" {
  value = aws_ecr_repository.repo.repository_url
}
