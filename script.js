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
            stopBtn.disabled = false;
            status.textContent = 'Recording...';
        };

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = audioUrl;
            downloadLink.download = 'recorded-audio.wav';
            downloadLink.textContent = 'Download Audio';
            document.body.appendChild(downloadLink);

            startBtn.disabled = false;
        };

        mediaRecorder.start();
    } catch (error) {
        console.error('Error accessing microphone:', error);
        status.textContent = 'Microphone access denied.';
    }
});

stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
});

