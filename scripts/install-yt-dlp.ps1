Write-Host "Checking for yt-dlp..."

if (-not (Get-Command yt-dlp -ErrorAction SilentlyContinue)) {
    Write-Host "yt-dlp not found. Installing..."

    if (Get-Command scoop -ErrorAction SilentlyContinue) {
        Write-Host "Installing yt-dlp via Scoop..."
        scoop install yt-dlp
    }
    elseif (Get-Command choco -ErrorAction SilentlyContinue) {
        Write-Host "Installing yt-dlp via Chocolatey..."
        choco install yt-dlp -y
    }
    else {
        Write-Host "No Scoop or Chocolatey found."
        Write-Host "Please install yt-dlp manually:"
        Write-Host "https://github.com/yt-dlp/yt-dlp#installation"
        exit 1
    }
} else {
    Write-Host "yt-dlp is already installed."
}
