export const initialSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
        return null;
    }

    const speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.continuous = true; // 연속으로 듣기
    speechRecognition.interimResults = true; // 중간 결과 표시
    speechRecognition.lang = "ko-KR"; // 한국어 설정

    return speechRecognition;
}
