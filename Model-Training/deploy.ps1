$ErrorActionPreference = "Stop"
$DROPLET_IP = "138.197.170.185"
$REMOTE_USER = "root"

Write-Host "Deploying to $DROPLET_IP..."

# Copy Files
scp -r . "$REMOTE_USER@${DROPLET_IP}:~/Model-Training"

# Copy Env
scp ../Web-App/.env.local "$REMOTE_USER@${DROPLET_IP}:~/Model-Training/.env"

Write-Host "Done. Run these commands on the server:"
Write-Host "ssh $REMOTE_USER@$DROPLET_IP"
Write-Host "cd Model-Training"
Write-Host "python3 -m venv venv"
Write-Host "source venv/bin/activate"
Write-Host "pip install -r requirements.txt"
Write-Host "python train_pipeline.py"
