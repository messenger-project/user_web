$ErrorActionPreference = "Stop"

$project = "C:\Services\kimbtron\messenger\user_web"
$root = "C:\Services\kimbtron\messenger"
$service = "KimbtronMessenger"

Set-Location $project

git pull --ff-only
if ($LASTEXITCODE -ne 0) { throw "Git pull failed." }

$commit = (git rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0) { throw "Git revision failed." }

$workspace = Join-Path $root "build-temp\deploy-$commit"
$release = Join-Path $root "releases\$commit"

if (-not (Test-Path $release)) {
    if (Test-Path $workspace) {
        throw "Build directory already exists: $workspace"
    }

    git clone --local --no-hardlinks $project $workspace
    if ($LASTEXITCODE -ne 0) { throw "Git clone failed." }

    Copy-Item "$project\.env.local" "$workspace\.env.local"

    Push-Location $workspace
    try {
        yarn.cmd install --frozen-lockfile
        if ($LASTEXITCODE -ne 0) { throw "Install failed." }

        $env:NODE_ENV = "production"
        yarn.cmd build
        if ($LASTEXITCODE -ne 0) { throw "Build failed." }
    }
    finally {
        Pop-Location
    }

    $standalone = Join-Path $workspace ".next\standalone"

    if (-not (Test-Path "$standalone\server.js")) {
        throw "Standalone server.js is missing."
    }

    New-Item -ItemType Directory -Path "$standalone\.next\static" -Force | Out-Null
    Copy-Item "$workspace\.next\static\*" "$standalone\.next\static" -Recurse -Force

    if (Test-Path "$workspace\public") {
        Copy-Item "$workspace\public" "$standalone\public" -Recurse -Force
    }

    Copy-Item $standalone $release -Recurse
}

if (-not (Test-Path "$release\server.js")) {
    throw "Release is invalid: $release"
}

$current = (nssm get $service AppDirectory).Trim()

if ($current -eq $release) {
    Write-Host "Production is already running this release."
    exit 0
}

nssm set $service AppDirectory $release
if ($LASTEXITCODE -ne 0) { throw "NSSM directory update failed." }

nssm set $service AppParameters "$release\server.js"
if ($LASTEXITCODE -ne 0) { throw "NSSM parameters update failed." }

nssm restart $service
if ($LASTEXITCODE -ne 0) { throw "Service restart failed." }

Start-Sleep -Seconds 3

$response = Invoke-WebRequest `
    -Uri "http://127.0.0.1:4041/c/me" `
    -Method Head `
    -TimeoutSec 10 `
    -UseBasicParsing

if ($response.StatusCode -ne 200) {
    throw "Production health check failed."
}

Write-Host "Production deployment completed: $commit"