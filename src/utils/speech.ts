const speech = (utterance: SpeechSynthesisUtterance, text: string) => {
    if (!utterance) {
        return;
    }
    utterance.lang = "en-US"; // 언어 설정 (예: 'ko-KR'은 한국어)
    utterance.text = text;
    window.speechSynthesis.speak(utterance);
}

export const initSpeech = () => {
    const utterance = new SpeechSynthesisUtterance('');
    speechSynthesis.speak(utterance); // 빈 텍스트로 초기화
    return utterance;
}

export default speech
