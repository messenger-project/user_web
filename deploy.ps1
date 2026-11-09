$ErrorActionPreference = "Stop"

$projectPath = "C:\Services\kimbtron\messenger\user_web"

Set-Location $projectPath

# Build the Next.js application
yarn build

if ($LASTEXITCODE -ne 0) {
    throw "Next.js build failed."
}

# Prepare standalone static assets
$staticPath = Join-Path $projectPath ".next\standalone\.next\static"

if (Test-Path $staticPath) {
    Remove-Item $staticPath -Recurse -Force
}

Copy-Item `
    (Join-Path $projectPath ".next\static") `
    $staticPath `
    -Recurse -Force

# Copy public assets
$publicPath = Join-Path $projectPath "public"

if (Test-Path $publicPath) {
    Copy-Item `
        $publicPath `
        (Join-Path $projectPath ".next\standalone\public") `
        -Recurse -Force
}

# Copy environment configuration
Copy-Item `
    (Join-Path $projectPath ".env.local") `
    (Join-Path $projectPath ".next\standalone\.env.local") `
    -Force

Write-Host "Production build and standalone assets are ready."