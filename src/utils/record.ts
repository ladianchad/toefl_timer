export const startRecord = (recorder: MediaRecorder | null) => {
    if (recorder) {
        window.audioChunk = [];
        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                window.audioChunk.push(event.data)// 한 번만 저장
            }
        }
        recorder.onstop = () => {
            if (window.audioChunk.length === 0) {
                console.error("No audio data was recorded.");
                return;
            }

            const audioBlob = new Blob(window.audioChunk, {type: "audio/wav"});
            const url = URL.createObjectURL(audioBlob);
            document.dispatchEvent(new RecordEndEvent(url))
        }
        recorder.start()
    }
}

export const initializeMediaStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        console.log("Microphone initialized and ready to use.");
        return stream
    } catch (error) {
        console.error("Microphone access denied.", error);
        return null
    }
}

export const initialMicrophone = (
    stream?: MediaStream,
) => {
    if (!stream) {
        return null
    }
    return new MediaRecorder(stream)
}


export class RecordEndEvent extends Event {

    urlObject: string

    constructor(url: string) {
        super("record_ended");
        this.urlObject = url
    }
}
