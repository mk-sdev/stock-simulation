param(
  [int]$port = 3000
)

$env:PORT = $port
docker compose up -d --scale app=3
