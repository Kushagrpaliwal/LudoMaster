resource "aws_ecs_task_definition" "monitoring_task" {
  family                   = "monitoring-task"
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  # Removing task-level CPU/Memory constraints to allow flexible scheduling on small instance
  # cpu                      = 512 
  # memory                   = 512 

  volume {
    name      = "monitoring-config"
    host_path = "/etc/monitoring"
  }

  volume {
    name      = "grafana-datasources"
    host_path = "/etc/grafana-config/provisioning/datasources"
  }

  volume {
    name      = "docker-containers"
    host_path = "/var/lib/docker/containers"
  }

  volume {
    name      = "varlog"
    host_path = "/var/log"
  }

  container_definitions = jsonencode([
    {
      name      = "prometheus"
      image     = "prom/prometheus:latest"
      cpu       = 128
      memoryReservation = 128
      essential = true
      portMappings = [
        {
          containerPort = 9090
          hostPort      = 9090
        }
      ]
      mountPoints = [
        {
          sourceVolume  = "monitoring-config"
          containerPath = "/etc/prometheus" # Directory containing prometheus.yaml
          readOnly      = true
        }
      ]
      command = [
        "--config.file=/etc/prometheus/prometheus.yaml",
        "--storage.tsdb.path=/prometheus",
        "--web.console.libraries=/usr/share/prometheus/console_libraries",
        "--web.console.templates=/usr/share/prometheus/consoles"
      ]
    },
    {
      name      = "loki"
      image     = "grafana/loki:latest"
      cpu       = 128
      memoryReservation = 128
      essential = true
      portMappings = [
        {
          containerPort = 3100
          hostPort      = 3100
        }
      ]
      mountPoints = [
        {
          sourceVolume  = "monitoring-config"
          containerPath = "/etc/loki"
          readOnly      = true
        }
      ]
      command = [
        "-config.file=/etc/loki/loki-config.yaml"
      ]
    },
    {
      name      = "grafana"
      image     = "grafana/grafana:latest"
      cpu       = 128
      memoryReservation = 128
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3001
        }
      ]
      environment = [
        {
          name  = "GF_SECURITY_ADMIN_PASSWORD"
          value = "admin" # Change this!
        },
        {
            name = "GF_AUTH_ANONYMOUS_ENABLED"
            value = "true"
        }
      ]
      mountPoints = [
        {
          sourceVolume  = "grafana-datasources"
          containerPath = "/etc/grafana/provisioning/datasources"
          readOnly      = true
        }
      ]
      links = ["prometheus", "loki"]
    },
    {
      name      = "otel-collector"
      image     = "otel/opentelemetry-collector:latest"
      cpu       = 64
      memoryReservation = 64
      essential = true
      portMappings = [
        {
          containerPort = 8888
          hostPort      = 8888
        },
        {
          containerPort = 8889
          hostPort      = 8889
        },
        {
            containerPort = 4317
            hostPort      = 4317
        }
      ]
      mountPoints = [
          {
              sourceVolume = "monitoring-config"
              containerPath = "/etc/otel"
              readOnly = true
          }
      ]
      command = [
        "--config=/etc/otel/otel-collector-config.yaml"
      ]
      links = ["prometheus"]
    },
    {
        name = "promtail"
        image = "grafana/promtail:latest"
        cpu = 64
        memoryReservation = 64
        essential = true
        mountPoints = [
            {
                sourceVolume = "monitoring-config"
                containerPath = "/etc/promtail"
                readOnly = true
            },
            {
                sourceVolume = "docker-containers"
                containerPath = "/var/lib/docker/containers"
                readOnly = true
            },
            {
                sourceVolume = "varlog"
                containerPath = "/var/log"
                readOnly = true
            }
        ]
        command = [
            "-config.file=/etc/promtail/promtail-config.yaml"
        ]
        links = ["loki"]
    }
  ])
}

resource "aws_ecs_service" "monitoring_service" {
  name            = "monitoring-service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.monitoring_task.arn
  desired_count   = 1
  launch_type     = "EC2"
}
