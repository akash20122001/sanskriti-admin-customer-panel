# Quick GitHub Setup Script
# Run this to push your code to GitHub before Railway deployment

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Please create a GitHub repository first:" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/new" -ForegroundColor White
Write-Host "2. Create a new repository (private or public)" -ForegroundColor White
Write-Host "3. Don't initialize with README" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ No repository URL provided. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .

Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m "Backend ready for Railway deployment"

Write-Host "Adding remote..." -ForegroundColor Yellow
git remote remove origin 2>$null  # Remove if exists
git remote add origin $repoUrl

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://railway.app" -ForegroundColor White
    Write-Host "2. Sign in with GitHub" -ForegroundColor White
    Write-Host "3. Create new project from your repository" -ForegroundColor White
    Write-Host "4. Follow the Railway deployment guide" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Please check your repository URL and try again" -ForegroundColor Red
    Write-Host ""
}

pause
