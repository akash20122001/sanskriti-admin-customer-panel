# Deploy to Hostinger VPS
# This script will SSH into the VPS and update the application

Write-Host "Starting deployment to VPS..." -ForegroundColor Green

# VPS Configuration (update these with your actual values)
$VPS_USER = "sanskriti"
$VPS_IP = Read-Host "Enter VPS IP address"
$PROJECT_PATH = "~/projects/sanskriti-admin-customer-panel"
$BRANCH = "qa"  # Deploying from qa branch since it has the latest user info changes

Write-Host "Connecting to VPS and deploying..." -ForegroundColor Yellow

# SSH command to deploy - using single line with semicolons
$sshCommand = "cd $PROJECT_PATH; echo 'Pulling latest code from $BRANCH branch...'; git fetch origin; git checkout $BRANCH; git pull origin $BRANCH; echo 'Building backend...'; cd backend; npm install; npx prisma generate; npx prisma migrate deploy; npm run build; echo 'Restarting backend with PM2...'; pm2 restart sanskriti-backend; echo 'Building frontend...'; cd ../frontend; npm install; npm run build; echo 'Reloading Nginx...'; sudo systemctl reload nginx; echo 'Deployment completed!'; pm2 status; pm2 logs sanskriti-backend --lines 20"

Write-Host "Executing deployment commands on VPS..." -ForegroundColor Cyan
ssh "$VPS_USER@$VPS_IP" $sshCommand

Write-Host "Deployment script completed!" -ForegroundColor Green
Write-Host "Visit your website to verify the changes." -ForegroundColor Yellow
