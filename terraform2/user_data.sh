#!/bin/bash
echo ECS_CLUSTER=ludo-cluster >> /etc/ecs/ecs.config

# Create monitoring directory
mkdir -p /etc/monitoring

# Write config files
cat <<EOF > /etc/monitoring/prometheus.yaml
${prometheus_config}
EOF

cat <<EOF > /etc/monitoring/loki-config.yaml
${loki_config}
EOF

cat <<EOF > /etc/monitoring/otel-collector-config.yaml
${otel_config}
EOF

mkdir -p /etc/grafana-config/provisioning/datasources
cat <<EOF > /etc/grafana-config/provisioning/datasources/datasources.yaml
${grafana_datasources}
EOF

cat <<EOF > /etc/monitoring/promtail-config.yaml
${promtail_config}
EOF

# Ensure permissions
chmod -R 755 /etc/monitoring
