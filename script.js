const startBtn = document.getElementById('startBtn');
const status = document.getElementById('status');

let mediaRecorder;
let audioChunks = [];

// Request microphone access
startBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.onstart = () => {
            audioChunks = [];
            startBtn.disabled = true;
            stopBtn.disabled = false;
            status.textContent = 'Recording...';
        };

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.controls = true;
            document.body.appendChild(audio);

            startBtn.disabled = false;
            stopBtn.disabled = true;
            status.textContent = 'Recording stopped.';

            // Optionally: Upload the audio to a server
            // uploadAudio(audioBlob);
        };

        mediaRecorder.start();
    } catch (error) {
        console.error('Error accessing microphone:', error);
        status.textContent = 'Microphone access denied.';
    }
});

// Optional function to upload audio to a server
function uploadAudio(blob) {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');

    fetch('/upload', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => console.log('Upload successful:', data))
        .catch(error => console.error('Upload error:', error));
}



