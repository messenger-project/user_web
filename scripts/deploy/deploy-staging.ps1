$ErrorActionPreference = "Stop"

$project = "C:\Dev\messenger\user_web"

Set-Location $project

git pull --ff-only
if ($LASTEXITCODE -ne 0) { throw "Git pull failed." }

yarn.cmd install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { throw "Dependency installation failed." }

yarn.cmd build
if ($LASTEXITCODE -ne 0) { throw "Build failed." }

nssm restart KimbtronMessengerDev
if ($LASTEXITCODE -ne 0) { throw "Service restart failed." }

Write-Host "Staging deployment completed."