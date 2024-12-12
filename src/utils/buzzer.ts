import sleep from "./sleep";

const buzzer = async (duration: number = 1000, frequency : number = 440) => {
    // AudioContext 생성
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // 오실레이터 노드 생성
    const oscillator = audioCtx.createOscillator();

    // 오실레이터 설정
    oscillator.type = 'sine'; // 사인파 (삐 소리)
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); // 주파수 설정 (Hz)

    // 출력 연결
    oscillator.connect(audioCtx.destination);

    // 오실레이터 시작
    oscillator.start();

    await sleep(duration);
    oscillator.stop();
    audioCtx.close();
}

export default buzzer
