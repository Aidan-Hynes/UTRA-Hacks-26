$ErrorActionPreference = "Stop"
$DROPLET_IP = "138.197.170.185"
$REMOTE_USER = "root"
$LOCAL_FILE = "demo_result.webm"

Write-Host "🎥 Retrieving Demo Result from Droplet..." -ForegroundColor Cyan

# Download the file from the fixed demo path (YOLO defaults to runs/detect/...)
scp "$REMOTE_USER@${DROPLET_IP}:~/Model-Training/runs/detect/inference_demo/demo_run/*.avi" .\$LOCAL_FILE

if (Test-Path .\$LOCAL_FILE) {
    Write-Host "✅ Download Complete! Playing video..." -ForegroundColor Green
    # Open the file with the default video player
    Invoke-Item .\$LOCAL_FILE
} else {
    Write-Error "Could not find the video. Did you run 'python predict.py' on the server first?"
}
