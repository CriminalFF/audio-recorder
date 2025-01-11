const startBtn = document.getElementById('startBtn');
const status = document.getElementById('status');

let mediaRecorder;
let audioChunks = [];

startBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.onstart = () => {
            audioChunks = [];
            startBtn.disabled = true;
            status.textContent = 'Recording...';

            // Automatically stop recording after 10 hours (10 hours = 36000000 milliseconds)
            setTimeout(() => {
                mediaRecorder.stop();
            }, 30000);  // Stop after 10 hours
        };

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.controls = true;
            document.body.appendChild(audio);

            // Upload the audio to Cloudinary
            try {
                const formData = new FormData();
                formData.append('file', audioBlob);
                formData.append('upload_preset', 'dfgdmrcsb');  // Replace with your Cloudinary upload preset
                formData.append('cloud_name', 'audio-recorder');  // Replace with your Cloudinary cloud name

                const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/audio/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.secure_url) {
                    status.textContent = 'Recording uploaded successfully!';
                    console.log('Audio URL:', data.secure_url);
                } else {
                    status.textContent = 'Error uploading audio.';
                }
            } catch (error) {
                console.error('Error uploading audio:', error);
                status.textContent = 'Error uploading audio.';
            }

            startBtn.disabled = false;
            status.textContent = 'Recording stopped and uploaded.';
        };

        mediaRecorder.start();
    } catch (error) {
        console.error('Error accessing microphone:', error);
        status.textContent = 'Microphone access denied.';
    }
});
