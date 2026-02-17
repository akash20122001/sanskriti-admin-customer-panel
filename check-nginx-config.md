# Check Nginx Configuration

## Run these commands on your VPS:

```bash
# Check the full Nginx configuration
sudo nginx -T | grep -A 10 "server_name.*sanskriti"

# Or check the sites-available config files
ls -la /etc/nginx/sites-available/

# Show the frontend config
cat /etc/nginx/sites-available/sanskriti-frontend

# Check what root directory is configured
sudo nginx -T | grep "root.*sanskriti"
```

## If Nginx root is wrong, update it:

```bash
# Edit the nginx frontend config
sudo nano /etc/nginx/sites-available/sanskriti-frontend

# Look for the "root" line and make sure it points to:
# root /root/sanskriti-admin-customer-panel/frontend/dist;

# After editing, test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Quick fix command:

```bash
# Show current nginx config for frontend
echo "=== Current Nginx Frontend Config ==="
cat /etc/nginx/sites-available/sanskriti-frontend

echo -e "\n=== Checking root path ==="
sudo nginx -T 2>/dev/null | grep -i "root" | grep -v "#"
```
