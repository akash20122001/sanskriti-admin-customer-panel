# Find Nginx Configuration

## Run these commands to find the actual nginx config:

```bash
# List all nginx config files
echo "=== All nginx site configs ==="
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Check the main nginx config
echo -e "\n=== Main nginx config includes ==="
cat /etc/nginx/nginx.conf | grep -v "#" | grep -E "include|http"

# Find any config mentioning sanskriti
echo -e "\n=== Finding sanskriti configs ==="
find /etc/nginx -name "*sanskriti*" 2>/dev/null

# Check all server blocks
echo -e "\n=== All server blocks ==="
sudo nginx -T 2>/dev/null | grep -E "server_name|root" | head -20

# Or check what's actually running
echo -e "\n=== Active nginx configs ==="
sudo nginx -T 2>&1 | grep -A 5 "server {" | head -50
```
