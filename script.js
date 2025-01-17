const startBtn = document.getElementById('startBtn');
const status = document.getElementById('status');

let mediaRecorder;
let audioChunks = [];

startBtn.addEventListener('click', async () => {
    console.log("Start button clicked");
    
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Check if permission was granted
        if (stream) {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.onstart = () => {
                audioChunks = [];
                startBtn.disabled = true;
                status.textContent = 'Recording...';

                // Set a timer to stop recording after 1 minute (60000 ms)
                setTimeout(() => {
                    mediaRecorder.stop();
                    status.textContent = 'Recording stopped automatically after 1 minute.';
                    console.log("Recording stopped automatically after 1 minute.");
                }, 60000);  // Stop after 1 minute (60000 milliseconds)
            };

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
                console.log("Audio data available");
            };

            mediaRecorder.onstop = () => {
                console.log("Recording stopped");

                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

                // Upload the audio file to Cloudinary
                uploadToCloudinary(audioBlob);

                startBtn.disabled = false;
            };

            mediaRecorder.start();
        }
    } catch (error) {
        console.error('Error accessing microphone:', error);
        status.textContent = 'Microphone access denied or failed.';
    }
});

function uploadToCloudinary(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('upload_preset', 'audio_upload'); // Replace with your preset
    formData.append('cloud_name', 'dfgdmrcsb'); // Replace with your Cloudinary cloud name

    fetch('https://api.cloudinary.com/v1_1/dfgdmrcsb/audio/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Upload successful:', data);
        alert('Audio uploaded successfully!');
    })
    .catch(error => {
        console.error('Error uploading audio:', error);
        alert('Audio upload failed.');
    });
}
