# CareLog Asset Generator (PowerShell wrapper)
# Delegates to the Python script for actual PNG generation.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/generate-assets.ps1

Write-Host "Generating CareLog placeholder assets..." -ForegroundColor Cyan

$scriptDir = $PSScriptRoot
$pyScript = Join-Path $scriptDir "generate_icons.py"

if (-not (Test-Path $pyScript)) {
    Write-Host "Error: generate_icons.py not found at $pyScript" -ForegroundColor Red
    exit 1
}

python $pyScript

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDone! Assets are in assets/images/" -ForegroundColor Green
} else {
    Write-Host "`nAsset generation failed." -ForegroundColor Red
    exit 1
}
