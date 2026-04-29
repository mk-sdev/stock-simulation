param(
  [int]$port = 3000
)

Write-Host "Starting application on port $port..."

$env:PORT = $port
docker compose up -d --scale app=3

Write-Host "Application is running at http://localhost:$port"