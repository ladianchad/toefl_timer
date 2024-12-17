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
                alert("녹음 실패");
                return;
            }

            const audioBlob = new Blob(window.audioChunk, {type: window.audioChunk[0].type});
            const url = URL.createObjectURL(audioBlob);
            document.dispatchEvent(new RecordEndEvent(url))
        }
        recorder.start()
    }
}

export const getMediaStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                sampleRate: 16000,
                echoCancellation: true
            }
        });
        console.log("Microphone initialized and ready to use.");
        return stream
    } catch (error) {
        alert("마이크에 접근이 불가능 합니다.");
        console.error("Microphone access denied.", error);
        return null
    }
}

export const getMicrophone = (
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
