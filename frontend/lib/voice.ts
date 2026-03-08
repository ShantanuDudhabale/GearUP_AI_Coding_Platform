/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

export class VoiceRecognition {
    recognition: any; // Keeping as any because SpeechRecognition types are not standard
    isListening: boolean = false;

    constructor(onResult: (text: string) => void, onEnd?: () => void) {
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.recognition.onresult = (event: any) => {
                    const text = event.results[0][0].transcript;
                    onResult(text);
                };

                this.recognition.onend = () => {
                    this.isListening = false;
                    if (onEnd) onEnd();
                };

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.recognition.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    this.isListening = false;
                    if (onEnd) onEnd();
                };
            } else {
                console.warn('Speech Recognition API not supported in this browser.');
            }
        }
    }

    start() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
                this.isListening = true;
            } catch (e) {
                console.error('Failed to start recognition', e);
            }
        }
    }

    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }
}
