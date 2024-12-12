const speech = (text: string) => {
    if (!window.speechSynthesis) {
        alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // 언어 설정 (예: 'ko-KR'은 한국어)
    window.speechSynthesis.speak(utterance);
}

export default speech
