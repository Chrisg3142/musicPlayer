#!/bin/bash

echo "Checking for yt-dlp..."

if ! command -v yt-dlp &> /dev/null
then
    echo "yt-dlp not found. Installing..."
    if command -v brew &> /dev/null
    then
        echo "Installing yt-dlp via Homebrew..."
        brew install yt-dlp
    elif command -v pip3 &> /dev/null
    then
        echo "Installing yt-dlp via pip3..."
        pip3 install yt-dlp
    else
        echo "No Homebrew or pip3 found."
        echo "Please install yt-dlp manually:"
        echo "https://github.com/yt-dlp/yt-dlp#installation"
        exit 1
    fi
else
    echo "yt-dlp is already installed."
fi
