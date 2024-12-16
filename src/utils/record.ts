export const startRecord = () => {

}

export const stopRecord = () => {

}

export const getRecordInstance = () => {

}

export const initialMicrophone = async () => {
    // 녹음 가능 환경일 경우 마이크 초기화
    try {
        console.log("Microphone initialized and ready to use.");

    } catch (error) {
        console.error("Microphone access denied.", error);
        alert("Please allow microphone access to use this application.");
    }
}
